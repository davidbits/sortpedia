import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'stooge-sort',
	name: 'Stooge Sort',
	group: 'Comparison-Based',
	category: ['Divide and Conquer', 'Esoteric'],
	complexity: {
		best: 'O(n^{2.709})',
		average: 'O(n^{2.709})',
		worst: 'O(n^{2.709})',
		space: 'O(log n)'
	},
	stable: false,
	inPlace: false,
	adaptive: false,
	warningThreshold: 40,
	description:
		'A highly inefficient recursive sorting algorithm that works by recursively sorting overlapping two-thirds sections of the array.',
	details: {
		summary:
			"Stooge Sort is a recursive algorithm notable for its exceptionally poor performance. Its name is a reference to The Three Stooges. The algorithm divides the array into two overlapping sub-arrays of size 2/3, sorts them recursively, and then re-sorts the first 2/3 to ensure the elements are in their correct final positions. It serves as an excellent academic example of how a seemingly plausible 'divide and conquer' strategy can lead to a very inefficient solution.",
		steps: [
			'If the value at the start of the sub-array is larger than the value at the end, **swap** them.',
			'If the current sub-array has three or more elements, proceed. Otherwise, the sub-array is sorted.',
			'**Recursively call** Stooge Sort on the **initial two-thirds** of the sub-array.',
			'**Recursively call** Stooge Sort on the **final two-thirds** of the sub-array.',
			'**Recursively call** Stooge Sort on the **initial two-thirds** of the sub-array **again** to fix the placement of elements that may have moved from the final third into the initial third.'
		],
		advantages: [
			'**Simplicity of concept**: The core idea is relatively simple to describe.',
			'**Educational Value**: It is an excellent example for demonstrating recurrence relations and analyzing algorithmic inefficiency. It provides a stark contrast to efficient algorithms like Merge Sort.'
		],
		disadvantages: [
			'**Extremely Inefficient**: With a time complexity of approximately $O(n^{2.709})$, it is one of the least efficient sorting algorithms, performing worse than even Bubble Sort.',
			'**High Overhead**: The deep recursion and massive number of redundant operations make it completely impractical for any real-world use.',
			'**Not In-Place**: The recursive calls consume stack space, leading to an $O(\\log n)$ space complexity, which can cause a stack overflow for large arrays.'
		],
		javascript: `function stoogeSort(arr, l = 0, h = arr.length - 1) {
  if (l >= h) {
    return;
  }

  // If the first element is greater than the last, swap them
  if (arr[l] > arr[h]) {
    [arr[l], arr[h]] = [arr[h], arr[l]];
  }

  // If there are more than 2 elements in the array
  const size = h - l + 1;
  if (size > 2) {
    const t = Math.floor(size / 3);
    
    // Recursively sort the first 2/3
    stoogeSort(arr, l, h - t);
    
    // Recursively sort the last 2/3
    stoogeSort(arr, l + t, h);
    
    // Recursively sort the first 2/3 again
    stoogeSort(arr, l, h - t);
  }
  return arr;
}`,
		funFacts: [
			'The name is a reference to the comedic trio The Three Stooges, whose chaotic and inefficient approach to tasks is mirrored by the algorithm.',
			'Stooge Sort is often discussed alongside other "perversely bad" algorithms like Bogo Sort and Slowsort, which are used to illustrate worst-case algorithmic design.',
			"Despite its inefficiency, it's still considered more efficient than Slowsort."
		]
	}
};
