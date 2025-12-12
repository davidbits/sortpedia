import type { SortEvent } from '../types';

export default function* (arr: number[]): Generator<SortEvent> {
	// Confirmed correct implementation (NB: uses auto-stop optimization)
	// https://www.geeksforgeeks.org/dsa/bubble-sort-algorithm/
	const n = arr.length;
	let swapped;
	for (let i = 0; i < n - 1; i++) {
		swapped = false;
		for (let j = 0; j < n - i - 1; j++) {
			// Compare Event
			yield {
				type: 'compare',
				text: `Comparing indices ${j} (${arr[j]}) and ${j + 1} (${arr[j + 1]})`,
				highlights: {
					[j]: 'bg-vis-compare',
					[j + 1]: 'bg-vis-compare'
				}
			};

			if (arr[j] > arr[j + 1]) {
				// Swap Logic
				[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
				swapped = true;

				// Swap Event
				yield {
					type: 'swap',
					text: `Swapping ${arr[j + 1]} and ${arr[j]}`,
					highlights: {
						[j]: 'bg-vis-swap',
						[j + 1]: 'bg-vis-swap'
					},
					writes: {
						[j]: arr[j],
						[j + 1]: arr[j + 1]
					}
				};
			}
		}
		// Mark end element as sorted
		yield {
			type: 'sorted',
			text: `Index ${n - i - 1} is sorted`,
			sorted: [n - i - 1]
		};

		if (!swapped) break;
	}
	// Mark remaining as sorted
	const remaining = [];
	for (let i = 0; i < n; i++) remaining.push(i);
	yield {
		type: 'sorted',
		text: 'Array is sorted',
		sorted: remaining
	};
}
