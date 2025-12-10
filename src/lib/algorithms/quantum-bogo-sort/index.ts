import type { SortEvent } from '../types';
import { QuantumEntropySource } from './tiny-quantum';

/**
 * Checks if the array is sorted. Yields descriptive 'compare' events for visualization.
 */
function* isSorted(arr: number[]): Generator<SortEvent, boolean> {
	for (let i = 0; i < arr.length - 1; i++) {
		const isOrdered = arr[i] <= arr[i + 1];

		yield {
			type: 'compare',
			text: `Checking if ${arr[i]} <= ${arr[i + 1]}... ${isOrdered ? 'Yes' : 'No!'}`,
			highlights: {
				[i]: isOrdered ? 'bg-vis-compare' : 'bg-vis-swap',
				[i + 1]: isOrdered ? 'bg-vis-compare' : 'bg-vis-swap'
			}
		};

		if (!isOrdered) {
			return false; // Found an unsorted pair, the check fails
		}
	}
	return true; // The entire array is sorted
}

/**
 * Shuffles the array in-place using the Fisher-Yates algorithm, powered by
 * a quantum source of entropy. Yields descriptive 'swap' events.
 */
function* quantumShuffle(arr: number[]): Generator<SortEvent> {
	const n = arr.length;
	// A single event to indicate the start of the shuffle process.
	const initialHighlights: Record<number, string> = {};
	for (let i = 0; i < n; i++) initialHighlights[i] = 'bg-vis-accent';

	yield {
		type: 'shuffle-start',
		text: 'Initiating quantum shuffle...',
		highlights: initialHighlights
	};

	if (n > 1) {
		for (let i = n - 1; i > 0; i--) {
			// Generate a quantum random index j such that 0 <= j <= i
			const j = QuantumEntropySource.getInt(0, i);

			// Perform the swap on the local array first
			[arr[i], arr[j]] = [arr[j], arr[i]];

			// Yield a single atomic event that updates both data and visuals
			yield {
				type: 'swap',
				text: `Quantumly swapping index ${i} with ${j}.`,
				highlights: {
					[i]: 'bg-vis-swap',
					[j]: 'bg-vis-swap'
				},
				writes: {
					[i]: arr[i],
					[j]: arr[j]
				}
			};
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
		const allIndices = Array.from({ length: arr.length }, (_, i) => i);
		yield {
			type: 'sorted',
			text: 'Success! The quantum superposition collapsed into a sorted state.',
			sorted: allIndices
		};
		return;
	}

	// If not sorted, destroy the universe.
	// We add a final event to make the visualization's end state explicit.
	yield {
		type: 'fail',
		text: 'Incorrect universe. Simulation terminated.',
		highlights: {}
	};
	return;
}
