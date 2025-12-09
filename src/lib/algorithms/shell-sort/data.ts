import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'shell-sort',
	name: 'Shell Sort',
	category: 'Insertion', // Technically is a generalization of Insertion Sort (or more accurately, a gapped insertion sort)
	complexity: {
		best: 'O(n \\log n)',
		average: 'O(n^{3/2})',
		worst: 'O(n^2)',
		space: 'O(1)'
	},
	stable: false,
	inPlace: true,
	adaptive: true,
	description:
		'An optimization of Insertion Sort that allows the exchange of items that are far apart, improving efficiency by moving elements to their correct position more quickly.',
	details: {
		summary:
			'Shell Sort is an in-place comparison sort that improves upon Insertion Sort by allowing elements to be moved over larger distances. It works by sorting elements that are far apart first (using a large **gap**), then progressively reducing the gap. This initial sorting of distant elements, called **h-sorting**, significantly reduces disorder and the number of shifts required in later stages, making the final passes (with smaller gaps) extremely fast.',
		steps: [
			'**1. Choose a Gap Sequence:** Start with a large gap. A common sequence (used in this implementation) is to start with a gap of `n/2`, then `n/4`, and so on, until the gap is 1.',
			'**2. Perform Gapped Insertion Sort:** For the current gap, iterate through the array from the `gap`-th element to the end.',
			'**3. Compare and Shift:** For each element, compare it with the element `gap` positions behind it (`i-gap`). If the gapped element is larger, shift it forward to the current position. Continue this process, moving backwards by `gap` each time, until the correct spot is found.',
			'**4. Insert:** Place the current element into the newly opened position.',
			'**5. Reduce Gap:** After sorting the entire array for the current gap, reduce the gap according to the sequence and repeat the process.',
			'**6. Final Pass:** The final pass is always with a gap of 1. At this point, the array is nearly sorted, so a standard Insertion Sort pass finishes the job very efficiently.'
		],
		advantages: [
			'**Faster than Insertion Sort**: Significantly more efficient than simple $O(n^2)$ algorithms like Insertion Sort or Bubble Sort, especially for medium-to-large arrays.',
			'**In-place**: Requires only a constant $O(1)$ amount of additional memory space, making it suitable for memory-constrained systems.',
			'**Simple Implementation**: The logic is a straightforward extension of Insertion Sort.'
		],
		disadvantages: [
			'**Unstable**: Does not preserve the relative order of elements with equal values.',
			'**Complexity Dependency**: The algorithm’s efficiency is highly dependent on the gap sequence used. A poor choice can lead to worst-case $O(n^2)$ performance.',
			'**Not the Fastest**: Advanced algorithms like Quick Sort, Merge Sort, and Heap Sort outperform it for large datasets.'
		],
		javascript: `function shellSort(arr) {
  let n = arr.length;

  // Start with a large gap, then reduce the gap
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    
    // Do a gapped insertion sort for this gap size.
    // The first gap elements arr[0..gap-1] are already in gapped order
    // keep adding one more element until the entire array is gap sorted
    for (let i = gap; i < n; i++) {
      
      // Save arr[i] in temp and make a hole at position i
      let temp = arr[i];

      // Shift earlier gap-sorted elements up until the correct
      // location for arr[i] is found
      let j = i;
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      
      // Put temp (the original arr[i]) in its correct location
      arr[j] = temp;
    }
  }
  return arr;
}`,
		funFacts: [
			'Shell Sort was invented by **Donald Shell** in 1959. It has nothing to do with seashells!',
			'It was one of the first sorting algorithms to break the quadratic $O(n^2)$ time complexity barrier.',
			'The optimal gap sequence for Shell Sort remains an open and unsolved problem in computer science.'
		]
	}
};
