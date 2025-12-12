import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'gnome-sort',
	name: 'Gnome Sort',
	group: 'Comparison-Based',
	category: ['Insertion'],
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
		'A simple sorting algorithm that moves an element to its correct place through a series of adjacent swaps, resembling a garden gnome sorting flower pots.',
	details: {
		summary:
			"Gnome Sort is an interesting variation of Insertion Sort that achieves its goal without any nested loops. The algorithm is named after a story of a garden gnome sorting a line of flower pots. The gnome's position in the array moves forward when elements are in order, but when it finds an out-of-place element, it swaps it with the previous one and moves backward, carrying the element to its correct sorted position. This back-and-forth movement continues until the gnome reaches the end of the array.",
		steps: [
			'Start with the "gnome" at the beginning of the array (position `pos = 0`).',
			'The gnome compares the element at its current position with the element to its left (`pos` and `pos-1`).',
			'**If** the gnome is at the very beginning, or if the current element is greater than or equal to the previous one, they are in the correct order. The gnome steps **one position forward**.',
			'**Else**, the elements are out of order. The gnome **swaps** them and steps **one position backward**.',
			'Repeat this process until the gnome has moved past the end of the array. At this point, the array is fully sorted.'
		],
		advantages: [
			'**Extreme Simplicity**: The logic is implemented in a single `while` loop without nesting, making it one of the easiest sorting algorithms to code.',
			'**Space Efficiency**: It is an in-place algorithm, requiring only a constant $O(1)$ amount of additional memory space.',
			'**Adaptive**: Like Insertion Sort, it is adaptive. Its performance is $O(n)$ if the input array is already or nearly sorted.',
			'**Stable**: Preserves the relative order of elements that have equal values.'
		],
		disadvantages: [
			'**Inefficient for Large Datasets**: Its $O(n^2)$ average and worst-case time complexity makes it very slow for large, randomly ordered lists.',
			'**Obscure**: Less known and less frequently used in practice compared to its conceptual cousin, Insertion Sort.'
		],
		javascript: `function gnomeSort(arr) {
  let n = arr.length;
  let pos = 0;

  while (pos < n) {
    // If at start or in correct order, move forward
    if (pos === 0 || arr[pos] >= arr[pos - 1]) {
      pos++;
    } else {
      // If out of order, swap and move back
      [arr[pos], arr[pos - 1]] = [arr[pos - 1], arr[pos]];
      pos--;
    }
  }
  return arr;
}`,
		funFacts: [
			'The algorithm gets its name from a story by Dick Grune, where a Dutch garden gnome sorts a line of flower pots using this back-and-forth method.',
			'It was originally called **Stupid Sort** by Hamid Sarbazi-Azad, not to be confused with the even more inefficient **Bogo Sort**.',
			'Gnome Sort can be viewed as Insertion Sort, but with the element being moved to its correct place through a series of swaps rather than by shifting a block of elements.'
		]
	}
};
