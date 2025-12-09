import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'heap-sort',
	name: 'Heap Sort',
	category: 'Selection',
	complexity: {
		best: 'O(n \\log n)',
		average: 'O(n \\log n)',
		worst: 'O(n \\log n)',
		space: 'O(\\log n)' // Based on recursive call stack depth
	},
	stable: false,
	inPlace: true,
	adaptive: false,
	description:
		'A comparison-based sorting algorithm that uses a Binary Heap data structure. It is an optimized version of selection sort that builds a Max-Heap to efficiently find the maximum element.',
	details: {
		summary:
			'Heap Sort utilizes a **Binary Heap** (specifically a Max-Heap) to sort elements. A Max-Heap is a complete binary tree where the value of every node is greater than or equal to its children. The algorithm first transforms the array into a Max-Heap. Then, it repeatedly swaps the root (the largest element) with the last element of the heap, reduces the heap size, and "heapifies" the root to restore the Max-Heap property. This process ensures the array is sorted from back to front.',
		steps: [
			'**1. Build Max Heap:** Treat the array as a complete binary tree. Start from the last non-leaf node (index `n/2 - 1`) and iterate backwards to the root (index 0). For each node, perform a **heapify** operation to ensure the subtree rooted at that node satisfies the Max-Heap property.',
			'**2. Extract Maximum:** The largest element is now at the root (index 0). Swap it with the last element in the current heap range (index `i`).',
			'**3. Mark Sorted:** The element moved to the end is now in its final sorted position.',
			'**4. Heapify:** Reduce the size of the heap by one. Call **heapify** on the new root (index 0) to "sift down" the element and restore the Max-Heap property.',
			'**5. Repeat:** Repeat steps 2-4 until the heap size is 1.'
		],
		advantages: [
			'**Efficient Time Complexity:** Guaranteed $O(n \\log n)$ performance in Best, Average, and Worst cases, unlike Quick Sort which can degrade to $O(n^2)$.',
			'**Memory Efficient:** It is an in-place algorithm. While the recursive implementation uses $O(\\log n)$ stack space, an iterative approach can run in $O(1)$ auxiliary space.',
			'**No Worst-Case Surprises:** Ideal for systems where consistent latency is critical (e.g., real-time computing) because it does not suffer from "killer" inputs.'
		],
		disadvantages: [
			'**Cache Inefficiency:** Heap Sort has poor locality of reference. Jumping between parent and child nodes (`index` to `2*index`) often causes cache misses, making it typically 2-3 times slower than Quick Sort in practice.',
			'**Unstable:** It does not preserve the relative order of equal elements, as the heap structure reorganizes them based on tree position rather than arrival order.',
			'**Implementation Complexity:** Managing the implicit tree structure within an array and maintaining heap invariants is more complex than simple quadratic sorts.'
		],
		javascript: `function heapify(arr, n, i) {
  let largest = i;
  let l = 2 * i + 1; // left child
  let r = 2 * i + 2; // right child

  // If left child is larger than root
  if (l < n && arr[l] > arr[largest])
    largest = l;

  // If right child is larger than largest so far
  if (r < n && arr[r] > arr[largest])
    largest = r;

  // If largest is not root
  if (largest != i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];

    // Recursively heapify the affected sub-tree
    heapify(arr, n, largest);
  }
}

function heapSort(arr) {
  let n = arr.length;

  // Build heap (rearrange array)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
    heapify(arr, n, i);

  // One by one extract an element from heap
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    [arr[0], arr[i]] = [arr[i], arr[0]];

    // Call max heapify on the reduced heap
    heapify(arr, i, 0);
  }
  return arr;
}`,
		funFacts: [
			'Heap Sort was invented by **J. W. J. Williams** in 1964. The same paper introduced the binary heap data structure itself.',
			'The **Linux Kernel** uses a version of Heap Sort as a fallback mechanism within its `sort` function to avoid the worst-case scenarios of Quick Sort.',
			'While usually slower than Quick Sort due to cache misses, Heap Sort is theoretically optimal for a comparison sort, hitting the $O(n \\log n)$ lower bound.'
		]
	}
};
