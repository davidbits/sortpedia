import type { SortEvent } from '../types';

export default function* (arr: number[]): Generator<SortEvent> {
	// Confirmed correct implementation
	// https://www.geeksforgeeks.org/dsa/odd-even-sort-brick-sort/
	const n = arr.length;
	if (n <= 1) {
		if (n === 1) {
			yield {
				type: 'sorted',
				text: 'Array has only one element, it is already sorted.',
				sorted: [0]
			};
		}
		return;
	}

	let isSorted = false;
	while (!isSorted) {
		isSorted = true;

		// Odd phase: compare and swap elements at odd indices
		yield {
			type: 'phase',
			text: 'Starting ODD phase: comparing pairs (1,2), (3,4), ...',
			highlights: {}
		};
		for (let i = 1; i < n - 1; i += 2) {
			yield {
				type: 'compare',
				text: `Comparing odd pair at indices ${i} (${arr[i]}) and ${i + 1} (${arr[i + 1]})`,
				highlights: {
					[i]: 'bg-vis-compare',
					[i + 1]: 'bg-vis-compare'
				}
			};
			if (arr[i] > arr[i + 1]) {
				[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
				isSorted = false;
				yield {
					type: 'swap',
					text: `Swapping ${arr[i + 1]} and ${arr[i]}`,
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

		// Even phase: compare and swap elements at even indices
		yield {
			type: 'phase',
			text: 'Starting EVEN phase: comparing pairs (0,1), (2,3), ...',
			highlights: {}
		};
		for (let i = 0; i < n - 1; i += 2) {
			yield {
				type: 'compare',
				text: `Comparing even pair at indices ${i} (${arr[i]}) and ${i + 1} (${arr[i + 1]})`,
				highlights: {
					[i]: 'bg-vis-compare',
					[i + 1]: 'bg-vis-compare'
				}
			};
			if (arr[i] > arr[i + 1]) {
				[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
				isSorted = false;
				yield {
					type: 'swap',
					text: `Swapping ${arr[i + 1]} and ${arr[i]}`,
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

		if (isSorted) {
			yield {
				type: 'phase-end',
				text: 'No swaps occurred in the last full pass. The array is sorted.',
				highlights: {}
			};
		}
	}

	// Final pass to mark all elements as sorted for a clean visual finish.
	const allIndices = Array.from({ length: n }, (_, k) => k);
	yield {
		type: 'sorted',
		text: 'Array is sorted.',
		sorted: allIndices
	};
}
