import type { SortEvent } from '$lib/algorithms/types';
import { SvelteSet } from 'svelte/reactivity';

export class VisualizerEngine {
	// State
	array = $state<number[]>([]);
	trace = $state<SortEvent[]>([]);
	stepIndex = $state(0);
	isPlaying = $state(false);
	speed = $state(5); // 1-10

	// Active state for coloring bars
	activeIndices = $state<number[]>([]);
	sortedIndices = $state(new SvelteSet<number>());
	eventType = $state<SortEvent['type'] | null>(null);

	private worker: Worker | null = null;
	private timer: number | null = null;
	private initialArray: number[] = [];

	constructor(defaultSize = 50) {
		this.generateArray(defaultSize);
	}

	// Derived state for the text label
	get currentStepLabel(): string {
		if (this.stepIndex >= this.trace.length && this.trace.length > 0) return 'Sorted!';
		if (this.trace.length === 0 || this.stepIndex === 0) return 'Ready to sort';

		// We display the description of the *last executed* step or the *current active* step
		// depending on whether we are moving. Here we show what just happened/is happening.
		const event = this.trace[this.stepIndex - 1]; // -1 because stepIndex points to next
		if (!event) return 'Starting...';

		const [i, j] = event.indices;
		switch (event.type) {
			case 'compare':
				return `Comparing indices ${i} and ${j}`;
			case 'swap':
				return `Swapping values at ${i} and ${j}`;
			case 'write':
				return `Overwriting index ${i} with value ${event.value}`;
			case 'sorted':
				return `Marked index ${i} as sorted`;
			default:
				return 'Processing...';
		}
	}

	generateArray(size: number) {
		this.reset();
		this.array = Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
		this.initialArray = [...this.array];
	}

	setArray(newArray: number[]) {
		this.reset();
		this.array = [...newArray];
		this.initialArray = [...newArray];
	}

	async runAlgorithm(algoId: string) {
		this.resetPlayback();

		// Initialize Worker
		if (this.worker) this.worker.terminate();
		const WorkerModule = await import('$lib/logic/worker?worker');
		this.worker = new WorkerModule.default();

		this.worker.onmessage = (e) => {
			const { trace } = e.data;
			this.trace = trace;
			this.play();
		};

		this.worker.postMessage({
			algorithm: algoId,
			array: [...this.initialArray]
		});
	}

	play() {
		if (this.stepIndex >= this.trace.length) return;
		this.isPlaying = true;
		this.loop();
	}

	pause() {
		this.isPlaying = false;
		if (this.timer) cancelAnimationFrame(this.timer);
		this.timer = null;
	}

	reset() {
		this.pause();
		this.trace = [];
		this.stepIndex = 0;
		this.activeIndices = [];
		this.sortedIndices = new SvelteSet();
		this.eventType = null;
		if (this.initialArray.length > 0) {
			this.array = [...this.initialArray];
		}
	}

	resetPlayback() {
		this.pause();
		this.stepIndex = 0;
		this.activeIndices = [];
		this.sortedIndices = new SvelteSet();
		this.eventType = null;
		this.array = [...this.initialArray];
	}

	/**
	 * Steps backward by resetting to start and replaying history.
	 * Efficient enough for N < 500.
	 */
	stepBack() {
		this.pause();
		if (this.stepIndex <= 0) return;

		const targetIndex = this.stepIndex - 1;

		// 1. Reset Data
		this.array = [...this.initialArray];
		this.sortedIndices = new SvelteSet();

		// 2. Replay Logic (Data only) up to target - 1
		for (let i = 0; i < targetIndex; i++) {
			this.applyEventData(this.trace[i]);
		}

		// 3. Set Visuals for the target step (the one we are stepping "into")
		// If we go back to 0, clear visuals.
		if (targetIndex > 0) {
			const prevEvent = this.trace[targetIndex - 1];
			this.applyEventVisuals(prevEvent);
		} else {
			this.activeIndices = [];
			this.eventType = null;
		}

		this.stepIndex = targetIndex;
	}

	/**
	 * Single step forward wrapper
	 */
	stepForward() {
		this.pause();
		if (this.stepIndex >= this.trace.length) return;
		this.step();
	}

	private loop() {
		if (!this.isPlaying) return;

		// Define execute inside loop so it closes over `this`
		// but reads reactive `speed` property on every frame.
		const execute = () => {
			if (!this.isPlaying) return;

			// Dynamic Speed Calculation per frame
			// Speed 1-4: Adds delay. Speed 5-10: Batches operations.
			const opsPerFrame = this.speed >= 5 ? Math.pow(this.speed - 4, 2) : 1;
			const delay = this.speed < 5 ? (5 - this.speed) * 100 : 0;

			// Execute batch
			for (let i = 0; i < opsPerFrame; i++) {
				if (this.stepIndex >= this.trace.length) {
					this.pause();
					this.activeIndices = [];
					this.eventType = null;
					return;
				}
				this.step();
			}

			// Schedule next frame
			if (delay > 0) {
				setTimeout(() => {
					if (this.isPlaying) this.timer = requestAnimationFrame(execute);
				}, delay);
			} else {
				this.timer = requestAnimationFrame(execute);
			}
		};

		this.timer = requestAnimationFrame(execute);
	}

	/**
	 * Executes one step of the trace, updating both data and visuals
	 */
	step() {
		const event = this.trace[this.stepIndex];
		this.applyEventVisuals(event);
		this.applyEventData(event);
		this.stepIndex++;
	}

	private applyEventVisuals(event: SortEvent) {
		this.activeIndices = event.indices;
		this.eventType = event.type;
	}

	private applyEventData(event: SortEvent) {
		if (event.type === 'swap') {
			const [i, j] = event.indices;
			[this.array[i], this.array[j]] = [this.array[j], this.array[i]];
		} else if (event.type === 'write' && event.value !== undefined) {
			const [i] = event.indices;
			this.array[i] = event.value;
		} else if (event.type === 'sorted') {
			event.indices.forEach((i) => this.sortedIndices.add(i));
		}
	}

	getBarColor(index: number) {
		if (this.activeIndices.includes(index)) {
			switch (this.eventType) {
				case 'compare':
					return 'bg-vis-compare'; // Yellow
				case 'swap':
					return 'bg-vis-swap'; // Red
				case 'write':
					return 'bg-vis-write'; // Blue
				case 'sorted':
					return 'bg-vis-sorted'; // Green
			}
		}
		if (this.sortedIndices.has(index)) return 'bg-vis-sorted';
		return 'bg-vis-idle'; // Gray
	}
}

export const visualizer = new VisualizerEngine();
