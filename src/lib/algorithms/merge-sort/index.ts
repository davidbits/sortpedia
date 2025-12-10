import type { SortEvent } from '../types';

// Helper to copy array for the worker to avoid mutation issues
const clone = (arr: number[]) => [...arr];

export default function* (arr: number[]): Generator<SortEvent> {
	// Confirmed correct implementation (NB: uses auxiliary array instead of temp arrays)
	// https://www.geeksforgeeks.org/dsa/merge-sort/
	yield* mergeSortHelper(arr, 0, arr.length - 1, clone(arr));

	// TODO: Each unmerged section is marked as sorted with green colour, even though the full array is not yet sorted.

	// Final success event
	const allIndices = Array.from({ length: arr.length }, (_, i) => i);
	yield {
		type: 'sorted',
		text: 'Array is fully sorted.',
		sorted: allIndices
	};
}

function* mergeSortHelper(
	arr: number[],
	left: number,
	right: number,
	aux: number[]
): Generator<SortEvent> {
	if (left >= right) return;
	const mid = Math.floor(left + (right - left) / 2);

	// Note: Roles of arr and aux are swapped here intentionally by the algorithm
	yield* mergeSortHelper(aux, left, mid, arr);
	yield* mergeSortHelper(aux, mid + 1, right, arr);

	yield* merge(arr, aux, left, mid, right);
}

function* merge(
	arr: number[],
	aux: number[],
	left: number,
	mid: number,
	right: number
): Generator<SortEvent> {
	let i = left; // Pointer for left subarray (in aux)
	let j = mid + 1; // Pointer for right subarray (in aux)
	let k = left; // Pointer for main array (writing destination)

	// Announce the merge operation
	const mergeRangeHighlights: Record<number, string> = {};
	for (let m = left; m <= right; m++) {
		mergeRangeHighlights[m] = 'bg-gray-400';
	}
	yield {
		type: 'merge-start',
		text: `Merging subarrays from index ${left} to ${right}.`,
		highlights: mergeRangeHighlights
	};

	while (i <= mid && j <= right) {
		// Comparison event
		yield {
			type: 'compare',
			text: `Comparing left pointer (${aux[i]}) and right pointer (${aux[j]})`,
			highlights: {
				[i]: 'bg-blue-500', // Left pointer
				[j]: 'bg-purple-500' // Right pointer
			}
		};

		if (aux[i] <= aux[j]) {
			arr[k] = aux[i];
			// Write event for left element
			yield {
				type: 'write',
				text: `Writing smaller value ${aux[i]} to index ${k}.`,
				highlights: {
					[k]: 'bg-vis-write'
				},
				writes: {
					[k]: aux[i]
				}
			};
			i++;
		} else {
			arr[k] = aux[j];
			// Write event for right element
			yield {
				type: 'write',
				text: `Writing smaller value ${aux[j]} to index ${k}.`,
				highlights: {
					[k]: 'bg-vis-write'
				},
				writes: {
					[k]: aux[j]
				}
			};
			j++;
		}
		k++;
	}

	// Copy remaining elements from the left subarray
	while (i <= mid) {
		arr[k] = aux[i];
		yield {
			type: 'write',
			text: `Copying leftover left element ${aux[i]} to index ${k}.`,
			highlights: {
				[k]: 'bg-vis-write',
				[i]: 'bg-blue-500'
			},
			writes: {
				[k]: aux[i]
			}
		};
		i++;
		k++;
	}

	// Copy remaining elements from the right subarray
	while (j <= right) {
		arr[k] = aux[j];
		yield {
			type: 'write',
			text: `Copying leftover right element ${aux[j]} to index ${k}.`,
			highlights: {
				[k]: 'bg-vis-write',
				[j]: 'bg-purple-500'
			},
			writes: {
				[k]: aux[j]
			}
		};
		j++;
		k++;
	}

	// Mark the merged section as sorted relative to itself
	const sortedRange = [];
	for (let s = left; s <= right; s++) {
		sortedRange.push(s);
	}
	yield {
		type: 'sorted-range',
		text: `Subarray from ${left} to ${right} is now sorted.`,
		sorted: sortedRange
	};
}
