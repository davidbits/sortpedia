import type { SortEvent } from '../types';

/**
 * Checks if the array is sorted. Yields descriptive 'compare' events for visualization.
 */
function* isSorted(arr: number[]): Generator<SortEvent, boolean> {
	for (let i = 0; i < arr.length - 1; i++) {
		const isOrdered = arr[i] <= arr[i + 1];

		yield {
			type: 'compare',
			text: `Checking if ${arr[i]} <= ${arr[i + 1]}... ${isOrdered ? 'Yes' : 'No!'}`,
			highlights: {
				[i]: isOrdered ? 'bg-vis-compare' : 'bg-vis-swap',
				[i + 1]: isOrdered ? 'bg-vis-compare' : 'bg-vis-swap'
			}
		};

		if (!isOrdered) {
			return false; // Found an unsorted pair, the check fails
		}
	}
	return true; // The entire array is sorted
}

export default function* (arr: number[]): Generator<SortEvent> {
	// Confirmed correct implementation
	// https://xlinux.nist.gov/dads/HTML/bozoSort.html
	// A safety break is crucial for Bozo Sort to prevent browser lock-ups.
	const MAX_ATTEMPTS = 5000;
	let attempts = 0;

	while (attempts < MAX_ATTEMPTS) {
		const sorted = yield* isSorted(arr);

		if (sorted) {
			// Success! Mark all elements as sorted and terminate.
			const allIndices = Array.from({ length: arr.length }, (_, i) => i);
			yield {
				type: 'sorted',
				text: `Success! Array is sorted after ${attempts} random swap(s).`,
				sorted: allIndices
			};
			return;
		}

		// --- Bozo Sort Core Logic ---
		yield {
			type: 'meta', // A non-operational event for high-level text
			text: 'Array is not sorted. Picking two random elements to swap.'
		};

		// 1. Pick two random indices
		const index1 = Math.floor(Math.random() * arr.length);
		const index2 = Math.floor(Math.random() * arr.length);

		yield {
			type: 'compare',
			text: `Randomly selected indices ${index1} and ${index2}.`,
			highlights: {
				[index1]: 'bg-vis-accent',
				[index2]: 'bg-vis-accent'
			}
		};

		// 2. Swap the elements
		[arr[index1], arr[index2]] = [arr[index2], arr[index1]];

		yield {
			type: 'swap',
			text: `Swapping values at indices ${index1} and ${index2}.`,
			highlights: {
				[index1]: 'bg-vis-swap',
				[index2]: 'bg-vis-swap'
			},
			writes: {
				[index1]: arr[index1],
				[index2]: arr[index2]
			}
		};

		attempts++;
	}

	// If the loop finishes, it means we hit MAX_ATTEMPTS.
	yield {
		type: 'fail',
		text: `Failed to sort after ${MAX_ATTEMPTS} attempts.`,
		highlights: {}
	};
}
