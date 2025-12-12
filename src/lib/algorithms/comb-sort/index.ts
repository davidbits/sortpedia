import type { SortEvent } from '../types';

export default function* (arr: number[]): Generator<SortEvent> {
	// Confirmed correct implementation
	// https://www.geeksforgeeks.org/dsa/comb-sort/
	const n = arr.length;
	let gap = n;
	let swapped = true;

	// The loop continues as long as the gap is greater than 1,
	// or if a swap occurred in the last pass (when gap is 1).
	while (gap !== 1 || swapped) {
		// Find the next gap
		const newGap = Math.floor((gap * 10) / 13);
		gap = newGap < 1 ? 1 : newGap;

		// Informational event about the gap change
		yield {
			type: 'info',
			text: `Shrinking gap to ${gap}.`
		};

		// Initialize swapped as false for this pass
		swapped = false;

		// Perform a gapped comparison pass, similar to Bubble Sort
		for (let i = 0; i < n - gap; i++) {
			const j = i + gap;

			// Comparison Event
			yield {
				type: 'compare',
				text: `Comparing elements at index ${i} and ${j} (gap: ${gap})`,
				highlights: {
					[i]: 'bg-vis-compare',
					[j]: 'bg-vis-compare'
				}
			};

			if (arr[i] > arr[j]) {
				// Swap elements
				const valI = arr[i];
				const valJ = arr[j];
				[arr[i], arr[j]] = [valJ, valI];

				// Swap Event
				yield {
					type: 'swap',
					text: `Swapping ${valI} and ${valJ}`,
					highlights: {
						[i]: 'bg-vis-swap',
						[j]: 'bg-vis-swap'
					},
					writes: {
						[i]: arr[i],
						[j]: arr[j]
					}
				};

				// A swap has occurred
				swapped = true;
			}
		}
	}

	// Final pass to mark all elements as sorted
	const allIndices = Array.from({ length: n }, (_, i) => i);
	yield {
		type: 'sorted',
		text: 'Array is sorted.',
		sorted: allIndices
	};
}
