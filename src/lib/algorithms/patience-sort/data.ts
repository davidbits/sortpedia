import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'patience-sort',
	name: 'Patience Sort',
	group: 'Comparison-Based',
	category: ['Insertion', 'Heap'], // It builds piles (Insertion) and merges them (Heap)
	complexity: {
		best: 'O(n \\log n)',
		average: 'O(n \\log n)',
		worst: 'O(n \\log n)',
		space: 'O(n)'
	},
	stable: false,
	inPlace: false,
	adaptive: false,
	description:
		'A sorting algorithm based on the card game "Patience". It sorts by distributing elements into piles according to specific rules, then merging the piles efficiently using a priority queue.',
	details: {
		summary:
			'Patience Sort is a two-phase algorithm named after the Patience card game. In the first phase, elements are distributed into **piles**. A new element is placed on the leftmost pile where the top card is greater than or equal to the new element. If no such pile exists, a new pile is started. This process incidentally calculates the length of the **Longest Increasing Subsequence** (which equals the number of piles). In the second phase, the algorithm performs a $k$-way merge of the piles using a **Min-Heap** to reconstruct the sorted sequence.',
		steps: [
			'**Phase 1: Piling**: Iterate through the input array one element at a time.',
			'For each element $x$, perform a **binary search** on the "top" cards of the existing piles to find the leftmost pile where $top \\ge x$.',
			'If such a pile is found, place $x$ on top of it. If not, create a new pile with $x$ as the first card.',
			'**Phase 2: Merging**: Once all elements are in piles, initialize a **Min-Heap** with the top card from every pile.',
			'Repeatedly extract the minimum value from the heap and add it to the sorted output array.',
			'When a card is removed from a pile, if the pile is not empty, push the next card from that pile into the heap.',
			'Repeat until all piles are empty.'
		],
		advantages: [
			'**Longest Increasing Subsequence**: Uniquely, the number of piles created during the sort is exactly the length of the longest increasing subsequence in the original array.',
			'**Adaptive to Presorted Runs**: It performs well on data that naturally contains ordered subsequences.',
			'**Historical Significance**: It serves as a bridge between sorting algorithms and combinatorial problems (Young Tableaux).'
		],
		disadvantages: [
			'**Space Complexity**: It requires $O(n)$ auxiliary space to store the piles, making it memory-heavy compared to in-place sorts like Quicksort or Heapsort.',
			'**Complex Implementation**: Requires implementing both a dynamic pile structure and a priority queue (heap), making it more code-heavy than basic sorts.',
			'**Cache Locality**: The node-based or list-of-lists structure for piles often results in poor cache performance on modern hardware.'
		],
		javascript: `function patienceSort(arr) {
  class MinHeap {
    constructor(compareFn) {
      this.heap = [];
      this.compare = compareFn;
    }

    push(val) {
      this.heap.push(val);
      this.bubbleUp(this.heap.length - 1);
    }

    pop() {
      if (this.heap.length === 0) return null;
      const min = this.heap[0];
      const last = this.heap.pop();
      if (this.heap.length > 0) {
        this.heap[0] = last;
        this.bubbleDown(0);
      }
      return min;
    }

    bubbleUp(index) {
      while (index > 0) {
        const parent = Math.floor((index - 1) / 2);
        if (this.compare(this.heap[index], this.heap[parent]) < 0) {
          [this.heap[index], this.heap[parent]] = 
            [this.heap[parent], this.heap[index]];
          index = parent;
        } else break;
      }
    }

    bubbleDown(index) {
      while (true) {
        let swap = null;
        const left = 2 * index + 1;
        const right = 2 * index + 2;
        const len = this.heap.length;
        
        if (left < len && 
            this.compare(this.heap[left], this.heap[index]) < 0) {
          swap = left;
        }
        
        // Check if right child is even smaller
        const currentRef = swap === null ? index : left;
        if (right < len && 
            this.compare(this.heap[right], this.heap[currentRef]) < 0) {
          swap = right;
        }
        
        if (swap !== null) {
          [this.heap[index], this.heap[swap]] = 
            [this.heap[swap], this.heap[index]];
          index = swap;
        } else break;
      }
    }
  }

  function getPileIndex(piles, target) {
    let L = 0, R = piles.length;
    while (L < R) {
      const m = Math.floor((L + R) / 2);
      // Compare target with the top (last) card of pile m
      if (piles[m][piles[m].length - 1] < target) {
        L = m + 1;
      } else {
        R = m;
      }
    }
    return L;
  }

  // Phase 1: Distribute into Piles
  const piles = [];
  for (const x of arr) {
    const idx = getPileIndex(piles, x);
    if (idx === piles.length) {
      piles.push([x]);
    } else {
      piles[idx].push(x);
    }
  }

  // Phase 2: Merge Piles
  const sortedArr = [];
  // MinHeap stores objects: { val: number, pileIdx: number }
  const heap = new MinHeap((a, b) => a.val - b.val);

  // Initialize heap with the top card of each pile
  for (let i = 0; i < piles.length; i++) {
    if (piles[i].length > 0) {
      heap.push({ val: piles[i].pop(), pileIdx: i });
    }
  }

  while (heap.heap.length > 0) {
    const { val, pileIdx } = heap.pop();
    sortedArr.push(val);

    // If the pile still has cards, add the next one to the heap
    if (piles[pileIdx].length > 0) {
      heap.push({ val: piles[pileIdx].pop(), pileIdx });
    }
  }

  return sortedArr;
}`,
		funFacts: [
			'The number of piles created is equal to the length of the **Longest Increasing Subsequence** (LIS) of the array.',
			'Patience Sort is named after the solitaire card game "Patience". The sorting strategy is an optimal greedy strategy for playing the game.',
			'Real-world physical sorting (like sorting a deck of cards by hand) often resembles patience sort: dealing cards into piles and then gathering them up.'
		]
	}
};
