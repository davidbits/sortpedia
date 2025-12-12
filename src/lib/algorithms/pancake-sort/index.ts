import type { SortEvent } from '../types';

export default function* (arr: number[]): Generator<SortEvent> {
	// Confirmed correct implementation
	// https://www.geeksforgeeks.org/dsa/pancake-sorting/
	const n = arr.length;

	/**
	 * Helper generator to perform and visualize a "Flip" operation.
	 * Reverses arr[0...k].
	 */
	function* performFlip(k: number): Generator<SortEvent> {
		let start = 0;
		let end = k;

		// Highlight the entire range being flipped first to show the "Spatula" effect
		const rangeHighlights: Record<number, string> = {};
		for (let i = 0; i <= k; i++) rangeHighlights[i] = 'bg-vis-compare';

		yield {
			type: 'compare',
			text: `Flipping sub-array from index 0 to ${k}`,
			highlights: rangeHighlights
		};

		while (start < end) {
			// Visualize the specific swap within the flip
			yield {
				type: 'swap',
				text: `Swapping indices ${start} and ${end} as part of flip`,
				highlights: {
					...rangeHighlights, // Keep the range highlighted
					[start]: 'bg-vis-swap',
					[end]: 'bg-vis-swap'
				},
				writes: {
					[start]: arr[end],
					[end]: arr[start]
				}
			};

			// Perform swap
			[arr[start], arr[end]] = [arr[end], arr[start]];
			start++;
			end--;
		}
	}

	// Main Pancake Sort Loop
	for (let curr_size = n; curr_size > 1; curr_size--) {
		// 1. Find index of the maximum element in arr[0..curr_size-1]
		let mi = 0;

		yield {
			type: 'compare',
			text: `Scanning for maximum in range [0...${curr_size - 1}]`,
			highlights: { [0]: 'bg-vis-compare' }
		};

		for (let i = 1; i < curr_size; i++) {
			yield {
				type: 'compare',
				text: `Comparing index ${i} (${arr[i]}) with current max at ${mi} (${arr[mi]})`,
				highlights: {
					[mi]: 'bg-purple-500', // Mark current max candidate
					[i]: 'bg-vis-compare'
				}
			};

			if (arr[i] > arr[mi]) {
				mi = i;
				yield {
					type: 'compare',
					text: `New maximum found at index ${mi}`,
					highlights: { [mi]: 'bg-purple-500' }
				};
			}
		}

		// 2. Move the maximum element to the end of the current array
		if (mi !== curr_size - 1) {
			// Step A: If max is not at the start, flip it to the start
			if (mi > 0) {
				yield {
					type: 'compare',
					text: `Max (${arr[mi]}) is not at top. Flipping it to index 0.`,
					highlights: { [mi]: 'bg-purple-500' }
				};
				yield* performFlip(mi);
			}

			// Step B: Now flip the max (currently at 0) to the end (curr_size - 1)
			yield {
				type: 'compare',
				text: `Max is at top. Flipping entire unsorted section (0 to ${curr_size - 1}).`,
				highlights: { [0]: 'bg-purple-500' }
			};
			yield* performFlip(curr_size - 1);
		} else {
			yield {
				type: 'compare',
				text: `Max element (${arr[mi]}) is already in correct position.`,
				highlights: { [mi]: 'bg-vis-sorted' }
			};
		}

		// Mark the last element of this iteration as sorted
		yield {
			type: 'sorted',
			text: `Index ${curr_size - 1} is now sorted`,
			sorted: [curr_size - 1]
		};
	}

	// Ensure the first element (index 0) is marked sorted at the very end
	yield {
		type: 'sorted',
		text: 'Array is sorted',
		sorted: [0]
	};
}
