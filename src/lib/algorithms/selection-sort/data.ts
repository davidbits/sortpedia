import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'selection-sort',
	name: 'Selection Sort',
	group: 'Comparison-Based',
	category: ['Selection'],
	complexity: {
		best: 'O(n^2)',
		average: 'O(n^2)',
		worst: 'O(n^2)',
		space: 'O(1)'
	},
	stable: false,
	inPlace: true,
	adaptive: false,
	description:
		'A simple sorting algorithm that repeatedly finds the minimum element from the unsorted part and puts it at the beginning.',
	details: {
		summary:
			'Selection Sort is an in-place comparison-based algorithm that divides the input list into two parts: a sorted sublist that is built up from left to right, and a sublist of the remaining unsorted items. The algorithm proceeds by finding the smallest element in the unsorted sublist, **swapping** it with the leftmost unsorted element, and moving the sublist boundary one element to the right.',
		steps: [
			'Start with the first element (index `i = 0`). This marks the beginning of the unsorted portion.',
			'Assume the first element of the unsorted portion (`arr[i]`) is the minimum.',
			'Iterate through the rest of the unsorted portion (from `i+1` to the end) to find the true minimum element.',
			'In each comparison, if a smaller element is found, update the index of the minimum.',
			'After scanning the entire unsorted portion, if the true minimum is not at index `i`, **swap** it with the element at `arr[i]`.',
			'The element at index `i` is now sorted. Increment `i` to move the sorted sublist boundary to the right.',
			'Repeat this process until the entire array is sorted.'
		],
		advantages: [
			'**Simplicity**: Very easy to understand and implement, making it ideal for teaching basic sorting concepts.',
			'**Space Efficiency**: It is an in-place algorithm, requiring only a constant $O(1)$ amount of additional memory space.',
			'**Minimal Swaps**: It performs a maximum of $n-1$ swaps, making it a good choice when memory writes are expensive operations (e.g., on flash memory).'
		],
		disadvantages: [
			'**Inefficient for Large Datasets**: Its $O(n^2)$ time complexity in all cases (best, average, worst) makes it very slow for large lists.',
			"**Not Adaptive**: The algorithm's runtime is not affected by the initial order of the elements. It will perform the same number of comparisons even if the list is already sorted.",
			'**Unstable**: It does not preserve the relative order of equal-valued elements.'
		],
		javascript: `function selectionSort(arr) {
  let n = arr.length;
  
  // One by one move boundary of unsorted subarray
  for (let i = 0; i < n - 1; i++) {
    
    // Find the minimum element in the unsorted array
    let min_idx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[min_idx]) {
        min_idx = j;
      }
    }

    // Swap the found minimum element with the first element
    // of the unsorted portion.
    if (min_idx != i) {
      let temp = arr[min_idx];
      arr[min_idx] = arr[i];
      arr[i] = temp;
    }
  }
  return arr;
}`,
		funFacts: [
			'The name comes from the fact that it repeatedly **selects** the next-smallest element and moves it into place.',
			'**Heapsort** is considered a highly optimized version of Selection Sort, using a heap data structure to find the minimum element in $O(\\log n)$ time instead of $O(n)$.',
			"Unlike Insertion Sort, its performance is not affected by the input data's initial state. It always performs the same number of comparisons."
		]
	}
};
