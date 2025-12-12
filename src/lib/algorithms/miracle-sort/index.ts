import type { SortEvent } from '../types';

const MAX_PASSES = 500; // Safety break to prevent infinite loops in the visualizer

export default function* (arr: number[]): Generator<SortEvent> {
	const n = arr.length;

	for (let pass = 1; pass <= MAX_PASSES; pass++) {
		yield {
			type: 'compare',
			text: `Pass ${pass}: Checking for a miracle...`
		};

		let isSorted = true;
		for (let i = 1; i < n; i++) {
			// Comparison Event
			const inOrder = arr[i] >= arr[i - 1];
			yield {
				type: 'compare',
				text: `Is ${arr[i - 1]} <= ${arr[i]}? ${inOrder ? 'Yes' : 'No'}.`,
				highlights: {
					[i - 1]: 'bg-vis-compare',
					[i]: 'bg-vis-compare'
				}
			};

			if (!inOrder) {
				isSorted = false;
				yield {
					type: 'compare',
					text: `Array is not sorted. Hoping for a miracle on the next pass.`,
					highlights: {
						[i - 1]: 'bg-vis-swap', // Use swap color for emphasis
						[i]: 'bg-vis-swap'
					}
				};
				break; // End this pass and try again
			}
		}

		if (isSorted) {
			const allIndices = Array.from({ length: n }, (_, k) => k);
			yield {
				type: 'sorted',
				text: 'A miracle occurred! The array is sorted.',
				sorted: allIndices
			};
			return; // The sort is complete
		}
	}

	// If the loop finishes, it means MAX_PASSES was reached without a miracle.
	yield {
		type: 'compare',
		text: `No miracle occurred after ${MAX_PASSES} passes. The universe remains indifferent.`
	};
}
