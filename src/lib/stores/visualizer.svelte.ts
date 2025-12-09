import type { SortEvent, SortWorkerResponse } from '$lib/algorithms/types';
import { SvelteSet } from 'svelte/reactivity';

export class VisualizerEngine {
	// State
	array = $state<number[]>([]);
	trace = $state<SortEvent[]>([]);
	stepIndex = $state(0); // Raw index in the full event trace
	operationIndex = $state(0); // Counts only "compare", "swap", "write", etc.
	totalOperations = $state(0); // The total number of operational events in the trace
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
		// When the trace is finished, check the final state of the array.
		if (this.operationIndex >= this.totalOperations && this.totalOperations > 0) {
			// Use an internal check to see if the array is actually sorted.
			const isActuallySorted = this._isSortedCheck();
			return isActuallySorted ? 'Sorted!' : 'Failed to sort (max attempts reached)';
		}
		if (this.trace.length === 0 || this.stepIndex === 0) return 'Ready to sort';

		// We display the description of the *last executed* step or the *current active* step
		// depending on whether we are moving. Here we show what just happened/is happening.
		const event = this.stepIndex > 0 ? this.trace[this.stepIndex - 1] : this.trace[0];
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
				// This label is almost never seen because sorted events are instant are "merged" with the
				// prior event which takes label priority.
				return `Marked index ${i} as sorted`;
			case 'shuffle':
				return `Randomly shuffling all elements`;
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

		this.worker.onmessage = (e: MessageEvent<SortWorkerResponse>) => {
			const { trace } = e.data;
			this.trace = trace;
			this.totalOperations = trace.filter((event) => event.type !== 'sorted').length;
			this.play();
		};

		this.worker.postMessage({
			algorithm: algoId,
			array: [...this.initialArray]
		});
	}

	play() {
		if (this.operationIndex >= this.totalOperations) return;
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
		this.operationIndex = 0;
		this.totalOperations = 0;
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
		this.operationIndex = 0;
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
		if (this.operationIndex <= 0) return;

		const targetOperationIndex = this.operationIndex - 1;
		let operationalEventsFound = 0;
		let targetStepIndex = 0; // The raw index in the trace we need to play up to.

		// Find the raw trace index that corresponds to the end of the previous operational step.
		if (targetOperationIndex > 0) {
			for (let i = 0; i < this.trace.length; i++) {
				if (this.trace[i].type !== 'sorted') {
					operationalEventsFound++;
				}
				if (operationalEventsFound === targetOperationIndex) {
					targetStepIndex = i + 1;
					break;
				}
			}
		}

		// Reset and replay up to the target raw index
		this.array = [...this.initialArray];
		this.sortedIndices = new SvelteSet();
		this.stepIndex = 0;
		this.operationIndex = 0;

		for (let i = 0; i < targetStepIndex; i++) {
			const event = this.trace[i];
			this.applyEventData(event);
			if (event.type !== 'sorted') {
				this.operationIndex++;
			}
		}
		this.stepIndex = targetStepIndex;

		// Set visuals for the state we've just reverted to
		if (targetStepIndex > 0) {
			this.applyEventVisuals(this.trace[targetStepIndex - 1]);
		} else {
			this.activeIndices = [];
			this.eventType = null;
		}
	}

	/**
	 * Single step forward wrapper
	 */
	stepForward() {
		this.pause();
		if (this.operationIndex >= this.totalOperations) return;
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
				if (this.operationIndex >= this.totalOperations) {
					this.pause();
					this.activeIndices = [];
					this.eventType = null;
					// Final pass to ensure all bars are green
					this.trace.filter((e) => e.type === 'sorted').forEach((e) => this.applyEventData(e));
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
	 * Executes one OPERATIONAL step. Processes one operational event (compare, swap, etc.)
	 * and any subsequent 'sorted' events that follow it, making 'sorted' events instant.
	 */
	private step() {
		if (this.stepIndex >= this.trace.length) return;

		let operationalEventProcessed = false;
		while (this.stepIndex < this.trace.length && !operationalEventProcessed) {
			const event = this.trace[this.stepIndex];
			this.applyEventVisuals(event);
			this.applyEventData(event);

			if (event.type !== 'sorted') {
				this.operationIndex++;
				operationalEventProcessed = true;
			}
			this.stepIndex++;
		}
	}

	/**
	 * Internal helper to check if the current array is sorted.
	 * Does not yield events, for internal use only.
	 */
	private _isSortedCheck(): boolean {
		for (let i = 0; i < this.array.length - 1; i++) {
			if (this.array[i] > this.array[i + 1]) {
				return false;
			}
		}
		return true;
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
				case 'shuffle':
					return 'bg-vis-accent'; // Purple
			}
		}
		if (this.sortedIndices.has(index)) return 'bg-vis-sorted';
		return 'bg-vis-idle'; // Gray
	}
}

export const visualizer = new VisualizerEngine();
