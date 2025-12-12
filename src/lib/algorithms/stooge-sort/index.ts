import type { SortEvent } from '../types';

/**
 * Helper function to create a highlight object for a range of indices.
 */
function createRangeHighlight(start: number, end: number, color: string): Record<number, string> {
	const highlights: Record<number, string> = {};
	for (let i = start; i <= end; i++) {
		highlights[i] = color;
	}
	return highlights;
}

/**
 * The recursive generator function that implements the Stooge Sort logic
 * and yields events for visualization.
 */
function* stoogeSortRecursive(arr: number[], l: number, h: number): Generator<SortEvent> {
	if (l >= h) {
		// Base case for the recursion
		return;
	}

	// Compare and, if necessary, swap the first and last elements of the sub-array
	yield {
		type: 'compare',
		text: `Comparing ends of sub-array [${l}..${h}]: arr[${l}] (${arr[l]}) vs arr[${h}] (${arr[h]})`,
		highlights: { [l]: 'bg-vis-compare', [h]: 'bg-vis-compare' }
	};
	if (arr[l] > arr[h]) {
		[arr[l], arr[h]] = [arr[h], arr[l]];
		yield {
			type: 'swap',
			text: `Swapping arr[${l}] and arr[${h}]`,
			highlights: { [l]: 'bg-vis-swap', [h]: 'bg-vis-swap' },
			writes: { [l]: arr[l], [h]: arr[h] }
		};
	}

	const size = h - l + 1;
	if (size > 2) {
		const t = Math.floor(size / 3);
		const firstPartEnd = h - t;
		const lastPartStart = l + t;

		// 1. Recursively sort the initial two-thirds
		yield {
			type: 'recursion',
			text: `Recursive Call 1: Sort first 2/3 [${l}..${firstPartEnd}]`,
			highlights: createRangeHighlight(l, firstPartEnd, 'bg-purple-500')
		};
		yield* stoogeSortRecursive(arr, l, firstPartEnd);

		// 2. Recursively sort the final two-thirds
		yield {
			type: 'recursion',
			text: `Recursive Call 2: Sort last 2/3 [${lastPartStart}..${h}]`,
			highlights: createRangeHighlight(lastPartStart, h, 'bg-blue-600')
		};
		yield* stoogeSortRecursive(arr, lastPartStart, h);

		// 3. Recursively sort the initial two-thirds again
		yield {
			type: 'recursion',
			text: `Recursive Call 3: Re-sort first 2/3 [${l}..${firstPartEnd}]`,
			highlights: createRangeHighlight(l, firstPartEnd, 'bg-purple-500')
		};
		yield* stoogeSortRecursive(arr, l, firstPartEnd);
	}
}

/**
 * The main export that the sort worker will call.
 * This sets up the initial call to the recursive Stooge Sort function.
 */
export default function* (arr: number[]): Generator<SortEvent> {
	yield* stoogeSortRecursive(arr, 0, arr.length - 1);

	// After the main sort is done, mark all elements as sorted for the visualizer
	const allIndices = Array.from({ length: arr.length }, (_, i) => i);
	yield {
		type: 'sorted',
		text: 'Array is sorted',
		sorted: allIndices
	};
}
