import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'bogo-sort',
	name: 'Bogo Sort',
	group: 'Comparison-Based',
	category: ['Esoteric', 'Brute Force', 'Probabilistic'],
	complexity: {
		best: 'O(n)',
		average: 'O(n \\cdot n!)',
		worst: 'O(\\infty)',
		space: 'O(1)'
	},
	stable: false,
	inPlace: true,
	adaptive: false,
	description:
		'A famously inefficient algorithm that repeatedly generates random permutations of a list until it discovers one that is sorted.',
	details: {
		summary:
			'Bogo Sort, also known as Permutation Sort or Stupid Sort, is a sorting algorithm based on the **generate and test** paradigm. It is not used for practical sorting but serves as an excellent educational tool to illustrate the concept of a "perverse" or brute-force algorithm. The strategy is simple: if the list is not sorted, shuffle it randomly and check again. This continues until the single correct permutation is found by pure chance.',
		steps: [
			'**1. Check Order:** Iterate through the list to check if it is sorted. If it is, the algorithm is complete.',
			'**2. Shuffle:** If the list is not sorted, randomly shuffle all of its elements to create a new, random permutation.',
			'**3. Repeat:** Go back to step 1 and repeat the process indefinitely until the sorted permutation is generated.'
		],
		advantages: [
			'**Conceptual Simplicity**: The core idea is extremely easy to understand.',
			'**Educational Value**: Provides a powerful contrast to efficient algorithms, vividly demonstrating the consequences of poor algorithm design and the astronomical growth of factorial time complexity.',
			'**Best-Case Performance**: In the astronomically unlikely event that the initial array is already sorted, it completes in a single pass with $O(n)$ complexity.'
		],
		disadvantages: [
			'**Extreme Inefficiency**: The average-case complexity of $O(n \\cdot n!)$ makes it unusable for any list with more than a handful of elements.',
			'**Unbounded Runtime**: There is no upper bound on its running time. While it will *eventually* find the sorted order, it is not guaranteed to terminate in any practical amount of time.',
			'**Impractical**: It is never used in practice and exists purely for academic and humorous purposes.'
		],
		javascript: `function isSorted(list) {
  for (let i = 0; i < list.length - 1; i++) {
    if list[i] > list[i+1] {
      return false
    }
  }
  return true
}

function bogoSort(list) {
  while (!isSorted(list)) {
    // Can use any random shuffle method
    shuffle(list)
  }
  return list
}`,
		funFacts: [
			'The name is a portmanteau of "bogus" and "sort".',
			'An analogy for Bogo Sort is sorting a deck of cards by throwing them in the air, picking them up randomly, and checking if they are sorted.',
			'A related hypothetical algorithm, **Quantum Bogosort**, sorts the list by creating a random permutation, and if it is not sorted, destroys the universe. Under the many-worlds interpretation, only universes where the list was sorted on the first try would survive.'
		]
	}
};
