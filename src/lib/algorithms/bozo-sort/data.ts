import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'bozo-sort',
	name: 'Bozo Sort',
	group: 'Comparison-Based',
	category: ['Esoteric', 'Brute Force', 'Probabilistic'],
	complexity: {
		best: 'O(n)',
		average: 'O(n!)',
		worst: 'O(\\infty)',
		space: 'O(1)'
	},
	stable: false,
	inPlace: true,
	adaptive: false,
	description:
		'A terribly inefficient algorithm that, if the list is not sorted, swaps two randomly chosen elements and checks again.',
	details: {
		summary:
			'Bozo Sort is another member of the "perversely awful" family of randomized sorting algorithms. It operates on a simple principle: if the array isn\'t sorted, make a minimal random change and hope for the best. Specifically, it randomly selects two elements and swaps them. This process is repeated until the array happens to be in sorted order. While conceptually similar to Bogo Sort (which shuffles the entire list), Bozo Sort\'s incremental random changes make its path to a solution even more meandering and unpredictable. It serves as a powerful educational example of brute-force, randomized approaches and why they are impractical for real-world use.',
		steps: [
			'**1. Check Order:** Iterate through the list to check if it is sorted. If it is, the algorithm terminates successfully.',
			'**2. Select Pair:** If the list is not sorted, randomly select two indices, `index1` and `index2`. These indices can be the same.',
			'**3. Swap:** Swap the elements at `arr[index1]` and `arr[index2]`.',
			'**4. Repeat:** Go back to step 1 and repeat the process until the sorted order is achieved by chance.'
		],
		advantages: [
			'**Conceptual Simplicity**: The algorithm is exceptionally easy to understand and describe.',
			'**Educational Value**: It provides a clear, humorous example of a terrible algorithm, contrasting sharply with efficient ones and illustrating the consequences of a purely random, brute-force strategy.',
			'**Best-Case Scenario**: If the input array is already sorted, Bozo Sort recognizes this in a single pass with $O(n)$ complexity, making it paradoxically efficient in this one specific case.'
		],
		disadvantages: [
			'**Astronomical Inefficiency**: The average-case time complexity is estimated to be $O(n!)$, making it infeasible for lists with more than a very small number of elements.',
			'**Unbounded Runtime**: Like Bogo Sort, there is no upper limit to its execution time. It is not guaranteed to terminate within any predictable timeframe, though the probability of termination approaches 1 over infinite time.',
			'**Often Slower than Bogo Sort**: While both are factorial, a full shuffle (Bogo Sort) has a $1/n!$ chance of success on each attempt. A single swap (Bozo Sort) is far less likely to correct a significantly disordered array, often requiring many more steps to stumble upon the correct permutation.'
		],
		javascript: `function isSorted(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      return false;
    }
  }
  return true;
}

function bozoSort(arr) {
  while (!isSorted(arr)) {
    const i = Math.floor(Math.random() * arr.length);
    const j = Math.floor(Math.random() * arr.length);
    
    // Swap two random elements
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}`,
		funFacts: [
			'The name "Bozo Sort" comes from the slang term "bozo," meaning a stupid or foolish person, highlighting the algorithm\'s unintelligent approach.',
			'Bozo Sort is a Las Vegas algorithm, meaning it always produces the correct result, but its running time is random and potentially unbounded.',
			'The analysis of Bozo Sort is more complex than that of Bogo Sort and is detailed in the paper "Sorting the slow way: An analysis of perversely awful randomized sorting algorithms" by H. Gruber et al.'
		]
	}
};
