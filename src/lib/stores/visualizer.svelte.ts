import type { SortEvent, SortWorkerResponse } from '$lib/algorithms/types';
import { SvelteSet } from 'svelte/reactivity';

export class VisualizerEngine {
	// State
	array = $state<number[]>([]);
	trace = $state<SortEvent[]>([]);
	stepIndex = $state(0); // Raw index in the full event trace
	operationIndex = $state(0); // Counts only "operational" events (filtered by type if needed)
	totalOperations = $state(0);
	isPlaying = $state(false);
	speed = $state(5); // 1-10

	// Active visual state
	activeHighlights = $state<Record<number, string>>({});
	currentText = $state<string>('Ready to sort');
	sortedIndices = $state(new SvelteSet<number>());

	private worker: Worker | null = null;
	private timer: number | null = null;
	private initialArray: number[] = [];

	constructor(defaultSize = 50) {
		this.generateArray(defaultSize);
	}

	// Derived state for the text label
	get currentStepLabel(): string {
		// When the trace is finished, check the final state of the array.
		/*if (this.operationIndex >= this.totalOperations && this.totalOperations > 0) {
			// Use an internal check to see if the array is actually sorted.
			const isActuallySorted = this._isSortedCheck();
			return isActuallySorted ? 'Sorted!' : 'Failed to sort (max attempts reached)';
		}*/
		return this.currentText;
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
			// We consider "compare", "swap", "write" as operations.
			// We can filter out pure "sorted" markers if they don't involve work,
			// but usually in this new system, every event is a step.
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
		this.activeHighlights = {};
		this.currentText = 'Ready to sort';
		this.sortedIndices = new SvelteSet();
		if (this.initialArray.length > 0) {
			this.array = [...this.initialArray];
		}
	}

	resetPlayback() {
		this.pause();
		this.stepIndex = 0;
		this.operationIndex = 0;
		this.activeHighlights = {};
		this.currentText = 'Ready to sort';
		this.sortedIndices = new SvelteSet();
		this.array = [...this.initialArray];
	}

	stepBack() {
		this.pause();
		if (this.stepIndex <= 0) return;

		// Simple implementation: Reset and replay up to stepIndex - 1
		// Optimized approaches exist, but this is robust for N < 200
		const targetStep = this.stepIndex - 1;

		this.array = [...this.initialArray];
		this.sortedIndices = new SvelteSet();
		this.operationIndex = 0;

		// Replay loop
		for (let i = 0; i < targetStep; i++) {
			this.applyEventData(this.trace[i]);
			if (this.trace[i].type !== 'sorted') this.operationIndex++;
		}

		this.stepIndex = targetStep;

		// Apply visuals of the previous step
		if (targetStep > 0) {
			const prevEvent = this.trace[targetStep - 1];
			this.activeHighlights = prevEvent.highlights || {};
			this.currentText = prevEvent.text;
		} else {
			this.activeHighlights = {};
			this.currentText = 'Ready to sort';
		}
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
					this.activeHighlights = {};
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

		const event = this.trace[this.stepIndex];

		// Apply Data
		this.applyEventData(event);

		// Apply Visuals
		this.activeHighlights = event.highlights || {};
		this.currentText = event.text;

		if (event.type !== 'sorted') {
			this.operationIndex++;
		}
		this.stepIndex++;
	}

	private applyEventData(event: SortEvent) {
		// Handle writes (swaps, overdubs)
		if (event.writes) {
			for (const [indexStr, value] of Object.entries(event.writes)) {
				const index = parseInt(indexStr);
				this.array[index] = value;
			}
		}

		// Handle persistent sorted marking
		if (event.sorted) {
			event.sorted.forEach((idx) => this.sortedIndices.add(idx));
		}
	}

	private _isSortedCheck(): boolean {
		for (let i = 0; i < this.array.length - 1; i++) {
			if (this.array[i] > this.array[i + 1]) return false;
		}
		return true;
	}

	getBarColor(index: number) {
		// 1. Current Step Highlight takes precedence
		if (this.activeHighlights[index]) {
			return this.activeHighlights[index];
		}
		// 2. Persistent Sorted State
		if (this.sortedIndices.has(index)) {
			return 'bg-vis-sorted';
		}
		// 3. Default
		return 'bg-vis-idle';
	}
}

export const visualizer = new VisualizerEngine();
