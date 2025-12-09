import type { SortEvent } from '../types';

export default function* (arr: number[]): Generator<SortEvent> {
	// Confirmed correct implementation
	// https://www.geeksforgeeks.org/dsa/selection-sort-algorithm-2/
	const n = arr.length;

	for (let i = 0; i < n - 1; i++) {
		// Assume the current position holds the minimum element
		let min_idx = i;

		// Iterate through the unsorted portion to find the actual minimum
		for (let j = i + 1; j < n; j++) {
			// Yield a 'compare' event for visualization
			yield { type: 'compare', indices: [j, min_idx] };
			if (arr[j] < arr[min_idx]) {
				// Update min_idx if a smaller element is found
				min_idx = j;
			}
		}

		// If the minimum element is not the one we started with, swap them
		if (min_idx !== i) {
			[arr[i], arr[min_idx]] = [arr[min_idx], arr[i]];
			// Yield a 'swap' event for visualization
			yield { type: 'swap', indices: [i, min_idx] };
		}

		// The element at index 'i' is now in its correct, sorted position
		yield { type: 'sorted', indices: [i] };
	}

	// The last element is sorted by definition when the loop finishes
	if (n > 0) {
		yield { type: 'sorted', indices: [n - 1] };
	}
}
