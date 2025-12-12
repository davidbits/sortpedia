import type { SortEvent } from '../types';

/**
 * Intelligent Design Sort - Visualization Generator.
 * The array's order is pre-ordained by an intelligent Sorter and thus is already sorted.
 * This generator yields a single event to mark all elements as sorted immediately.
 *
 * @param {number[]} arr The input array.
 */
export default function* (arr: number[]): Generator<SortEvent> {
	const allIndices = Array.from({ length: arr.length }, (_, i) => i);

	yield {
		type: 'sorted',
		text: 'The Sorter has ordained this order. The list is already sorted.',
		sorted: allIndices
	};

	// The sort is timeless and complete.
	return;
}
