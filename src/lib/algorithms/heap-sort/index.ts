import type { SortEvent } from '../types';

/**
 * Main Heap Sort generator.
 * Implements the standard algorithm: Build Max Heap -> Extract Max -> Heapify.
 */
export default function* (arr: number[]): Generator<SortEvent> {
	// Confirmed correct implementation
	// https://www.geeksforgeeks.org/dsa/heap-sort/
	const n = arr.length;

	// Step 1: Build the Max Heap.
	// Start from the last non-leaf node and move up to the root.
	// Node at index i has children at 2i+1 and 2i+2.
	for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
		yield* heapify(arr, n, i);
	}

	// Step 2: Extract elements from the heap one by one.
	for (let i = n - 1; i > 0; i--) {
		// Yield comparison before swap (implicitly comparing root to end target)
		yield { type: 'compare', indices: [0, i] };

		// Move current root (maximum element) to the end (index i)
		[arr[0], arr[i]] = [arr[i], arr[0]];
		yield { type: 'swap', indices: [0, i] };

		// The element at index 'i' is now in its final sorted position.
		yield { type: 'sorted', indices: [i] };

		// Call max heapify on the reduced heap (size i) starting from root (0)
		yield* heapify(arr, i, 0);
	}

	// The loop ends when 1 element is left, which is sorted by definition.
	if (n > 0) {
		yield { type: 'sorted', indices: [0] };
	}
}

/**
 * Recursive function to maintain the Max-Heap property.
 * Checks if the node at index 'i' is smaller than its children and "sifts it down".
 *
 * @param arr The array being sorted
 * @param n The size of the current heap (elements beyond this index are already sorted)
 * @param i The index of the node to heapify
 */
function* heapify(arr: number[], n: number, i: number): Generator<SortEvent> {
	let largest = i;
	const l = 2 * i + 1; // Left child index
	const r = 2 * i + 2; // Right child index

	// Check if left child exists and is greater than root
	if (l < n) {
		yield { type: 'compare', indices: [l, largest] };
		if (arr[l] > arr[largest]) {
			largest = l;
		}
	}

	// Check if right child exists and is greater than largest so far
	if (r < n) {
		yield { type: 'compare', indices: [r, largest] };
		if (arr[r] > arr[largest]) {
			largest = r;
		}
	}

	// If largest is not root, swap and continue heapifying
	if (largest !== i) {
		[arr[i], arr[largest]] = [arr[largest], arr[i]];
		yield { type: 'swap', indices: [i, largest] };

		// Recursively heapify the affected sub-tree
		yield* heapify(arr, n, largest);
	}
}
