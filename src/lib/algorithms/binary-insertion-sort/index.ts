import type { SortEvent } from '../types';

export default function* (arr: number[]): Generator<SortEvent> {
	// Confirmed correct implementation
	// https://www.baeldung.com/cs/binary-insertion-sort
	const n = arr.length;

	// The first element is effectively sorted.
	yield { type: 'sorted', indices: [0] };

	for (let i = 1; i < n; i++) {
		const key = arr[i];

		// 1. Binary Search Phase
		// We search within the sorted subarray arr[0...i-1].
		// We look for the 'upper bound' position: the first index where arr[index] > key.
		let low = 0;
		let high = i - 1;

		while (low <= high) {
			const mid = Math.floor((low + high) / 2);

			// Visual comparison: Comparing the sorted element at 'mid' against our 'key' (at index i)
			yield { type: 'compare', indices: [mid, i] };

			if (arr[mid] <= key) {
				// If equal, we move right to maintain stability (insert after the last duplicate)
				low = mid + 1;
			} else {
				high = mid - 1;
			}
		}

		// 'low' is now the target insertion index.

		// 2. Shifting Phase
		// Shift all elements from 'low' to 'i-1' one step to the right.
		// We iterate backwards to overwrite without losing data.
		for (let j = i - 1; j >= low; j--) {
			// Visualize the value moving to the right
			yield { type: 'write', indices: [j + 1], value: arr[j] };
			arr[j + 1] = arr[j];
		}

		// 3. Insertion Phase
		// Place the key into the calculated gap
		if (low !== i) {
			yield { type: 'write', indices: [low], value: key };
			arr[low] = key;
		}

		// Mark the newly processed index as part of the sorted section
		// (In reality, 0 to i is now sorted)
		for (let k = 0; k <= i; k++) {
			yield { type: 'sorted', indices: [k] };
		}
	}
}
