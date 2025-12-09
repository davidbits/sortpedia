import type { SortEvent } from '../types';
import { QuantumEntropySource } from './tiny-quantum';

/**
 * Checks if the array is sorted. Yields 'compare' events for visualization.
 */
function* isSorted(arr: number[]): Generator<SortEvent, boolean> {
	for (let i = 0; i < arr.length - 1; i++) {
		yield { type: 'compare', indices: [i, i + 1] };
		if (arr[i] > arr[i + 1]) {
			return false; // Found an unsorted pair, the check fails
		}
	}
	return true; // The entire array is sorted
}

/**
 * Shuffles the array in-place using the Fisher-Yates algorithm, powered by
 * a quantum source of entropy. Yields 'swap' events to visualize the process.
 */
function* quantumShuffle(arr: number[]): Generator<SortEvent> {
	const n = arr.length;
	// A single 'shuffle' event to color all bars, indicating the start of the process.
	yield { type: 'shuffle', indices: Array.from({ length: n }, (_, i) => i) };

	if (n > 1) {
		for (let i = n - 1; i > 0; i--) {
			// Generate a quantum random index j such that 0 <= j <= i
			const j = QuantumEntropySource.getInt(0, i);

			// Yield a swap event for visualization before performing the swap
			yield { type: 'swap', indices: [i, j] };
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
	}
}

/**
 * Implements the Quantum Bogo Sort algorithm.
 * 1. Performs a single "quantum" shuffle.
 * 2. Checks if the array is sorted.
 * 3. If sorted, completes successfully.
 * 4. If not sorted, it "destroys the universe" by halting immediately.
 */
export default function* (arr: number[]): Generator<SortEvent> {
	// 1. Generate a random permutation of input using a quantum source of entropy.
	yield* quantumShuffle(arr);

	// 2. Check if list is sorted.
	const sorted = yield* isSorted(arr);

	if (sorted) {
		// If we reach here, we are in the "correct" universe.
		// Mark all elements as sorted to turn them green.
		for (let i = 0; i < arr.length; i++) {
			yield { type: 'sorted', indices: [i] };
		}
		return;
	}

	// If not sorted, destroy the universe.
	// In our simulation, this means we simply stop the generator.
	// The visualizer will detect that the run ended without a sorted array
	// and display the "Failed to sort" message, perfectly simulating the concept.
	return;
}
