import type { SortEvent } from '../types';

export default function* (arr: number[]): Generator<SortEvent> {
	// Confirmed correct implementation
	// https://www.geeksforgeeks.org/dsa/introsort-or-introspective-sort/
	const n = arr.length;
	// Standard depth limit is 2 * log2(n)
	const depthLimit = 2 * Math.floor(Math.log2(n));

	yield* introSortUtil(arr, 0, n - 1, depthLimit);

	// Final pass to ensure visualization marks everything as sorted
	for (let i = 0; i < n; i++) {
		yield { type: 'sorted', indices: [i] };
	}
}

function* introSortUtil(
	arr: number[],
	begin: number,
	end: number,
	depthLimit: number
): Generator<SortEvent> {
	const size = end - begin + 1;

	// Case 1: If partition size is small, fall back to Insertion Sort.
	// 16 is the standard threshold derived from empirical research.
	if (size < 16) {
		yield* insertionSort(arr, begin, end);
		return;
	}

	// Case 2: If recursion depth exceeds limit, switch to Heap Sort
	// to guarantee O(n log n) worst-case.
	if (depthLimit === 0) {
		yield* heapSort(arr, begin, end);
		return;
	}

	// Case 3: Standard Quick Sort Partitioning with Median-of-Three
	const pivotIndex = yield* medianOfThree(arr, begin, begin + Math.floor(size / 2), end);

	// Move pivot to the end for partitioning
	yield { type: 'swap', indices: [pivotIndex, end] };
	[arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];

	// Partition the array
	const partitionPoint = yield* partition(arr, begin, end);

	// Recurse
	yield* introSortUtil(arr, begin, partitionPoint - 1, depthLimit - 1);
	yield* introSortUtil(arr, partitionPoint + 1, end, depthLimit - 1);
}

/**
 * Standard Insertion Sort restricted to a specific range.
 */
function* insertionSort(arr: number[], left: number, right: number): Generator<SortEvent> {
	for (let i = left + 1; i <= right; i++) {
		const key = arr[i];
		let j = i - 1;

		// Visualize selection of key
		yield { type: 'compare', indices: [i, j] };

		while (j >= left && arr[j] > key) {
			yield { type: 'write', indices: [j + 1], value: arr[j] };
			arr[j + 1] = arr[j];
			j--;
			if (j >= left) {
				yield { type: 'compare', indices: [i, j] }; // Visual comparison against key context
			}
		}
		arr[j + 1] = key;
		yield { type: 'write', indices: [j + 1], value: key };
	}
}

/**
 * Heap Sort restricted to a specific range.
 * Treats arr[low...high] as a standalone array for heap operations.
 */
function* heapSort(arr: number[], low: number, high: number): Generator<SortEvent> {
	const n = high - low + 1;

	// Build Max Heap
	for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
		yield* heapify(arr, n, i, low);
	}

	// Extract elements
	for (let i = n - 1; i > 0; i--) {
		// Swap root (max) with end of current heap
		yield { type: 'swap', indices: [low, low + i] };
		[arr[low], arr[low + i]] = [arr[low + i], arr[low]];

		// Restore heap property
		yield* heapify(arr, i, 0, low);
	}
}

/**
 * Heapify helper that accounts for a 'low' offset.
 * @param arr The array
 * @param n Size of the heap
 * @param i Index to heapify (relative to low)
 * @param low Absolute start index of the sub-array
 */
function* heapify(arr: number[], n: number, i: number, low: number): Generator<SortEvent> {
	let largest = i;
	const l = 2 * i + 1;
	const r = 2 * i + 2;

	// Compare left child
	if (l < n) {
		yield { type: 'compare', indices: [low + l, low + largest] };
		if (arr[low + l] > arr[low + largest]) {
			largest = l;
		}
	}

	// Compare right child
	if (r < n) {
		yield { type: 'compare', indices: [low + r, low + largest] };
		if (arr[low + r] > arr[low + largest]) {
			largest = r;
		}
	}

	if (largest !== i) {
		yield { type: 'swap', indices: [low + i, low + largest] };
		[arr[low + i], arr[low + largest]] = [arr[low + largest], arr[low + i]];
		yield* heapify(arr, n, largest, low);
	}
}

/**
 * Finds the index of the Median of Three (a, b, d) without modifying the array.
 */
function* medianOfThree(
	arr: number[],
	a: number,
	b: number,
	d: number
): Generator<SortEvent, number> {
	const A = arr[a];
	const B = arr[b];
	const C = arr[d];

	// Yield comparisons for visualization
	yield { type: 'compare', indices: [a, b] };
	yield { type: 'compare', indices: [b, d] };
	yield { type: 'compare', indices: [a, d] };

	if ((A <= B && B <= C) || (C <= B && B <= A)) return b;
	if ((B <= A && A <= C) || (C <= A && A <= B)) return a;
	if ((B <= C && C <= A) || (A <= C && C <= B)) return d;

	return b; // Fallback
}

/**
 * Standard Lomuto partition scheme.
 * Assumes pivot is already placed at arr[high].
 */
function* partition(arr: number[], low: number, high: number): Generator<SortEvent, number> {
	const pivot = arr[high];
	let i = low - 1;

	for (let j = low; j < high; j++) {
		yield { type: 'compare', indices: [j, high] };
		if (arr[j] <= pivot) {
			i++;
			yield { type: 'swap', indices: [i, j] };
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
	}
	yield { type: 'swap', indices: [i + 1, high] };
	[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

	return i + 1;
}
