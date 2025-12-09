import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'cocktail-sort',
	name: 'Cocktail Sort',
	category: 'Exchange',
	complexity: {
		best: 'O(n)',
		average: 'O(n^2)',
		worst: 'O(n^2)',
		space: 'O(1)'
	},
	stable: true,
	description:
		'A bidirectional variation of Bubble Sort that sorts in both directions on each pass to improve performance by moving elements to their correct position more quickly.',
	details: {
		summary:
			'Cocktail Sort, also known as Cocktail Shaker Sort or Bidirectional Bubble Sort, is an enhancement of Bubble Sort. Instead of repeatedly passing through the list in one direction, it sorts by passing through the array in alternating directions: first from left to right, then from right to left. This approach helps move items to their correct positions faster, particularly by addressing the problem of "turtles" in Bubble Sort—small elements near the end of the list that are slow to move to the beginning.',
		steps: [
			'**1. Forward Pass:** Starting from a boundary `start`, iterate from left to right. Compare adjacent elements and swap them if they are in the wrong order. This moves the largest unsorted element to the end of the unsorted section.',
			'After the pass, the last element is sorted. Decrement the `end` boundary.',
			'**2. Check for Completion:** If no swaps were made during the forward pass, the array is sorted, and the algorithm can terminate.',
			'**3. Backward Pass:** Starting from the new `end` boundary, iterate from right to left. Compare adjacent elements and swap them if they are in the wrong order. This moves the smallest unsorted element to the beginning of the unsorted section.',
			'After the pass, the first element is sorted. Increment the `start` boundary.',
			'**4. Repeat:** Continue these alternating passes, shrinking the `start` and `end` boundaries, until the boundaries meet or a pass completes with no swaps.'
		],
		advantages: [
			'**Simplicity**: Easy to understand and implement, as it is a direct extension of Bubble Sort.',
			'**More Efficient than Bubble Sort**: By sorting bidirectionally, it can be up to twice as fast as Bubble Sort and effectively resolves the "turtles" problem.',
			'**Adaptive**: Has a best-case time complexity of $O(n)$ if the list is already or nearly sorted, thanks to the early exit mechanism.',
			'**In-place**: Requires only a constant $O(1)$ amount of additional memory space.'
		],
		disadvantages: [
			'**Inefficient for Large Datasets**: Its $O(n^2)$ average and worst-case time complexity makes it very slow for large, randomly ordered lists.',
			'**Outperformed by Advanced Algorithms**: Significantly slower than more advanced algorithms like Quick Sort, Merge Sort, or Shell Sort.'
		],
		javascript: `function cocktailSort(arr) {
  let swapped = true;
  let start = 0;
  let end = arr.length;

  while (swapped) {
    // Reset swapped flag for the new pass
    swapped = false;

    // Forward pass (like Bubble Sort)
    for (let i = start; i < end - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }

    // If no swaps occurred, the array is sorted
    if (!swapped) break;

    // Array is not sorted, so reset flag for backward pass
    swapped = false;
    
    // The last element is now in its correct place
    end--;

    // Backward pass
    for (let i = end - 1; i >= start; i--) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
    
    // The first element is now in its correct place
    start++;
  }
  return arr;
}`,
		funFacts: [
			'The issue of "turtles" (small values near the end of the list) in Bubble Sort led directly to the invention of Cocktail Sort.',
			'It has many alternative names, including **Shaker Sort**, **Bidirectional Bubble Sort**, **Shuttle Sort**, **Ripple Sort**, and even **Happy Hour Sort**.',
			'While an improvement over Bubble Sort, computer scientist Donald Knuth concluded that neither algorithm is practical for large datasets compared to alternatives like Insertion Sort.'
		]
	}
};
