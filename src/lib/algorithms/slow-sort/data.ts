import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'slow-sort',
	name: 'Slow Sort',
	group: 'Comparison-Based',
	category: ['Esoteric', 'Divide and Conquer'],
	complexity: {
		best: 'O(n^{\\frac{\\log_2(n)}{2+\\epsilon}})',
		average: 'O(n^{\\frac{\\log_2(n)}{2+\\epsilon}})',
		worst: 'O(n^{\\frac{\\log_2(n)}{2+\\epsilon}})',
		space: 'O(n)'
	},
	stable: false,
	inPlace: true,
	adaptive: false,
	warningThreshold: 25,
	description:
		"A humorous and notoriously inefficient sorting algorithm based on the parody principle of 'multiply and surrender'.",
	details: {
		summary:
			'Slow Sort is a recursive, in-place sorting algorithm created by Andrei Broder and Jorge Stolfi. It was designed as a "pessimal" algorithm to illustrate concepts of profoundly bad complexity. It is based on the principle of **multiply and surrender**, a parody of the **divide and conquer** strategy. The algorithm recursively sorts two halves of an array, places the maximum of the entire array at the end, and then recursively sorts the entire array again, except for the newly placed maximum. This final, redundant recursive call is the source of its abysmal performance.',
		steps: [
			'**1. Base Case:** If the subarray has one or zero elements, it is already sorted, so return.',
			'**2. Divide:** Split the current subarray `A[i...j]` into two halves at the middle index `m`.',
			'**3. Recursively Sort Halves:**',
			'First, recursively call Slow Sort on the first half `A[i...m]`. This will eventually place the maximum of this half at index `m`.',
			'Second, recursively call Slow Sort on the second half `A[m+1...j]`. This will place the maximum of this half at index `j`.',
			'**4. Find and Place Global Maximum:** Compare the maxima of the two halves (`A[m]` and `A[j]`). If `A[m]` is larger, swap them. This guarantees the maximum element of the entire subarray `A[i...j]` is now at index `j`.',
			'**5. Multiply and Surrender:** Recursively call Slow Sort on the entire subarray except for the maximum element we just placed: `A[i...j-1]`. This final step ensures the rest of the elements are sorted, but at an immense computational cost.'
		],
		advantages: [
			'**Educational Value**: It serves as an excellent and memorable example of a "pessimal" algorithm, highlighting the importance of efficient algorithm design.',
			'**Conceptual Simplicity**: Despite its inefficiency, the recursive structure is relatively straightforward to understand.'
		],
		disadvantages: [
			'**Extreme Inefficiency**: The time complexity, given by the recurrence $T(n) = 2T(n/2) + T(n-1) + 1$, is not in polynomial time and is far worse than even bubble sort.',
			'**Impractical**: It is never used in practice and exists purely for academic and humorous purposes.',
			'**Stack Overflow Risk**: The deep recursion, particularly from the $T(n-1)$ call, can lead to a stack overflow error for even moderately sized arrays.'
		],
		javascript: `function slowSort(A, i, j) {
  // Base Case
  if (i >= j) {
    return;
  }

  const m = Math.floor((i + j) / 2);

  // Sort the first half
  slowSort(A, i, m);

  // Sort the second half
  slowSort(A, m + 1, j);

  // Find max of whole array and place at the end
  if (A[j] < A[m]) {
    [A[j], A[m]] = [A[m], A[j]]; // Swap
  }

  // Sort all but the maximum
  slowSort(A, i, j - 1);
}`,
		funFacts: [
			'The name comes from its creators\' paper "Pessimal Algorithms and Simplexity Analysis", a parody of "Optimal Algorithms and Complexity Analysis".',
			'The "multiply and surrender" principle is a direct, humorous opposite of the effective "divide and conquer" strategy used by algorithms like Merge Sort and Quick Sort.'
		]
	}
};
