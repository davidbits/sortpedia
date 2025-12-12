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
	yield {
		type: 'info',
		text: 'Building Max Heap from the array.',
		highlights: {}
	};
	// Start from the last non-leaf node and move up to the root.
	// Node at index i has children at 2i+1 and 2i+2.
	for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
		yield* heapify(arr, n, i);
	}

	yield {
		type: 'info',
		text: 'Max Heap built. Starting extraction phase.',
		highlights: {}
	};

	// Step 2: Extract elements from the heap one by one.
	for (let i = n - 1; i > 0; i--) {
		// Announce the upcoming swap
		yield {
			type: 'compare',
			text: `Moving max element ${arr[0]} to its sorted position at index ${i}.`,
			highlights: {
				[0]: 'bg-purple-500', // Max element at root
				[i]: 'bg-orange-400' // Target position
			}
		};

		// Move current root (maximum element) to the end (index i)
		const rootValue = arr[0];
		const endValue = arr[i];
		[arr[0], arr[i]] = [endValue, rootValue]; // Perform swap
		yield {
			type: 'swap',
			text: `Swapped ${endValue} with ${rootValue}.`,
			highlights: {
				[0]: 'bg-vis-swap',
				[i]: 'bg-vis-swap'
			},
			writes: {
				[0]: endValue,
				[i]: rootValue
			}
		};

		// The element at index 'i' is now in its final sorted position.
		yield {
			type: 'sorted',
			text: `Locked ${rootValue} in sorted position.`,
			sorted: [i]
		};

		// Call max heapify on the reduced heap (size i) starting from root (0)
		yield {
			type: 'info',
			text: `Restoring Max Heap property for reduced heap (size ${i}).`,
			highlights: {}
		};
		yield* heapify(arr, i, 0);
	}

	// The loop ends when 1 element is left, which is sorted by definition.
	if (n > 0) {
		yield {
			type: 'sorted',
			text: 'Final element is sorted.',
			sorted: [0]
		};
	}
}

/**
 * Recursive function to maintain the Max-Heap property.
 * Sifts the node at index 'i' down to its correct position.
 *
 * @param arr The array being sorted
 * @param n The size of the current heap
 * @param i The index of the node to heapify
 */
function* heapify(arr: number[], n: number, i: number): Generator<SortEvent> {
	let largest = i; // Parent node
	const l = 2 * i + 1; // Left child index
	const r = 2 * i + 2; // Right child index

	// Check if left child exists and is greater than parent
	if (l < n) {
		yield {
			type: 'compare',
			text: `Heapify: Is left child ${arr[l]} > parent ${arr[largest]}?`,
			highlights: {
				[l]: 'bg-vis-compare',
				[largest]: 'bg-blue-600' // Parent
			}
		};
		if (arr[l] > arr[largest]) {
			largest = l;
		}
	}

	// Check if right child exists and is greater than the largest so far
	if (r < n) {
		yield {
			type: 'compare',
			text: `Heapify: Is right child ${arr[r]} > current largest ${arr[largest]}?`,
			highlights: {
				[r]: 'bg-vis-compare',
				[largest]: 'bg-blue-600' // Largest so far
			}
		};
		if (arr[r] > arr[largest]) {
			largest = r;
		}
	}

	// If the largest element is not the original parent, swap and continue heapifying
	if (largest !== i) {
		const parentValue = arr[i];
		const largestValue = arr[largest];
		[arr[i], arr[largest]] = [largestValue, parentValue]; // Perform swap
		yield {
			type: 'swap',
			text: `Sifting down: Swapping parent ${parentValue} with larger child ${largestValue}.`,
			highlights: {
				[i]: 'bg-vis-swap',
				[largest]: 'bg-vis-swap'
			},
			writes: {
				[i]: largestValue,
				[largest]: parentValue
			}
		};

		// Recursively heapify the affected sub-tree
		yield* heapify(arr, n, largest);
	}
}
