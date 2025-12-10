import type { SortEvent } from '../types';

export default function* (arr: number[]): Generator<SortEvent> {
	// TODO: add naive + hoare versions and the pivot strategies
	// Confirmed correct implementation (NB: uses Lomuto partition scheme)
	// https://www.geeksforgeeks.org/dsa/quick-sort-algorithm/
	yield* quickSortHelper(arr, 0, arr.length - 1);

	// Final pass to ensure everything is marked sorted green
	const allIndices = Array.from({ length: arr.length }, (_, i) => i);
	yield {
		type: 'sorted',
		text: 'Finished: Array is sorted.',
		sorted: allIndices
	};
}

function* quickSortHelper(arr: number[], low: number, high: number): Generator<SortEvent> {
	if (low < high) {
		const pivotIndex = yield* partition(arr, low, high);
		// After partitioning, the pivot is in its final sorted place.
		yield {
			type: 'sorted',
			text: `Pivot ${arr[pivotIndex]} is now locked in its final sorted position.`,
			sorted: [pivotIndex]
		};

		yield* quickSortHelper(arr, low, pivotIndex - 1);
		yield* quickSortHelper(arr, pivotIndex + 1, high);
	} else if (low === high) {
		// Base case: A sub-array of one element is considered sorted.
		yield {
			type: 'sorted',
			text: `Base case: The section with element ${arr[low]} is sorted.`,
			sorted: [low]
		};
	}
}

function* partition(arr: number[], low: number, high: number): Generator<SortEvent, number> {
	const pivot = arr[high];
	let i = low - 1; // "Wall" pointer for elements smaller than pivot

	yield {
		type: 'pivot-select',
		text: `Partitioning from index ${low} to ${high}. Pivot is ${pivot}.`,
		highlights: {
			[high]: 'bg-purple-500' // Pivot color
		}
	};

	for (let j = low; j < high; j++) {
		// Compare scanner 'j' with pivot 'high'. Also show the 'wall' 'i'.
		const highlights: Record<number, string> = {
			[j]: 'bg-vis-compare', // Scanner
			[high]: 'bg-purple-500' // Pivot
		};
		if (i >= low) {
			highlights[i] = 'bg-blue-600'; // Wall
		}

		yield {
			type: 'compare',
			text: `Scanning: Is ${arr[j]} < pivot ${pivot}?`,
			highlights
		};

		if (arr[j] < pivot) {
			i++;
			[arr[i], arr[j]] = [arr[j], arr[i]];

			yield {
				type: 'swap',
				text: `Yes. Swapping ${arr[j]} with ${arr[i]} to move it behind the wall.`,
				highlights: {
					[i]: 'bg-vis-swap',
					[j]: 'bg-vis-swap',
					[high]: 'bg-purple-500' // Keep pivot visible
				},
				writes: {
					[i]: arr[i],
					[j]: arr[j]
				}
			};
		}
	}

	// Final swap to place the pivot in its correct sorted position
	const finalPivotIndex = i + 1;
	[arr[finalPivotIndex], arr[high]] = [arr[high], arr[finalPivotIndex]];

	yield {
		type: 'swap',
		text: `Placing pivot ${pivot} into its final position at index ${finalPivotIndex}.`,
		highlights: {
			[finalPivotIndex]: 'bg-vis-swap',
			[high]: 'bg-vis-swap'
		},
		writes: {
			[finalPivotIndex]: arr[finalPivotIndex],
			[high]: arr[high]
		}
	};

	return finalPivotIndex;
}
