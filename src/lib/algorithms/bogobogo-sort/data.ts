import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'bogobogo-sort',
	name: 'Bogobogo Sort',
	group: 'Comparison-Based',
	category: ['Esoteric', 'Brute Force', 'Probabilistic'],
	complexity: {
		best: 'O(n^2)',
		average: 'O((n!)!)',
		worst: 'O(\\infty)',
		space: 'O(n^2)'
	},
	stable: false,
	inPlace: false, // The algorithm requires O(n^2) space for copies and recursion stack.
	adaptive: false,
	description:
		'A monumentally inefficient recursive sorting algorithm that sorts the first n-1 elements before checking the nth, leading to an astronomically large complexity.',
	details: {
		summary:
			'Bogobogo Sort is a recursive, "generate and test" algorithm that stands as one of the most inefficient sorting methods ever conceived. It is a variation of Bogo Sort but with a far more complex termination condition. To sort a list, it first recursively sorts the initial `n-1` elements. Then, it checks if the last element is in the correct place. If not, it shuffles the entire list and starts over. The "is sorted" check is itself a recursive sorting process, leading to its factorial-of-a-factorial average time complexity.',
		steps: [
			'**1. Make a Copy:** To check if a list is sorted, first create a complete copy of it.',
			'**2. Recursively Sort Sublist:** Sort the first `n-1` elements of the **copy** using Bogobogo Sort. This is the first layer of recursion.',
			'**3. Check Final Element:** Check if the nth element of the now partially-sorted copy is greater than the (n-1)th element. If not, randomize the order of the elements in the copy and repeat step 2.',
			'**4. Final Comparison:** Once the copy is fully sorted according to the rules above, check if it is now identical to the **original list**. If it is, the original list is considered sorted. If not, the original list is shuffled, and the entire 4-step process begins again.'
		],
		advantages: [
			'**Educational Value**: Serves as an extreme and unforgettable example of a "perverse" algorithm, perfectly illustrating concepts like unbounded runtime and factorial complexity growth.'
		],
		disadvantages: [
			'**Astronomical Inefficiency**: With an average complexity of $O((n!)!)$, it is unimaginably slower than Bogo Sort and is likely computationally infeasible for any list with more than 5 elements.',
			'**Unbounded Runtime**: Like Bogo Sort, there is no guaranteed upper limit on its execution time; it may never terminate.',
			'**High Space Complexity**: The recursive nature of the algorithm, with copies being made at each step, results in $O(n^2)$ space complexity.'
		],
		// TODO: using typescript not javascript
		javascript: `// Uses the Fisher-Yates shuffle algorithm.
function shuffleRange(data: number[], start: number, end: number): void {
	// The range is [start, end)
	for (let i = end - 1; i > start; i--) {
		const j = start + Math.floor(Math.random() * (i - start + 1));
		[data[i], data[j]] = [data[j], data[i]];
	}
}

// Recursively sorts the first n elements
function bogobogosortInternal(data: number[], n: number): void {
	if (n <= 1) {
		return;
	}

	while (true) {
		// Step 2: Sort first n-1 elements using FULL bogobogosort

		// Extract sublist (0 to n-1)
		const sublist = data.slice(0, n - 1);

		// Keep shuffling until bogobogosort says it's sorted
		while (!isSortedBogobogo(sublist)) {
			shuffleRange(sublist, 0, sublist.length);
		}

		// Copy sorted sublist back
		for (let i = 0; i < sublist.length; i++) {
			data[i] = sublist[i];
		}

		// Step 3: Check if nth element >= highest of first n-1
		if (data[n - 1] >= data[n - 2]) {
			return;
		}

		// Randomize first n elements and repeat
		shuffleRange(data, 0, n);
	}
}

// The full 4-step bogobogosort "is sorted" check.
function isSortedBogobogo(originalData: number[]): boolean {
	const n = originalData.length;
	if (n <= 1) {
		return true;
	}

	// Step 1: Make a copy
	const copy = [...originalData];

	// Steps 2 & 3: Sort the copy using bogobogosort
	bogobogosortInternal(copy, n);

	// Step 4: Check if copy matches original
	if (originalData.length !== copy.length) return false;
	for (let i = 0; i < originalData.length; i++) {
		if (originalData[i] !== copy[i]) return false;
	}
	return true;
}

// Main bogobogosort function.
function bogobogosort(data: number[]): void {
	while (!isSortedBogobogo(data)) {
		shuffleRange(data, 0, data.length);
	}
}`,
		funFacts: [
			'The algorithm was conceived from the satirical premise that the standard Bogo Sort, with its $O(n \\cdot n!)$ complexity, was **"far too efficient."**',
			'In a C++ implementation tested in 2013, sorting a list of just **6 items** took 450 seconds (7.5 minutes). The attempt to sort **7 items** was abandoned after it failed to complete overnight.',
			'The algorithm is so convoluted that its precise time complexity has been a subject of debate, with different analyses proposing bounds like $O(n \\cdot (n!)^n)$, highlighting its theoretical absurdity.'
		]
	}
};
