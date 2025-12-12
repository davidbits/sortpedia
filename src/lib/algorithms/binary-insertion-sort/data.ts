import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'binary-insertion-sort',
	name: 'Binary Insertion Sort',
	group: 'Comparison-Based',
	category: ['Insertion'],
	complexity: {
		best: 'O(n \\log n)', // Comparisons are log-linear, though shifts remain linear
		average: 'O(n^2)',
		worst: 'O(n^2)',
		space: 'O(1)'
	},
	stable: true,
	inPlace: true,
	adaptive: false, // Unlike standard insertion sort, the binary search is performed regardless of order
	description:
		'A variant of Insertion Sort that uses binary search to find the correct position for the next element, significantly reducing the number of comparisons.',
	details: {
		summary:
			'Binary Insertion Sort improves upon standard Insertion Sort by minimizing the number of comparisons. Instead of linearly scanning backwards to find the insertion point, it uses **Binary Search** on the already-sorted portion of the array. While this reduces the comparison complexity to $O(n \\log n)$, the algorithm still requires $O(n^2)$ write operations to shift elements to make room for the insertion.',
		steps: [
			'Assume the first element is a sorted sub-array.',
			'Select the next element as the **key**.',
			'Perform a **Binary Search** on the sorted sub-array to find the index of the first element greater than the key.',
			'**Shift** all elements from that index onwards one position to the right to create a gap.',
			'**Insert** the key into the gap.',
			'Repeat until the entire array is sorted.'
		],
		advantages: [
			'**Reduced Comparisons**: Uses $O(n \\log n)$ comparisons compared to $O(n^2)$ in standard insertion sort. This is highly beneficial if the comparison function is computationally expensive (e.g., comparing long strings or complex objects).',
			'**Stable**: Carefully implemented binary search (upper bound) preserves the relative order of equal elements.',
			'**In-Place**: Requires constant $O(1)$ auxiliary memory.'
		],
		disadvantages: [
			'**Write Heavy**: The overall time complexity remains $O(n^2)$ because shifting elements in an array takes linear time per insertion.',
			'**Not Adaptive**: Unlike standard Insertion Sort, which can run in $O(n)$ on already sorted data, Binary Insertion Sort always performs the full binary search to find the insertion point. While this reduces comparisons, element shifting still dominates, so it does not achieve full $O(n)$ best-case performance.'
		],
		javascript: `function binaryInsertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let left = 0;
    let right = i - 1;

    // Binary search for the insertion point (upper bound)
    while (left <= right) {
      let mid = Math.floor((left + right) / 2);
      if (arr[mid] <= key) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    // 'left' is now the correct insertion index.
    // Shift elements to the right to make room.
    for (let j = i - 1; j >= left; j--) {
      arr[j + 1] = arr[j];
    }

    // Insert key
    arr[left] = key;
  }
  return arr;
}`,
		funFacts: [
			'While asymptotically equivalent to Insertion Sort in the worst case ($O(n^2)$), it performs significantly better in environments where **reading memory is cheap but comparing values is expensive**.',
			"The number of comparisons performed is approximately $\\log_2(n!)$, which simplifies to $O(n \\log n)$ by Stirling's approximation.",
			'This algorithm illustrates a classic computer science trade-off: using a more complex algorithm (Binary Search) to optimize one specific resource (comparisons), even if the bottleneck (memory writes) remains unchanged.'
		]
	}
};
