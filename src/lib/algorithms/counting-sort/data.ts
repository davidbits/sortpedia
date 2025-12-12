import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'counting-sort',
	name: 'Counting Sort',
	group: 'Non-Comparison-Based',
	category: ['Counting'],
	complexity: {
		best: 'O(n+k)',
		average: 'O(n+k)',
		worst: 'O(n+k)',
		space: 'O(n+k)'
	},
	stable: true,
	inPlace: false,
	adaptive: false,
	description:
		'An integer sorting algorithm that operates by counting the number of objects that possess distinct key values, then using arithmetic to determine the positions of each key value in the output sequence.',
	details: {
		summary:
			'Counting Sort is an efficient, non-comparison-based sorting algorithm that works best when the range of input values ($k$) is not significantly greater than the number of elements ($n$). Unlike comparison sorts like Merge Sort or Quick Sort, it does not compare elements against each other. Instead, it counts the frequency of each distinct element and calculates their starting positions in the output array using prefix sums. This makes it a **stable** sort with linear time complexity relative to the input size and range.',
		steps: [
			'**Find the Range**: Traverse the array to find the maximum value ($k$) to determine the size of the count array.',
			'**Initialize Count Array**: Create an auxiliary array `cntArr` of size $k+1$ initialized to zeros.',
			'**Frequency Count**: Traverse the input array. For each element, increment the corresponding index in `cntArr`.',
			'**Prefix Sums**: Modify `cntArr` by adding the value of the previous index to the current index. This step determines the position of elements in the sorted output.',
			'**Build Output**: Traverse the input array **backwards** (to maintain stability). For each element, look up its position in `cntArr`, place it in the output array, and decrement the count.'
		],
		advantages: [
			'**Linear Time Complexity**: It runs in $O(n+k)$ time, making it faster than any comparison-based sort ($O(n \\log n)$) when $k$ is $O(n)$.',
			'**Stable**: Preserves the relative order of elements with equal keys, which is essential when used as a subroutine in **Radix Sort**.',
			'**Simple Operations**: Relies on basic arithmetic and array indexing rather than complex recursion or partitioning.'
		],
		disadvantages: [
			'**Restricted Input**: It is an integer sorting algorithm and does not work directly on floating-point numbers or strings without mapping.',
			'**Space Complexity**: It is not an in-place algorithm ($O(n+k)$ space). If the range of values ($k$) is very large (e.g., sorting a few numbers ranging from 1 to $10^9$), memory usage becomes prohibitive.',
			'**Inefficient for Large Ranges**: If the range $k$ is significantly larger than $n$, the algorithm becomes slower than general comparison sorts.'
		],
		javascript: `function countSort(arr) {
    if (arr.length === 0) return [];

    const n = arr.length;
    // 1. Find the maximum value
    const maxVal = Math.max(...arr);

    // 2. Initialize count array
    const cntArr = new Array(maxVal + 1).fill(0);

    // 3. Count frequencies
    for (let v of arr) {
        cntArr[v]++;
    }

    // 4. Compute prefix sums
    for (let i = 1; i <= maxVal; i++) {
        cntArr[i] += cntArr[i - 1];
    }

    // 5. Build output array (backwards for stability)
    const ans = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
        const v = arr[i];
        ans[cntArr[v] - 1] = v;
        cntArr[v]--;
    }

    return ans;
}`,
		funFacts: [
			'Counting Sort and its application to Radix Sort were invented by **Harold H. Seward** in 1954.',
			'It breaks the $O(n \\log n)$ lower bound of comparison-based sorting because it never actually compares two elements to see which is larger.',
			'It is often used as a high-speed subroutine within **Radix Sort** to handle specific digits of larger numbers.',
			'The standard version requires integer keys, as array indices cannot be decimals.'
		]
	}
};
