import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'bubble-sort',
	name: 'Bubble Sort',
	group: 'Comparison-Based',
	category: ['Exchange'],
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
		'The simplest sorting algorithm that repeatedly swaps adjacent elements if they are in the wrong order.',
	details: {
		summary:
			'Bubble Sort is an introductory algorithm that works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they are in the wrong order. The pass through the list is repeated until the list is sorted. The algorithm gets its name because smaller elements "bubble" to the top of the list (beginning) while larger elements "sink" to the bottom (end) during each iteration.',
		steps: [
			'Start with the first element at index $i=0$.',
			'Compare the current element with the next element ($i$ and $i+1$).',
			'If the current element is greater than the next element, **swap** them.',
			'Move to the next pair and repeat until the end of the list. After the first pass, the largest element is guaranteed to be in its correct final position.',
			'Repeat the process for the remaining unsorted elements ($N-1$, $N-2$, etc.).',
			'**Optimization**: If a pass completes with zero swaps, the array is already sorted, and the algorithm terminates early.'
		],
		advantages: [
			'**Simplicity**: It is extremely easy to understand and implement, making it a favorite for introductory Computer Science courses.',
			'**Space Efficiency**: It is an in-place sorting algorithm requiring only $O(1)$ auxiliary memory space.',
			'**Stability**: Elements with identical keys maintain their relative order, which is crucial for certain data structures.',
			'**Detection**: With the "swapped" flag optimization, it can detect an already sorted list in $O(n)$ time.'
		],
		disadvantages: [
			'**Performance**: With a time complexity of $O(n^2)$, it is highly inefficient for large datasets.',
			'**Redundant Swaps**: It performs many swap operations, which can be costly if writing to memory is expensive.',
			'**Turtles**: Small elements at the end of the list move to the beginning very slowly (one position per pass). These are known as "turtles" and significantly degrade performance.'
		],
		javascript: `function bubbleSort(arr) {
  let n = arr.length;
  let swapped;
  
  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    
    // Last i elements are already in place
    for (let j = 0; j < n - i - 1; j++) {
      
      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {
        // Swap if they are in wrong order
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        
        swapped = true;
      }
    }
    
    // If no two elements were swapped by inner loop, 
    // then the array is sorted.
    if (!swapped) break;
  }
  return arr;
}`,
		funFacts: [
			'In a 2007 interview, former Google CEO Eric Schmidt asked then-candidate <strong>Barack Obama</strong> how to sort a million integers. Obama famously replied, "I think the bubble sort would be the wrong way to go."',
			'The issue of "turtles" (small values near the end) led to the invention of <strong>Cocktail Shaker Sort</strong>, which sorts in both directions to solve the problem.',
			'It was originally described in 1956 as a "sorting exchange algorithm" before Kenneth E. Iverson later coined the name "Bubble Sort".'
		]
	}
};
