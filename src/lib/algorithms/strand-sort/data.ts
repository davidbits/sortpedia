import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'strand-sort',
	name: 'Strand Sort',
	group: 'Comparison-Based',
	category: ['Selection'],
	complexity: {
		best: 'O(n)',
		average: 'O(n^2)',
		worst: 'O(n^2)',
		space: 'O(n)'
	},
	stable: true,
	inPlace: false,
	adaptive: true,
	description:
		'A recursive sorting algorithm that repeatedly pulls the longest increasing subsequence (strand) from the list and merges it into a sorted output.',
	details: {
		summary:
			'Strand Sort works by repeatedly extracting sorted sub-lists (strands) from the unsorted input and merging them into a final sorted result. It is most efficient when the data is already partially sorted, as it can identify long existing runs of order.',
		steps: [
			'Create an empty `output` list.',
			'While the input list is not empty, create a temporary `strand` list.',
			'Move the first item of the input to the `strand`.',
			'Traverse the remaining input list. If an item is greater than the last item of the `strand`, move it from input to `strand`.',
			'Merge the now sorted `strand` into the `output` list.',
			'Repeat until the input list is empty.'
		],
		advantages: [
			'**Efficient for Sorted Data**: Has a best-case time complexity of $O(n)$ if the input is already sorted.',
			'**Stable**: Preserves the relative order of equal elements.',
			'**Adaptive**: Performs well on data that contains long ordered subsequences.'
		],
		disadvantages: [
			'**High Space Complexity**: Requires $O(n)$ auxiliary space to store the sub-lists and output.',
			'**Slow on Random Data**: Has an average and worst-case time complexity of $O(n^2)$, making it inefficient for large, random datasets.',
			'**Complex List Manipulation**: Requires frequent insertion and deletion of elements, which can be costly on array-based data structures.'
		],
		javascript: `function strandSort(ip) {
  // To store sorted output list
  var op = [];

  // Recursive function to implement Strand sort
  function sort(ip) {
    if (ip.length === 0) return;

    // Create a sorted sublist with first item of input
    var sublist = [];
    sublist.push(ip.shift());

    // Traverse remaining items of ip list
    var i = 0;
    while (i < ip.length) {
      // If current item is greater than last added item to sublist
      if (ip[i] > sublist[sublist.length - 1]) {
        sublist.push(ip[i]);
        // Remove from input
        ip.splice(i, 1);
      } else {
        i++;
      }
    }

    // Merge current sublist into output
    merge(op, sublist);
    
    // Recur for remaining items
    sort(ip);
  }

  // Standard merge of two sorted lists
  function merge(target, source) {
    // Note: This is a simplified merge for illustration.
    // In practice, we splice items from 'source' into 'target'.
    let t = 0;
    while (source.length > 0) {
      if (t < target.length && target[t] <= source[0]) {
        t++;
      } else {
        target.splice(t, 0, source.shift());
        t++;
      }
    }
  }

  sort(ip);
  return op;
}`,
		funFacts: [
			'The name comes from the way the algorithm "pulls strands" of sorted data out of the tangled mess of the unsorted list.',
			'It is particularly useful for sorting linked lists, where removing and inserting items is a constant time $O(1)$ operation.',
			'Strand sort is often used as an educational example of how **recursion** and **merging** can be combined outside of the standard Merge Sort paradigm.'
		]
	}
};
