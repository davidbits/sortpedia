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

/**
 * Shuffles the array in-place and yields a single atomic event to update the visuals and data.
 */
function* shuffle(arr: number[]): Generator<SortEvent> {
	// Perform the shuffle on the local array first
	let currentIndex = arr.length;
	while (currentIndex !== 0) {
		const randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
	}

	// Create a map of all writes and highlights for a single, atomic update
	const writes: Record<number, number> = {};
	const highlights: Record<number, string> = {};
	for (let i = 0; i < arr.length; i++) {
		writes[i] = arr[i];
		highlights[i] = 'bg-vis-accent';
	}

	yield {
		type: 'shuffle',
		text: 'Array is not sorted. Randomly shuffling all elements.',
		highlights,
		writes
	};
}

export default function* (arr: number[]): Generator<SortEvent> {
	// A safety break is crucial for Bogo Sort to prevent browser lock-ups.
	const MAX_ATTEMPTS = 5000;
	let attempts = 0;

	while (attempts < MAX_ATTEMPTS) {
		const sorted = yield* isSorted(arr);

		if (sorted) {
			// Success! Mark all elements as sorted and terminate.
			const allIndices = Array.from({ length: arr.length }, (_, i) => i);
			yield {
				type: 'sorted',
				text: `Success! Array is sorted after ${attempts} attempt(s).`,
				sorted: allIndices
			};
			return;
		}

		// If not sorted, perform a full shuffle.
		yield* shuffle(arr);
		attempts++;
	}

	// If the loop finishes, it means we hit MAX_ATTEMPTS.
	yield {
		type: 'fail',
		text: `Failed to sort after ${MAX_ATTEMPTS} attempts.`,
		highlights: {}
	};
}
