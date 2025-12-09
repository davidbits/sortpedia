import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'insertion-sort',
	name: 'Insertion Sort',
	category: 'Insertion',
	complexity: {
		best: 'O(n)',
		average: 'O(n^2)',
		worst: 'O(n^2)',
		space: 'O(1)'
	},
	stable: true,
	inPlace: true,
	adaptive: true,
	description:
		'Builds the final sorted array one item at a time by repeatedly taking the next element and inserting it into its correct position among the already-sorted elements.',
	details: {
		summary:
			'Insertion Sort is an intuitive, comparison-based algorithm that builds a final sorted array one element at a time. It works much like sorting a hand of playing cards: you iterate through the elements, picking up one at a time and **inserting** it into its correct position within the already-sorted part of the list.',
		steps: [
			'Assume the first element is a sorted sub-array of size one.',
			'Pick the next unsorted element. This is your **key**.',
			'Compare the key with the elements in the sorted sub-array, moving from right to left.',
			'**Shift** all elements in the sorted sub-array that are greater than the key one position to the right. This opens up a gap.',
			'**Insert** the key into this gap. The sorted sub-array is now one element larger.',
			'Repeat this process until all elements have been inserted into the sorted sub-array.'
		],
		advantages: [
			'**Simplicity**: Very easy to understand and implement, making it great for educational purposes.',
			'**Efficient on Small Data**: Outperforms more complex algorithms for small or nearly-sorted arrays.',
			'**Adaptive**: Has a linear time complexity of $O(n)$ if the input array is already sorted.',
			'**Stable**: Preserves the relative order of elements that have equal values.',
			'**In-place**: Requires only a constant $O(1)$ amount of additional memory space.'
		],
		disadvantages: [
			'**Inefficient for Large Datasets**: Its $O(n^2)$ average and worst-case time complexity makes it very slow for large, randomly ordered lists.',
			'**Quadratic Worst-Case**: Performance degrades significantly on reverse-sorted data, which represents its worst-case scenario.'
		],
		javascript: `function insertionSort(arr) {
  // Start from the second element (arr[0] is trivially sorted)
  for (let i = 1; i < arr.length; i++) {
    // The element to be inserted into the sorted portion
    let key = arr[i];
    
    // Index of the last element in the sorted portion
    let j = i - 1;

    // Move elements of arr[0..i-1] that are greater than key
    // one position ahead of their current position.
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    
    // Insert the key into its correct position
    arr[j + 1] = key;
  }
  return arr;
}`,
		funFacts: [
			"The algorithm's mechanism is very similar to how many people manually sort a hand of playing cards.",
			'Due to its high efficiency on small lists, Insertion Sort is often used as a subroutine in more advanced hybrid algorithms like **Timsort** (used in Python and Java) and **Introsort**.',
			'The number of swaps the algorithm performs is equal to the number of **inversions** in the array (pairs of elements that are out of order).'
		]
	}
};
