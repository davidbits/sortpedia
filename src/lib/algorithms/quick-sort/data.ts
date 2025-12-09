import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'quick-sort',
	name: 'Quick Sort',
	category: 'Divide and Conquer',
	complexity: {
		best: 'O(n \\log n)',
		average: 'O(n \\log n)',
		worst: 'O(n^2)',
		space: 'O(\\log n)'
	},
	stable: false,
	inPlace: true,
	adaptive: false,
	description:
		'An efficient, divide-and-conquer algorithm that works by selecting a "pivot" element and partitioning the other elements into two sub-arrays.',
	details: {
		summary:
			'Quick Sort is a highly efficient sorting algorithm based on the **Divide and Conquer** paradigm. It works by selecting an element from the array, called the **pivot**, and rearranging the other elements in a process called **partitioning**. After partitioning, the pivot is in its final sorted position. This process is then applied recursively to the sub-arrays of elements smaller and larger than the pivot.',
		steps: [
			'**1. Choose a Pivot:** An element is chosen from the array to be the pivot. Common strategies include picking the first, last, a random element, or the median of three. This implementation uses the **last element** of the current sub-array as the pivot.',
			'**2. Partition:** The array is reordered so that all elements with values less than the pivot come before it, while all elements with values greater than the pivot come after it. After this step, the pivot is in its final sorted position. This implementation uses the **Lomuto partition scheme**.',
			'**3. Recurse:** The Quick Sort algorithm is recursively called on the two sub-arrays: the one with elements smaller than the pivot, and the one with elements larger than the pivot.',
			'**4. Base Case:** The recursion stops when a sub-array has zero or one element, as it is already considered sorted.'
		],
		advantages: [
			'**Fast Average Performance:** With an average time complexity of $O(n \\log n)$, it is one of the fastest general-purpose sorting algorithms.',
			'**Space Efficiency:** It is an in-place sorting algorithm, requiring only $O(\\log n)$ auxiliary space for the recursion call stack in the average case.',
			'**Cache Friendly:** It has good locality of reference, meaning it tends to access memory locations that are close to each other, which works well with modern CPU caches.'
		],
		disadvantages: [
			'**Worst-Case Performance:** It has a worst-case time complexity of $O(n^2)$, which occurs with poor pivot choices, such as on an already sorted array when the pivot is the first or last element.',
			'**Unstable:** It does not preserve the relative order of equal elements, making it unsuitable for certain applications where stability is required.',
			'**Complex Implementation:** A naive implementation can easily fall into the worst-case scenario. Optimizations like random pivots or median-of-three are often needed for robust performance.'
		],
		javascript: `// Main Quick Sort function
function quickSort(arr, low, high) {
  if (low < high) {
    // pi is the partitioning index, arr[pi] is now at its final place
    let pi = partition(arr, low, high);

    // Recursively sort elements before and after partition
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

// Lomuto partition scheme with the last element as pivot
function partition(arr, low, high) {
  let pivot = arr[high];
  
  // i is the index of the smaller element
  let i = low - 1; 

  for (let j = low; j < high; j++) {
    // If current element is smaller than the pivot
    if (arr[j] < pivot) {
      i++;
      // Swap arr[i] and arr[j]
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  // Place the pivot in its correct position by swapping
  // it with the element at i + 1
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  
  return i + 1; // Return the partition index
}`,
		funFacts: [
			'Quick Sort was developed by British computer scientist **Tony Hoare** in 1959 while working on a machine translation project.',
			'The standard C library includes a function called `qsort`, which is often implemented using Quick Sort.',
			'The worst-case $O(n^2)$ performance can be made extremely unlikely by choosing a random pivot, a common practice in production-grade implementations.'
		]
	}
};
