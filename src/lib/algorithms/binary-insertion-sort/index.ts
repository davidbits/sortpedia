import type { SortEvent } from '../types';

export default function* (arr: number[]): Generator<SortEvent> {
	// Confirmed correct implementation
	// https://www.baeldung.com/cs/binary-insertion-sort
	const n = arr.length;

	// The first element is effectively sorted.
	if (n > 0) {
		yield {
			type: 'sorted',
			text: 'Marking the first element as sorted.',
			sorted: [0]
		};
	}

	for (let i = 1; i < n; i++) {
		const key = arr[i];

		// Announce key selection
		yield {
			type: 'select-key',
			text: `Selecting element ${key} to insert into the sorted section.`,
			highlights: {
				[i]: 'bg-purple-500' // Custom color for the 'key'
			}
		};

		// 1. Binary Search Phase
		// We search within the sorted subarray arr[0...i-1].
		// We look for the 'upper bound' position: the first index where arr[index] > key.
		let low = 0;
		let high = i - 1;

		while (low <= high) {
			const mid = Math.floor((low + high) / 2);

			// Visual comparison: Comparing the sorted element at 'mid' against our 'key'
			yield {
				type: 'compare',
				text: `Binary Search: Is key ${key} > ${arr[mid]} at index ${mid}?`,
				highlights: {
					[mid]: 'bg-vis-compare',
					[i]: 'bg-purple-500'
				}
			};

			if (arr[mid] <= key) {
				// If equal, we move right to maintain stability (insert after the last duplicate)
				low = mid + 1;
			} else {
				high = mid - 1;
			}
		}

		// 'low' is now the target insertion index.
		yield {
			type: 'target-found',
			text: `Found insertion point for ${key} at index ${low}.`,
			highlights: {
				[i]: 'bg-purple-500', // Keep key highlighted
				[low]: 'bg-orange-400' // Mark the target spot
			}
		};

		// 2. Shifting Phase
		// Shift all elements from 'low' to 'i-1' one step to the right.
		// We iterate backwards to overwrite without losing data.
		for (let j = i - 1; j >= low; j--) {
			const valueToShift = arr[j];
			arr[j + 1] = valueToShift; // Perform the shift

			yield {
				type: 'write',
				text: `Shifting ${valueToShift} from ${j} to ${j + 1} to make space.`,
				highlights: {
					[j + 1]: 'bg-vis-write',
					[j]: 'bg-gray-400'
				},
				writes: {
					[j + 1]: valueToShift
				}
			};
		}

		// 3. Insertion Phase
		// Place the key into the calculated gap
		if (low !== i) {
			arr[low] = key; // Perform the insertion
			yield {
				type: 'write',
				text: `Inserting key ${key} at index ${low}.`,
				highlights: {
					[low]: 'bg-vis-sorted'
				},
				writes: {
					[low]: key
				}
			};
		}

		// Mark the newly processed section as sorted
		const sortedSoFar = [];
		for (let k = 0; k <= i; k++) {
			sortedSoFar.push(k);
		}
		yield {
			type: 'sorted',
			text: `The section from index 0 to ${i} is now sorted.`,
			sorted: sortedSoFar
		};
	}
}
