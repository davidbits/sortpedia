import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'pancake-sort',
	name: 'Pancake Sort',
	group: 'Comparison-Based',
	category: ['Selection'], // It selects the max and moves it, similar to Selection Sort
	complexity: {
		best: 'O(n^2)', // Comparisons are always needed to find the max
		average: 'O(n^2)',
		worst: 'O(n^2)',
		space: 'O(1)'
	},
	stable: false, // Reversing subarrays destroys relative order of duplicates
	inPlace: true,
	adaptive: false,
	description:
		'Sorts a stack of elements (pancakes) by repeatedly flipping the spatula under the largest unsorted element to move it to the top, then flipping the whole stack to move it to the bottom.',
	details: {
		summary:
			'Pancake sorting is a mathematical problem and sorting algorithm where the only allowed operation is to reverse the elements of some **prefix** of the sequence. Imagine a stack of pancakes of different sizes; your goal is to organize them from smallest (top) to largest (bottom) using a spatula. You can insert the spatula at any point and "flip" all pancakes above it. Unlike traditional algorithms that minimize comparisons, the goal here is often to minimize the number of flips.',
		steps: [
			'Start with the current size of the unsorted array equal to $n$.',
			'Find the index of the **maximum element** (`mi`) within the current unsorted portion `arr[0...curr_size-1]`.',
			'If the maximum element is not already at the end of the unsorted portion:',
			'1. **Flip to Top**: Perform a flip at index `mi`. This reverses the sub-array from `0` to `mi`, moving the maximum element to index `0`.',
			'2. **Flip to Position**: Perform a flip at index `curr_size - 1`. This reverses the sub-array from `0` to `curr_size - 1`, moving the maximum element from index `0` to its correct sorted position at the end.',
			'Reduce the current size by one and repeat the process until the array is sorted.'
		],
		advantages: [
			'**In-Place**: Requires only a constant $O(1)$ amount of additional memory space.',
			'**Conceptual Simplicity**: The "spatula" metaphor makes it an excellent algorithmic puzzle for educational purposes.',
			'**Theoretical Interest**: The problem of bounding the minimum number of flips (the "Pancake number") has attracted significant mathematical research.'
		],
		disadvantages: [
			'**Slow Execution**: With a time complexity of $O(n^2)$ due to repeated scanning for the maximum, it is inefficient for large datasets compared to Quick Sort or Merge Sort.',
			'**Expensive Operations**: In practice, reversing a sub-array (flipping) requires many memory writes compared to the single swap used in standard Selection Sort.',
			'**Unstable**: The flipping operation completely disrupts the relative order of elements, making it unstable.'
		],
		javascript: `function pancakeSort(arr) {
  let n = arr.length;

  // Start from the complete array and reduce current size by one
  for (let curr_size = n; curr_size > 1; --curr_size) {
    
    // Find index of the maximum element in arr[0..curr_size-1]
    let mi = 0;
    for (let i = 0; i < curr_size; ++i) {
      if (arr[i] > arr[mi]) {
        mi = i;
      }
    }

    // Move the maximum element to end of current array
    if (mi != curr_size - 1) {
      // 1. Move maximum number to beginning
      flip(arr, mi);

      // 2. Move maximum number to end by reversing current array
      flip(arr, curr_size - 1);
    }
  }
  return arr;
}

// Reverses arr[0..i]
function flip(arr, i) {
  let start = 0;
  while (start < i) {
    let temp = arr[start];
    arr[start] = arr[i];
    arr[i] = temp;
    start++;
    i--;
  }
}`,
		funFacts: [
			'The algorithm was the subject of the only well-known mathematics paper by **Bill Gates** (founder of Microsoft). In 1979, he co-authored a paper with Christos Papadimitriou providing an upper bound for the number of flips required.',
			'The problem was originally posed in 1975 by Jacob E. Goodman, writing under the pseudonym **"Harry Dweighter"** ("Harried Waiter").',
			'A variation called the **Burnt Pancake Problem** requires sorting pancakes that have a burnt side, ensuring all pancakes end up burnt-side down. This has applications in biology for studying DNA orientation.'
		]
	}
};
