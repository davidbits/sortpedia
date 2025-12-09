import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'merge-sort',
	name: 'Merge Sort',
	category: 'Merge',
	complexity: {
		best: 'O(n \\log n)',
		average: 'O(n \\log n)',
		worst: 'O(n \\log n)',
		space: 'O(n)'
	},
	stable: true,
	description:
		'A highly reliable, stable sorting algorithm that works by recursively dividing the array into halves, sorting them, and merging them back together.',
	details: {
		summary:
			'Merge Sort is a classic **Divide and Conquer** algorithm. Its strategy is to break down a complex problem into smaller, more manageable sub-problems, solve them, and then combine the solutions. For sorting, this means recursively splitting the array into halves until each sub-array contains only one element (which is inherently sorted), and then **merging** these sorted sub-arrays back together to produce a fully sorted list.',
		steps: [
			'**1. Divide:** The algorithm first divides the array into two equal halves. If the array has an odd number of elements, one half will have one more element than the other.',
			'**2. Conquer (Recurse):** It continues to divide each of these halves recursively until it has a collection of sub-arrays, each containing a single element. A single-element array is considered sorted by definition.',
			'**3. Merge:** Starting with the single-element arrays, the algorithm repeatedly merges adjacent pairs of sub-arrays. In each merge operation, it creates a new, sorted array by comparing elements from the two input arrays one by one and picking the smaller one. This step continues until all the sub-arrays have been merged back into a single, fully sorted array.'
		],
		advantages: [
			'**Guaranteed Performance:** The time complexity is consistently $O(n \\log n)$ in all cases (best, average, and worst). This makes it highly predictable and reliable.',
			'**Stability:** Merge Sort is a **stable** sorting algorithm, meaning it preserves the original order of equal elements.',
			'**Parallelizable:** The task of sorting the two halves is independent, making it easy to parallelize for significant performance gains on multi-core systems.'
		],
		disadvantages: [
			'**Space Complexity:** Its primary drawback is the need for auxiliary space. It requires an auxiliary array of size $O(n)$, which can be an issue for very large datasets in memory-constrained environments.',
			'**Slower for Small Lists:** The overhead of recursion and copying to an auxiliary array makes it less efficient than simpler algorithms like Insertion Sort for very small arrays.'
		],
		javascript: `// Initial call requires a copy of the original array.
function mergeSort(arr) {
  let aux = [...arr]; // Create auxiliary array once.
  mergeSortRecursive(arr, 0, arr.length - 1, aux);
}

// Recursive helper that swaps the roles of arr and aux.
function mergeSortRecursive(arr, low, high, aux) {
  if (low >= high) return;

  const mid = floor(low + (high - low) / 2);

  // Sort from arr into aux.
  // Note the swap of arr and aux in recursive calls
  mergeSortRecursive(aux, low, mid, arr);
  mergeSortRecursive(aux, mid + 1, high, arr);
  
  // Merge from aux back into arr
  merge(arr, aux, low, mid, high);
}

// Merges two sorted sub-arrays from aux into arr
function merge(arr, aux, low, mid, high) {
  let i = low;      // Pointer for left half in aux
  let j = mid + 1;  // Pointer for right half in aux
  let k = low;      // Pointer for main array arr

  // Compare elements from both halves and copy the smaller one
  while (i <= mid && j <= high) {
    if (aux[i] <= aux[j]) {
      arr[k] = aux[i];
      i++;
    } else {
      arr[k] = aux[j];
      j++;
    }
    k++;
  }

  // Copy any remaining elements from the left half
  while (i <= mid) {
    arr[k] = aux[i];
    i++;
    k++;
  }

  // Copy any remaining elements from the right half
  while (j <= high) {
    arr[k] = aux[j];
    j++;
    k++;
  }
}`,
		funFacts: [
			'Merge Sort was invented by the brilliant mathematician **John von Neumann** in 1945.',
			'It is the algorithm of choice for sorting linked lists because it does not rely on random access to elements, unlike Quick Sort.',
			'Merge Sort is the foundation for **external sorting**, where the data to be sorted is too large to fit into RAM and must be read from a disk.'
		]
	}
};
