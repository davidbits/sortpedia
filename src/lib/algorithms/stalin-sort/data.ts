import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'stalin-sort',
	name: 'Stalin Sort',
	group: 'Specialized',
	category: ['Esoteric'],
	complexity: {
		best: 'O(n)',
		average: 'O(n)',
		worst: 'O(n)',
		space: 'O(n)'
	},
	stable: true,
	inPlace: false,
	adaptive: true,
	description:
		'A ruthless and efficient single-pass algorithm that eliminates any element that is out of order, sending it to the Gulag.',
	details: {
		summary:
			"Stalin Sort operates under a simple, authoritarian principle: any element that disrupts the established order must be eliminated. It iterates through a list just once, establishing an ordered 'collective' of elements. Any 'comrade' (element) found to be smaller than the last loyal member of the collective is deemed a traitor and is permanently removed. The result is a perfectly sorted—albeit potentially much shorter—list, achieved with O(n) efficiency.",
		steps: [
			'The first element is declared the first **loyal comrade**, establishing the initial standard for the sorted collective.',
			'Iterate through the remaining elements one by one.',
			'Compare the current element to the last known loyal comrade.',
			'If the current element is greater than or equal, it is deemed loyal and becomes the new standard.',
			'If the current element is smaller, it is a **traitor**. It is immediately **purged** from the array.',
			'The process continues until every element has been judged. The remaining elements form the final, sorted state.'
		],
		advantages: [
			'**Extremely Fast**: With a time complexity of $O(n)$, it processes the list in a single, decisive pass.',
			'**Simple to Implement**: The logic is straightforward, requiring no complex data structures or recursion.',
			'**Guaranteed Order**: The resulting array is always perfectly sorted in non-decreasing order.'
		],
		disadvantages: [
			'**Lossy**: This is its defining characteristic and primary drawback. The algorithm does not preserve all original elements, making it unsuitable for any real-world sorting task.',
			'**Not a True Sort**: It fundamentally violates the definition of a sorting algorithm, which requires a permutation of the input.',
			'**Unpredictable Output Size**: The length of the final sorted array depends entirely on the initial arrangement of the data.'
		],
		javascript: `function stalinSort(arr) {
  if (arr.length === 0) {
    return [];
  }
  
  // The first comrade is always loyal.
  const sortedCollective = [arr[0]];
  
  // Judge the rest of the comrades.
  for (let i = 1; i < arr.length; i++) {
    // If the current comrade is loyal (in order), add them.
    if (arr[i] >= sortedCollective[sortedCollective.length - 1]) {
      sortedCollective.push(arr[i]);
    }
    // Otherwise, they are sent to the Gulag (ignored).
  }
  
  return sortedCollective;
}`,
		funFacts: [
			'Stalin Sort originated as a joke within the programming community, likely during a Hacktoberfest event.',
			'The algorithm is a greedy approach to solving the "Longest Increasing Subsequence" problem, but it only finds *an* increasing subsequence, not necessarily the longest one.',
			'A true O(n) implementation requires O(n) space to build a new array. Modifying the array in-place with `splice` is more visual but degrades performance to O(n^2) due to repeated memory shifts.'
		]
	}
};
