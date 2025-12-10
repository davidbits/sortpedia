import type { SortEvent } from '../types';

// A shared counter to prevent browser lock-up.
// Passed as an object to be mutable across recursive calls.
interface OperationCounter {
	ops: number;
}
const MAX_OPERATIONS = 5000;

/**
 * Shuffles the first n elements of an array and yields a single atomic event.
 */
function* shuffle(
	arr: number[],
	n: number,
	counter: OperationCounter
): Generator<SortEvent, void, unknown> {
	if (counter.ops++ > MAX_OPERATIONS) return;

	// Perform the shuffle on the local array first
	let currentIndex = n;
	while (currentIndex !== 0) {
		const randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
	}

	// Create a map of all writes and highlights for a single, atomic update
	const writes: Record<number, number> = {};
	const highlights: Record<number, string> = {};
	for (let i = 0; i < n; i++) {
		writes[i] = arr[i];
		highlights[i] = 'bg-vis-accent';
	}

	yield {
		type: 'shuffle',
		text: `Randomly shuffling the first ${n} elements.`,
		highlights,
		writes
	};
}

/**
 * Recursively sorts the first n elements.
 */
function* bogobogoSortInternal(
	data: number[],
	n: number,
	counter: OperationCounter
): Generator<SortEvent, boolean, unknown> {
	if (n <= 1) return true;

	while (counter.ops < MAX_OPERATIONS) {
		// Step 2: Sort the first n-1 elements using the full BogoBogo procedure.
		// This involves creating a sublist and applying the main loop to it.
		const sublist = data.slice(0, n - 1);

		// Keep shuffling the sublist until isSortedBogobogo says it's sorted
		while (counter.ops < MAX_OPERATIONS) {
			const isSublistSorted = yield* isSortedBogobogo(sublist, counter);
			if (isSublistSorted) break;
			// This shuffle operates on the sublist, and its events will correctly
			// show shuffling on the first n-1 elements of the display.
			yield* shuffle(sublist, sublist.length, counter);
		}
		if (counter.ops >= MAX_OPERATIONS) return false;

		// Copy the sorted sublist back into the main data array
		for (let i = 0; i < sublist.length; i++) {
			if (data[i] !== sublist[i]) {
				data[i] = sublist[i];
				yield {
					type: 'write',
					text: `Copying sorted sub-element ${data[i]} to index ${i}.`,
					highlights: { [i]: 'bg-vis-write' },
					writes: { [i]: data[i] }
				};
			}
		}

		// Step 3: Check if the nth element is greater than the max of the first n-1.
		const isOrdered = data[n - 1] >= data[n - 2];
		yield {
			type: 'compare',
			text: `Is the last element ${data[n - 1]} >= ${data[n - 2]}? ${isOrdered ? 'Yes.' : 'No.'}`,
			highlights: {
				[n - 1]: 'bg-vis-compare',
				[n - 2]: 'bg-vis-compare'
			}
		};
		if (counter.ops++ > MAX_OPERATIONS) return false;

		if (isOrdered) {
			return true; // The first n elements are now sorted
		}

		// If not, randomize the first n elements and repeat the process.
		yield* shuffle(data, n, counter);
	}
	return false;
}

/**
 * The full 4-step "is sorted" check specific to Bogobogo Sort.
 */
function* isSortedBogobogo(
	originalData: number[],
	counter: OperationCounter
): Generator<SortEvent, boolean, unknown> {
	const n = originalData.length;
	if (n <= 1) return true;
	if (counter.ops >= MAX_OPERATIONS) return false;

	// Step 1: Make a copy
	const copy = originalData.slice();

	// Announce the recursive check
	yield {
		type: 'recursion-info',
		text: `Recursively sorting a copy of the first ${n} elements...`,
		highlights: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'bg-purple-300']))
	};

	// Steps 2 & 3: Sort the copy using the internal recursive sorter
	const sortedSuccessfully = yield* bogobogoSortInternal(copy, n, counter);
	if (!sortedSuccessfully) return false;

	yield {
		type: 'recursion-info',
		text: `...Finished recursive sort. Now comparing copy to original.`,
		highlights: {} // Clear purple highlight
	};

	// Step 4: Check if the "sorted" copy matches the original list
	for (let i = 0; i < n; i++) {
		if (counter.ops++ > MAX_OPERATIONS) return false;
		const matches = originalData[i] === copy[i];
		yield {
			type: 'compare',
			text: `Is original[${i}] (${originalData[i]}) same as sorted copy[${i}] (${copy[i]})? ${matches ? 'Yes.' : 'No.'}`,
			highlights: { [i]: 'bg-vis-compare' }
		};

		if (!matches) {
			return false; // They don't match, so originalData is not "sorted"
		}
	}

	return true; // They match, the check passes
}

/**
 * Main Bogobogo Sort function.
 */
export default function* (arr: number[]): Generator<SortEvent> {
	// Confirmed correct implementation
	// https://www.dangermouse.net/esoteric/bogobogosort.html
	const counter: OperationCounter = { ops: 0 };

	while (counter.ops < MAX_OPERATIONS) {
		const isSorted = yield* isSortedBogobogo(arr, counter);

		if (isSorted) {
			// Success! Mark all elements as sorted.
			const allIndices = Array.from({ length: arr.length }, (_, i) => i);
			yield {
				type: 'sorted',
				text: 'Success! The array is finally sorted.',
				sorted: allIndices
			};
			return;
		}

		// If not sorted, shuffle the entire array and try again.
		yield* shuffle(arr, arr.length, counter);
	}

	// If the loop terminates due to MAX_OPERATIONS
	yield {
		type: 'fail',
		text: `Failed to sort after ${MAX_OPERATIONS} operations.`,
		highlights: {}
	};
}
