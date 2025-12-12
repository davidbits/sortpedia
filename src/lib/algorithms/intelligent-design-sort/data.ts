import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'intelligent-design-sort',
	name: 'Intelligent Design Sort',
	group: 'Specialized',
	category: ['Esoteric'],
	complexity: {
		best: 'O(1)',
		average: 'O(1)',
		worst: 'O(1)',
		space: 'O(1)'
	},
	stable: true,
	inPlace: true,
	adaptive: true,
	description: 'A sorting algorithm based on the theological theory of intelligent design.',
	details: {
		summary:
			"The probability of the original input list being in the exact order it's in is $1/(n!)$. There is such a small likelihood of this that it's clearly absurd to say that this happened by chance, so it must have been consciously put in that order by an intelligent Sorter. Therefore it's safe to assume that it's already optimally Sorted in a way that transcends our naïve mortal understanding of 'ascending order'. Any attempt to change that order to conform to our own preconceptions would actually make it less sorted.",
		steps: [
			'Acknowledge that the input array exists.',
			'Recognize that its current arrangement could not have occurred by random chance.',
			'Attribute the array’s order to a conscious, intelligent Sorter.',
			'Conclude that the array is therefore already in its perfect, intended order.',
			'Do nothing.'
		],
		advantages: [
			'**Timeless Complexity**: The algorithm is constant in time ($O(1)$), as the Sorter exists outside of time.',
			'**Perfect Space Efficiency**: It is perfectly in-place, requiring no additional memory ($O(1)$).',
			'**No Technology Required**: It does not require "any of that suspicious technological computer stuff".',
			'**Unquestionable Correctness**: The output is guaranteed to be optimally sorted according to the Sorter’s transcendent plan.'
		],
		disadvantages: [
			'**Mortal Incomprehension**: The resulting order may not conform to naïve human concepts such as "ascending" or "descending".',
			'**Heresy Risk**: Questioning the sorted nature of the output is considered heresy.',
			'**Non-Determinism of Faith**: Different disciples may interpret the Sorter’s intentions for the same data in different ways, leading to theological schisms.'
		],
		javascript: `function intelligentDesignSort(arr) {
  // The list was consciously put in this order by an
  // intelligent Sorter. It is already optimally sorted.
  // Praise the Sorter!
  return arr;
}`,
		funFacts: [
			'A critique by Gary Rogers states, "Making the sort constant in time denies the power of The Sorter. The Sorter exists outside of time, thus the sort is timeless... this particular sort is flawed". This is, of course, heresy.',
			'A corollary by Krishna Kumar suggests that all elements are created equal under the Sorter. Since any random permutation is also sorted by the same logic, it implies that all elements must be equal to each other.'
		]
	}
};
