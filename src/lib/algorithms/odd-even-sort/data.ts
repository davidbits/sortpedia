import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'odd-even-sort',
	name: 'Odd-Even Sort',
	category: 'Exchange',
	complexity: {
		best: 'O(n)',
		average: 'O(n^2)',
		worst: 'O(n^2)',
		space: 'O(1)'
	},
	stable: true,
	description:
		'A variation of Bubble Sort that sorts by repeatedly applying comparison and swap operations to elements in separate "odd" and "even" phases.',
	details: {
		summary:
			'Odd-Even Sort, also known as **Brick Sort** or **Parity Sort**, is a relatively simple comparison sort based on the same principles as Bubble Sort. Its defining feature is that it operates in passes, where each pass consists of two distinct phases. In the first phase, it compares and swaps all adjacent pairs at **odd** indices. In the second phase, it does the same for all pairs at **even** indices. This process repeats until the entire array is sorted. While its performance on a single-processor machine is similar to Bubble Sort, its structure makes it highly suitable for parallel processing.',
		steps: [
			'**1. Start Loop:** The algorithm runs in a loop that continues until a full pass over the array is completed with no swaps.',
			'**2. Odd Phase:** In the first phase of a pass, iterate through the array, comparing all adjacent elements at odd starting indices (`arr[1]` with `arr[2]`, `arr[3]` with `arr[4]`, etc.). If a pair is in the wrong order, **swap** them.',
			'**3. Even Phase:** In the second phase, iterate through the array again, this time comparing all adjacent elements at even starting indices (`arr[0]` with `arr[1]`, `arr[2]` with `arr[3]`, etc.). If a pair is in the wrong order, **swap** them.',
			'**4. Repeat:** Repeat the odd and even phases. If a complete pass (both phases) occurs with zero swaps, the array is sorted, and the algorithm terminates.'
		],
		advantages: [
			'**Simple Implementation**: The logic is straightforward and easy to understand, similar to Bubble Sort.',
			'**Parallelizable**: This is its key advantage. Within each phase (odd or even), all comparisons are independent of each other and can be performed simultaneously on parallel hardware, making it much more efficient in that context.',
			'**Space Efficiency**: It is an in-place algorithm requiring only $O(1)$ auxiliary memory space.'
		],
		disadvantages: [
			'**Inefficient on Serial Machines**: With a time complexity of $O(n^2)$, it is as inefficient as Bubble Sort for large datasets on a single-processor system.',
			'**Many Comparisons**: Like Bubble Sort, it performs a large number of comparisons, regardless of the initial order of the array (though the swap optimization helps).',
			'**Not Adaptive (by default)**: While it can detect a sorted array in $O(n)$, its overall performance doesn\'t improve significantly for "almost sorted" lists compared to algorithms like Insertion Sort.'
		],
		javascript: `function oddEvenSort(arr) {
  let n = arr.length;
  let isSorted = false;

  while (!isSorted) {
    isSorted = true;

    // Perform Bubble Sort on odd indexed elements
    for (let i = 1; i <= n - 2; i = i + 2) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        isSorted = false;
      }
    }

    // Perform Bubble Sort on even indexed elements
    for (let i = 0; i <= n - 2; i = i + 2) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        isSorted = false;
      }
    }
  }
  return arr;
}`,
		funFacts: [
			'Odd-Even Sort was originally developed by **Nico Habermann** in 1972 for use on parallel processors, where it can be very efficient.',
			'It gets the name "Brick Sort" from a visualization where elements move like bricks being laid in staggered rows.',
			'On a standard computer, there is no performance benefit to using Odd-Even Sort over an optimized Bubble Sort. Its design is purely for architectures that can handle many tasks at once.'
		]
	}
};
