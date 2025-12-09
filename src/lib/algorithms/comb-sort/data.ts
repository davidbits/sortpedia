import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'comb-sort',
	name: 'Comb Sort',
	category: 'Exchange',
	complexity: {
		best: 'O(n \\log n)',
		average: 'O(n^2 / 2^p)',
		worst: 'O(n^2)',
		space: 'O(1)'
	},
	stable: false,
	inPlace: true,
	adaptive: false,
	description:
		'An improvement on Bubble Sort that eliminates "turtles" (small values near the end) by comparing and swapping elements that are far apart.',
	details: {
		summary:
			'Comb Sort is a significant improvement over Bubble Sort. It works by using a **gap** between compared elements that shrinks each pass by a **shrink factor** (typically 1.3). This allows it to move small values from the end of the list ("turtles") towards the beginning very quickly. Its average time complexity is often cited as $O(n^2 / 2^p)$, where `p` is the number of passes, showing a dramatic improvement over Bubble Sort\'s standard $O(n^2)$ average case. When the gap eventually reaches 1, it finishes with a final pass that is equivalent to a regular Bubble Sort on a nearly-sorted list.',
		steps: [
			'**1. Initialize Gap:** Start with a `gap` equal to the length of the array (`n`).',
			'**2. Choose Shrink Factor:** A shrink factor of `1.3` is used to reduce the gap in each pass.',
			'**3. Loop Until Sorted:** Continue the process as long as the `gap` is greater than 1, or if the last pass with a gap of 1 resulted in any swaps.',
			'**4. Shrink Gap:** In each iteration, calculate the new gap by dividing the current gap by the shrink factor and taking the floor. If the calculated gap is less than 1, set it to 1.',
			'**5. Compare and Swap:** Iterate through the array from the beginning, comparing elements at index `i` and `i + gap`. If the element at `i` is greater, swap them.',
			'**6. Final Pass:** When the gap becomes 1, the algorithm behaves like Bubble Sort. It makes passes until one full pass completes with no swaps, at which point the array is sorted.'
		],
		advantages: [
			'**Significant Improvement over Bubble Sort**: By eliminating turtles, it dramatically improves performance on most arrays.',
			'**Simple Concept**: The logic is a relatively simple extension of Bubble Sort, making it easy to understand.',
			'**In-place**: Requires only a constant $O(1)$ amount of additional memory space.'
		],
		disadvantages: [
			'**Unstable**: Does not preserve the relative order of elements with equal values because of the long-distance swaps.',
			'**Worst-Case Performance**: Still has a worst-case time complexity of $O(n^2)$.',
			'**Outperformed by Advanced Sorts**: Algorithms like Quick Sort and Merge Sort are generally faster for large datasets.'
		],
		javascript: `function combSort(arr) {
  let n = arr.length;
  let gap = n;
  const shrink = 1.3;
  let swapped = true;

  while (gap > 1 || swapped) {
    // Calculate the new gap
    gap = Math.floor(gap / shrink);
    if (gap < 1) {
      gap = 1;
    }

    swapped = false;
    // Perform a gapped comparison pass
    for (let i = 0; i < n - gap; i++) {
      if (arr[i] > arr[i + gap]) {
        // Swap elements
        [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
        swapped = true;
      }
    }
  }
  return arr;
}`,
		funFacts: [
			'The ideal shrink factor was found to be approximately **1.3** after empirical testing on hundreds of thousands of random lists.',
			'The name "Comb Sort" was chosen because the passes through the data were visualized as the teeth of a comb running through hair.',
			'It improves upon Bubble Sort in the same way that **Shell Sort** improves upon Insertion Sort—by introducing a gap to handle distant inversions quickly.'
		]
	}
};
