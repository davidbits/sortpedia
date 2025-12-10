import type { SortEvent } from '../types';

export default function* (arr: number[]): Generator<SortEvent> {
	// Confirmed correct implementation
	// https://www.geeksforgeeks.org/dsa/selection-sort-algorithm-2/
	const n = arr.length;

	for (let i = 0; i < n - 1; i++) {
		// Assume the current position holds the minimum element
		let min_idx = i;

		// Initial Assumption Event
		yield {
			type: 'compare',
			text: `Current minimum assumed at index ${i}`,
			highlights: {
				[i]: 'bg-blue-600' // Current Min Marker
			}
		};

		for (let j = i + 1; j < n; j++) {
			// Scan Event
			const isSmaller = arr[j] < arr[min_idx];
			yield {
				type: 'compare',
				text: `Checking index ${j}: ${arr[j]} < ${arr[min_idx]}? ${isSmaller ? 'Yes' : 'No'}`,
				highlights: {
					[min_idx]: 'bg-blue-600', // Keep min highlighted
					[j]: 'bg-vis-compare' // Scanner
				}
			};

			if (isSmaller) {
				min_idx = j;
				// New Min Found Event
				yield {
					type: 'compare',
					text: `Found new minimum: ${arr[j]} at index ${j}`,
					highlights: {
						[min_idx]: 'bg-blue-600'
					}
				};
			}
		}

		// If the minimum element is not the one we started with, swap them
		if (min_idx !== i) {
			[arr[i], arr[min_idx]] = [arr[min_idx], arr[i]];
			// Swap Event
			yield {
				type: 'swap',
				text: `Swapping new minimum ${arr[i]} with ${arr[min_idx]}`,
				highlights: {
					[i]: 'bg-vis-swap',
					[min_idx]: 'bg-vis-swap'
				},
				writes: {
					[i]: arr[i],
					[min_idx]: arr[min_idx]
				}
			};
		}

		// Sorted Event
		yield {
			type: 'sorted',
			text: `Index ${i} is now sorted`,
			sorted: [i]
		};
	}

	// The last element is sorted by definition when the loop finishes
	if (n > 0) {
		yield { type: 'sorted', text: 'Final element sorted', sorted: [n - 1] };
	}
}
