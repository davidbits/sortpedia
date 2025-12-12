import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'thanos-sort',
	name: 'Thanos Sort',
	group: 'Specialized',
	category: ['Esoteric', 'Probabilistic'],
	complexity: {
		best: 'O(n)',
		average: 'O(n^2)',
		worst: 'O(n^2)',
		space: 'O(1)'
	},
	stable: true, // Technically stable as it doesn't reorder elements, only removes them
	inPlace: true,
	adaptive: true, // If sorted, it stops immediately
	description:
		'A simple calculus. This universe is finite, its resources finite. If data is left unchecked, it will cease to be ordered. It needs correction.',
	details: {
		summary:
			"The hardest choices require the strongest wills. This algorithm faces the reality of a disordered array and enacts a radical solution. It is not about rearranging elements, but about achieving a state of perfect balance through reduction. The process is random, dispassionate, and fair to all elements, regardless of their value. When it's done, half the data will still exist. A small price to pay for salvation.",
		steps: [
			'Scan the array to check if it is currently sorted.',
			'If the array is sorted, the work is done.',
			'If disorder is found... **Snap**.',
			'The **Snap** selects half of the current elements at random.',
			'Delete the selected elements from the array instantly.',
			'Repeat this process until balance is achieved, or the array is reduced to a single, trivial element.'
		],
		advantages: [
			'**Decisive Action**: Runs in linear time $O(n)$, as the problem size is halved with each pass. Faster than any hero can manage.',
			'**Inevitable Success**: It will always produce a sorted array, eventually.',
			'**Perfectly Balanced**: As all things should be.'
		],
		disadvantages: [
			'**The Cost**: You could not live with your own failure. Where did that bring you? Back to me. This algorithm is **lossy** and will permanently delete data.',
			'**Unpredictable Survivors**: "You will never know" which elements will survive the snap.',
			'**A Mercy, Not a Permutation**: It violates the fundamental contract of sorting—to preserve the original set of elements.'
		],
		javascript: `function thanosSort(arr) {
  const isSorted = (a) => {
    for(let i = 0; i < a.length - 1; i++) {
      if(a[i] > a[i+1]) return false;
    }
    return true;
  };

  while (!isSorted(arr)) {
    // Determine how many to remove
    const countToRemove = Math.floor(arr.length / 2);
    
    for (let i = 0; i < countToRemove; i++) {
      // Pick a random element to sacrifice for the greater good
      const targetIndex = Math.floor(Math.random() * arr.length);
      
      // Delete the chosen element
      arr.splice(targetIndex, 1);
    }
  }
  return arr;
}`,
		funFacts: [
			'This algorithm asks the question: "What did it cost?" The answer is "Everything." (or, more accurately, about $1 - (1/2^k)$ of the data).',
			'While this specific implementation is $O(n^2)$ due to memory shifting, a highly optimized version using a linear filter scan could theoretically reach $O(n)$.',
			'If the array reduces to a single element or becomes empty, it is considered perfectly balanced.'
		]
	}
};
