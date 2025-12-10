import type { SortEvent } from '../types';

export default function* (arr: number[]): Generator<SortEvent> {
	// Confirmed correct implementation
	// https://www.geeksforgeeks.org/dsa/cocktail-sort/
	let swapped = true;
	let start = 0;
	let end = arr.length;

	while (swapped) {
		// Reset the swapped flag on entering the loop, as it might be true from a
		// previous iteration.
		swapped = false;

		// --- FORWARD PASS ---
		// Loop from left to right, similar to Bubble Sort.
		// After this pass, the largest element is at the end of the unsorted section.
		for (let i = start; i < end - 1; ++i) {
			yield {
				type: 'compare',
				text: `Forward Pass: Comparing ${arr[i]} and ${arr[i + 1]}`,
				highlights: {
					[i]: 'bg-vis-compare',
					[i + 1]: 'bg-vis-compare'
				}
			};
			if (arr[i] > arr[i + 1]) {
				[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
				swapped = true;
				yield {
					type: 'swap',
					text: `Swapping ${arr[i + 1]} with ${arr[i]}`,
					highlights: {
						[i]: 'bg-vis-swap',
						[i + 1]: 'bg-vis-swap'
					},
					writes: {
						[i]: arr[i],
						[i + 1]: arr[i + 1]
					}
				};
			}
		}

		// If no swaps occurred, the array is sorted.
		if (!swapped) break;

		// Mark the last-placed element as sorted and shrink the upper bound.
		end--;
		yield {
			type: 'sorted',
			text: `Element ${arr[end]} is sorted.`,
			sorted: [end]
		};

		// --- BACKWARD PASS ---
		// Reset the swapped flag so it can be used for the backward pass.
		swapped = false;

		// Loop from right to left.
		// After this pass, the smallest element is at the start of the unsorted section.
		for (let i = end - 1; i >= start; i--) {
			yield {
				type: 'compare',
				text: `Backward Pass: Comparing ${arr[i]} and ${arr[i + 1]}`,
				highlights: {
					[i]: 'bg-vis-compare',
					[i + 1]: 'bg-vis-compare'
				}
			};
			if (arr[i] > arr[i + 1]) {
				[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
				swapped = true;
				yield {
					type: 'swap',
					text: `Swapping ${arr[i + 1]} with ${arr[i]}`,
					highlights: {
						[i]: 'bg-vis-swap',
						[i + 1]: 'bg-vis-swap'
					},
					writes: {
						[i]: arr[i],
						[i + 1]: arr[i + 1]
					}
				};
			}
		}

		start++;
		yield {
			type: 'sorted',
			text: `Element ${arr[start - 1]} is sorted.`,
			sorted: [start - 1]
		};
	}

	// Final pass to mark all elements as sorted.
	const finalSorted = [];
	for (let k = 0; k < arr.length; k++) {
		finalSorted.push(k);
	}
	yield {
		type: 'sorted',
		text: 'Array is sorted.',
		sorted: finalSorted
	};
}
