import type { SortEvent } from '../types';

export default function* (arr: number[]): Generator<SortEvent> {
	// Confirmed correct implementation (NB: Uses shell's original gap sequence and doesn't write elements to themselves)
	// https://www.geeksforgeeks.org/dsa/shell-sort/
	const n = arr.length;

	// Start with a large gap, then reduce the gap.
	// Using Shell's original sequence: n/2, n/4, ..., 1
	for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
		// Announce the start of a new pass with the current gap size
		yield {
			type: 'info',
			text: `Starting pass with gap size: ${gap}`,
			highlights: {}
		};

		// Perform a gapped insertion sort for the current gap size.
		// Iterate through the elements starting from the first 'gap' position.
		for (let i = gap; i < n; i++) {
			// Store the current element to be inserted.
			const temp = arr[i];
			let j = i;

			// Announce the element being considered for insertion
			yield {
				type: 'select-key',
				text: `Selected element ${temp} (at index ${i}) for gapped insertion.`,
				highlights: {
					[i]: 'bg-purple-500' // Highlight the key
				}
			};

			// Compare the current element with the element 'gap' positions behind it.
			yield {
				type: 'compare',
				text: `Comparing ${arr[j - gap]} (at index ${j - gap}) with key ${temp}.`,
				highlights: {
					[j - gap]: 'bg-vis-compare',
					[i]: 'bg-purple-500'
				}
			};

			while (j >= gap && arr[j - gap] > temp) {
				// Shift the larger, gap-sorted element forward.
				const valueToShift = arr[j - gap];
				arr[j] = valueToShift;
				yield {
					type: 'write',
					text: `Shifting ${valueToShift} from index ${j - gap} to ${j}.`,
					highlights: {
						[j]: 'bg-vis-write', // The destination
						[j - gap]: 'bg-gray-400' // The source is now empty
					},
					writes: {
						[j]: valueToShift
					}
				};

				j -= gap;

				// Yield next comparison if the loop continues
				if (j >= gap) {
					yield {
						type: 'compare',
						text: `Continuing shift: Comparing ${arr[j - gap]} with key ${temp}.`,
						highlights: {
							[j - gap]: 'bg-vis-compare',
							[i]: 'bg-purple-500'
						}
					};
				}
			}

			// Place the stored element in its correct sorted position.
			if (j !== i) {
				arr[j] = temp;
				yield {
					type: 'write',
					text: `Inserting key ${temp} into its correct position at index ${j}.`,
					highlights: {
						[j]: 'bg-vis-sorted'
					},
					writes: {
						[j]: temp
					}
				};
			}
		}
	}

	// Final pass to mark all elements as sorted for a clean visual finish.
	const allIndices = Array.from({ length: n }, (_, k) => k);
	yield {
		type: 'sorted',
		text: 'Sort complete. All elements are in their final positions.',
		sorted: allIndices
	};
}
