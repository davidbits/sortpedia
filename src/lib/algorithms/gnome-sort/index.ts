import type { SortEvent } from '../types';

export default function* (arr: number[]): Generator<SortEvent> {
	// Confirmed correct implementation
	// https://www.geeksforgeeks.org/dsa/gnome-sort-a-stupid-one/
	const n = arr.length;
	let pos = 0; // This represents the gnome's position.

	while (pos < n) {
		// Condition 1: If the gnome is at the start, it can only move forward.
		if (pos === 0) {
			yield {
				type: 'move',
				text: `Gnome is at the start (index ${pos}), moves forward.`,
				highlights: {
					[pos]: 'bg-purple-500'
				}
			};
			pos++; // Move the gnome forward.
		}
		// Condition 2: If the current element is in order relative to the previous, move forward.
		else if (arr[pos] >= arr[pos - 1]) {
			yield {
				type: 'compare',
				text: `In order: ${arr[pos - 1]} <= ${arr[pos]}. Gnome moves forward.`,
				highlights: {
					[pos]: 'bg-purple-500', // Gnome's current position
					[pos - 1]: 'bg-vis-compare' // What it's comparing against
				},
				// The gnome is moving past this, so it's sorted relative to its left side.
				sorted: [pos - 1]
			};
			pos++; // Move the gnome forward.
		} else {
			// The current element is smaller than the previous one, so they are out of order.
			yield {
				type: 'compare',
				text: `Out of order: ${arr[pos - 1]} > ${arr[pos]}. Swapping.`,
				highlights: {
					[pos]: 'bg-vis-swap',
					[pos - 1]: 'bg-vis-swap'
				}
			};

			// Swap the elements.
			[arr[pos], arr[pos - 1]] = [arr[pos - 1], arr[pos]];
			yield {
				type: 'swap',
				text: `Swap complete. Gnome moves back to re-check.`,
				highlights: {
					[pos]: 'bg-vis-swap',
					[pos - 1]: 'bg-vis-swap'
				},
				writes: {
					[pos]: arr[pos],
					[pos - 1]: arr[pos - 1]
				}
			};

			// Move the gnome backward to carry the smaller element to its correct position.
			pos--;
		}
	}

	// Final pass to mark all elements as sorted for a clean visual finish.
	const allIndices = Array.from({ length: n }, (_, k) => k);
	yield {
		type: 'sorted',
		text: 'Gnome reached the end. The array is sorted!',
		sorted: allIndices
	};
}
