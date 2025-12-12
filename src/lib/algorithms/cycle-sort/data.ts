import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'cycle-sort',
	name: 'Cycle Sort',
	group: 'Comparison-Based',
	category: ['Exchange'], // It places elements by writing/swapping them to final positions
	complexity: {
		best: 'O(n^2)',
		average: 'O(n^2)',
		worst: 'O(n^2)',
		space: 'O(1)'
	},
	stable: false,
	inPlace: true,
	adaptive: false, // Performance does not improve based on order; always does the scans
	description:
		'An in-place, unstable sorting algorithm that is theoretically optimal in terms of the total number of writes to the original array.',
	details: {
		summary:
			'Cycle Sort is a comparison-based algorithm designed to minimize the total number of memory writes. It works by decomposing the array into a set of "cycles". For each element, the algorithm calculates its correct final position by counting how many elements in the array are smaller than it. It then places the element into that position, displacing the element that was previously there. This displaced element is then moved to **its** correct position, and the process repeats until the cycle returns to the starting point.',
		steps: [
			'Iterate through the array starting from `cycleStart = 0` to `n-2`.',
			'Store the element at `cycleStart` in a temporary variable called `item`.',
			'**Find Rank**: Scan all elements to the right of `cycleStart`. Count how many elements are smaller than `item`. This count added to `cycleStart` gives the correct `pos` (position) for `item`.',
			'**Skip Duplicates**: If `item` is equal to the element currently at `pos`, increment `pos` to place `item` after the duplicates.',
			'**Write**: If `pos` is different from `cycleStart`, write `item` to `arr[pos]`. The value originally at `arr[pos]` becomes the new `item` to be placed.',
			'**Rotate Cycle**: Repeat the find-rank and write process for the new `item` until `pos` equals `cycleStart`.',
			'Move to the next `cycleStart` and repeat.'
		],
		advantages: [
			'**Optimal Writes**: It performs the minimum number of memory writes theoretically possible to sort an array ($n$ minus the number of cycles).',
			'**In-Place**: Requires constant $O(1)$ auxiliary memory.',
			'**Useful for EEPROM**: Because it minimizes writes, it is suitable for memory types where write operations significantly reduce the lifespan of the hardware (like Flash memory).'
		],
		disadvantages: [
			'**Slow Time Complexity**: It runs in $O(n^2)$ time in all cases (Best, Average, and Worst), making it significantly slower than $O(n \\log n)$ algorithms for large datasets.',
			'**Unstable**: It does not preserve the relative order of equal elements.',
			'**Complex Logic**: More complex to implement correctly compared to other $O(n^2)$ algorithms like Bubble or Insertion Sort.'
		],
		javascript: `function cycleSort(arr) {
  const n = arr.length;

  // Traverse array elements and put them in the right place
  for (let cycleStart = 0; cycleStart <= n - 2; cycleStart++) {
    let item = arr[cycleStart];

    // Find position where we put the item
    let pos = cycleStart;
    for (let i = cycleStart + 1; i < n; i++) {
      if (arr[i] < item) {
        pos++;
      }
    }

    // If item is already in correct position
    if (pos === cycleStart) {
      continue;
    }

    // Ignore all duplicate elements
    while (item === arr[pos]) {
      pos += 1;
    }

    // Put the item to its right position
    if (pos !== cycleStart) {
      let temp = item;
      item = arr[pos];
      arr[pos] = temp;
    }

    // Rotate rest of the cycle
    while (pos !== cycleStart) {
      pos = cycleStart;

      // Find position where we put the element
      for (let i = cycleStart + 1; i < n; i++) {
        if (arr[i] < item) {
          pos += 1;
        }
      }

      // Ignore all duplicate elements
      while (item === arr[pos]) {
        pos += 1;
      }

      // Put the item to its right position
      if (item !== arr[pos]) {
        let temp = item;
        item = arr[pos];
        arr[pos] = temp;
      }
    }
  }
  return arr;
}`,
		funFacts: [
			'Cycle Sort is the only in-place sorting algorithm that performs the theoretical minimum number of writes.',
			'Unlike most algorithms, performance doesn\'t degrade if the array is reverse-sorted; the "finding rank" step always checks all subsequent elements regardless of order.',
			'It was developed by W. D. Jones in 1963.'
		]
	}
};
