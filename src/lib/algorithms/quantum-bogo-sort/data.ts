import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'quantum-bogo-sort',
	name: 'Quantum Bogo Sort',
	group: 'Comparison-Based',
	category: ['Esoteric', 'Probabilistic'],
	complexity: {
		best: 'O(n)',
		average: 'O(n)',
		worst: 'O(n)',
		space: 'O(1)'
	},
	stable: false,
	inPlace: true,
	adaptive: false,
	description:
		'A hypothetical algorithm that generates a single random permutation of a list, and if it is not sorted, destroys the universe.',
	details: {
		summary:
			'Quantum Bogo Sort is a thought experiment in algorithm design based on the **many-worlds interpretation** of quantum mechanics. It operates under the assumption that for any random event, all possible outcomes occur in separate, newly created universes. The algorithm uses a quantum source of entropy to generate one random permutation. If that permutation is sorted, the algorithm succeeds. If not, it triggers the destruction of its own universe. Consequently, the only universes that survive are those in which the list was successfully sorted on the first try.',
		steps: [
			'**1. Quantum Permutation:** Generate a single, random permutation of the input list using a quantum source of entropy. This happens in a single pass.',
			'**2. Check Order:** Check if the list is sorted. This takes $O(n)$ time.',
			'**3. Universal Fate:** If the list is sorted, the algorithm terminates successfully. If not, the universe is destroyed. From the perspective of an observer in a surviving universe, the sort appears to be instantaneous and always successful.'
		],
		advantages: [
			'**Guaranteed $O(n)$ Performance**: From the perspective of any surviving observer, the sort was completed in a single pass, making it one of the fastest known sorting algorithms.',
			'**Conceptual Simplicity**: The logic is brutally straightforward, requiring only one shuffle and one check.',
			'**Problem Solving**: Effectively "solves" the sorting problem by eliminating all universes where the problem was not solved instantly.'
		],
		disadvantages: [
			'**Catastrophically Destructive**: The algorithm has an astronomically high probability of destroying the universe it is run in.',
			'**Unverifiable Premise**: It relies on the many-worlds interpretation of quantum mechanics, which is a non-falsifiable hypothesis.',
			'**Impractical**: It is a purely theoretical and humorous algorithm that cannot be implemented in reality (and should not be, even if it could).'
		],
		javascript: `import { QuantumEntropySource } from './tiny-quantum';

function isSorted(list) {
  for (let i = 0; i < list.length - 1; i++) {
    if (list[i] > list[i+1]) {
      return false;
    }
  }
  return true;
}

function destroyThisUniverse() {
  console.error("Universe terminated.");
  process.exit(1);
}

function quantumBogoSort(list) {
  // 1. Quantum Fisher-Yates Shuffle
  for (let i = list.length - 1; i > 0; i--) {
    const j = QuantumEntropySource.getInt(0, i);
    [list[i], list[j]] = [list[j], list[i]];
  }

  // 2. Check and determine universal fate
  if (isSorted(list)) {
    console.log("Success! This universe survives.");
    return list;
  } else {
    destroyThisUniverse();
  }
}`,
		funFacts: [
			'The complexity is described as $O(n)$ because in any universe that continues to exist, the sort took only a single shuffling pass ($O(n)$) and a single check ($O(n)$).',
			"This algorithm is often cited as a perfect example of a 'physicist's solution'—technically correct under a specific set of assumptions, but utterly impractical."
		]
	}
};
