import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'radix-sort',
	name: 'Radix Sort',
	group: 'Non-Comparison-Based',
	category: ['Radix'],
	complexity: {
		best: 'O(d(n+k))',
		average: 'O(d(n+k))',
		worst: 'O(d(n+k))',
		space: 'O(n+k)'
	},
	stable: true,
	inPlace: false,
	adaptive: false,
	description:
		'A non-comparative sorting algorithm that sorts integers by processing them digit by digit, from least significant to most significant.',
	details: {
		summary:
			'Radix Sort is a non-comparative integer sorting algorithm that avoids direct element-to-element comparisons. Instead, it distributes elements into "buckets" based on their individual digits. The Least Significant Digit (LSD) variant processes the numbers starting from the units place, then the tens, then the hundreds, and so on. Crucially, it uses a **stable** sorting subroutine (typically Counting Sort) for each digit pass. This ensures that when sorting by the tens digit, the ordering established by the units digit is preserved.',
		steps: [
			'**Find Maximum**: Determine the largest number in the array to calculate the number of digits ($d$) required for processing.',
			'**Iterate Digits**: Start with the least significant digit (units place, $10^0$).',
			'**Frequency Count**: For the current digit, count the frequency of occurrences (0-9) using a bucket array.',
			'**Prefix Sums**: Transform the count array to determine the exact starting positions for each digit value in the output.',
			'**Placement**: Traverse the array **backwards** (to maintain stability) and place each element into its calculated position based on the current digit.',
			'**Repeat**: Move to the next significant digit ($10^1, 10^2, ...$) and repeat the process until the most significant digit of the largest number is handled.'
		],
		advantages: [
			'**Linear Time Performance**: With a time complexity of $O(d(n+k))$, it can be faster than $O(n \\log n)$ comparison sorts (like Quick Sort) when $d$ is small and $n$ is large.',
			'**Stable**: The LSD variant guarantees that equal keys preserve their relative order.',
			'**Non-Comparative**: It is not bound by the $\\Omega(n \\log n)$ lower bound of comparison-based sorting algorithms.'
		],
		disadvantages: [
			'**Specialized Data**: It is restricted to data that can be represented as integers or lexicographical objects (fixed-length strings). It does not natively handle floating-point numbers without mapping.',
			'**Space Overhead**: It requires $O(n+k)$ auxiliary space to hold the output buffer and count arrays.',
			'**Hardware Dependency**: While theoretically efficient, random memory access patterns during the bucket distribution can cause cache misses on modern hardware.'
		],
		javascript: `function getMax(arr) {
  const length = arr.length;
  let mx = arr[0];
  for (let i = 1; i < length; i++) {
    if (arr[i] > mx) mx = arr[i];
  }
  return mx;
}

function countSort(arr, exp) {
  const length = arr.length;
  let output = Array(length);
  let count = Array(10).fill(0, 0);

  // Store count of occurrences in count[]
  for (let i = 0; i < length; i++) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;
  }

  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  for (let i = length - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    output[count[digit] - 1] = arr[i];
    count[digit]--;
  }

  return output;
}

function radixSort(arr) {
  const maxNumber = getMax(arr);
  let sortedArr = [...arr];

  for (let exp = 1; Math.floor(maxNumber / exp) > 0; exp *= 10) {
    const sortedIteration = countSort(sortedArr, exp);
    sortedArr = sortedIteration;
  }

  return sortedArr;
}`,
		funFacts: [
			'Radix sort dates back to **1887** and the work of **Herman Hollerith** on tabulating machines.',
			'The first memory-efficient computer implementation was developed in 1954 at MIT by **Harold H. Seward**.',
			'In some benchmarks on strings or integers, it has been shown to be 50% to 3x faster than general-purpose algorithms like Quicksort.',
			'It is often called "Bucket Sort" or "Digital Sort" in older literature.'
		]
	}
};
