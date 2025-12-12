import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'smooth-sort',
	name: 'Smooth Sort',
	group: 'Comparison-Based',
	category: ['Heap', 'Selection'],
	complexity: {
		best: 'O(n)',
		average: 'O(n \\log n)',
		worst: 'O(n \\log n)',
		space: 'O(1)'
	},
	stable: false,
	inPlace: true,
	adaptive: true,
	description:
		'A variation of Heapsort that uses a forest of Leonardo-number-sized heaps to adapt to pre-sorted input, achieving O(n) best-case time while maintaining O(1) auxiliary space.',
	details: {
		summary:
			'Smoothsort is a comparison-based sorting algorithm invented by Edsger Dijkstra. While standard Heapsort builds a single binary heap, Smoothsort maintains a **forest of heaps** where the size of each tree is a **Leonardo number** ($L(n)$). The state of this forest is cleverly encoded in a single bitvector (variable `p` in the code), allowing the algorithm to run in $O(1)$ auxiliary space. Unlike Heapsort, Smoothsort is **adaptive**: if the input is already sorted, it constructs the heap forest without moving data, resulting in linear $O(n)$ runtime.',
		steps: [
			'**1. Leonardo Numbers:** The algorithm partitions the array into chunks of sizes based on Leonardo numbers ($1, 1, 3, 5, 9, 15...$).',
			'**2. Bitvector Encoding:** A bitmask `p` tracks which Leonardo trees currently exist in the forest. If the last two bits are `11`, it means the last two trees have consecutive Leonardo sizes and can potentially be merged.',
			'**3. Build Forest (Grow):** Iterate through the array. For each element, check the bitmask. Either merge the previous two trees into a larger tree (if sizes match Leonardo recurrence) or start a new small tree. This maintains the invariant that tree roots are sorted.',
			'**4. Trinkle:** A unique operation (short for "Tree Sprinkle") that propagates values between the roots of the different trees in the forest. This ensures the global maximum is always at the end of the array.',
			'**5. Shrink & Sort:** Once the array is fully turned into a forest, remove the largest element (at the end). Decompose the root of the largest tree back into its two children, update the bitmask, and re-trinkle to restore order. Repeat until the forest is empty.'
		],
		advantages: [
			"**Adaptive:** Runs in $O(n)$ time for already sorted arrays, beating standard Heapsort's best case of $O(n \\log n)$.",
			'**Memory Efficient:** strictly $O(1)$ auxiliary space. Unlike Quicksort (stack space) or Mergesort (buffer), it needs only a few variables to track the forest state.',
			'**Worst-Case Guarantee:** Guaranteed $O(n \\log n)$ time complexity, preventing the quadratic worst-case scenarios of Quicksort.',
			'**Smooth Transition:** The performance degradation from $O(n)$ to $O(n \\log n)$ is gradual as the input becomes more disordered.'
		],
		disadvantages: [
			'**Complexity:** It is notoriously difficult to implement and understand compared to Quicksort or Heapsort.',
			'**Constant Factor:** The overhead of calculating Leonardo numbers and managing the bitvector makes it slower than Quicksort on random data.',
			'**Unstable:** Like all heap-based sorts, it rearranges equal elements arbitrarily.'
		],
		// TODO: using typescript not javascript
		javascript: `type CompareFn<T> = (a: T, b: T) => number;

// Counts trailing zeros of a BigInt.
function ntz(n: bigint): number {
	if (n === 0n) return 0;
	let count = 0;
	while ((n & 1n) === 0n) {
		n >>= 1n;
		count++;
	}
	return count;
}

// Equivalent to the logic used to find the order of the next tree in the forest.
function pntz(p: bigint): number {
	return ntz(p - 1n);
}

// Rotates values in the array based on the indices in arIndices.
function cycle<T>(arr: T[], arIndices: number[], n: number) {
	if (n < 2) return;

	const temp = arr[arIndices[0]];
	for (let i = 0; i < n - 1; i++) {
		arr[arIndices[i]] = arr[arIndices[i + 1]];
	}
	arr[arIndices[n - 1]] = temp;
}

// Sifts the root of a heap down to restore heap property.
function sift<T>(
	arr: T[],
	head: number,
	cmp: CompareFn<T>,
	pshift: number,
	lp: number[],
	buffer: number[]
) {
	let rt: number;
	let lf: number;
	let i = 1;

	buffer[0] = head;

	while (pshift > 1) {
		rt = head - 1;
		lf = head - 1 - lp[pshift - 2];

		if (
			cmp(arr[buffer[0]], arr[lf]) >= 0 &&
			cmp(arr[buffer[0]], arr[rt]) >= 0
		) {
			break;
		}

		if (cmp(arr[lf], arr[rt]) >= 0) {
			buffer[i++] = lf;
			head = lf;
			pshift -= 1;
		} else {
			buffer[i++] = rt;
			head = rt;
			pshift -= 2;
		}
	}
	cycle(arr, buffer, i);
}

// "Trinkles" (Tree Sprinkles) the roots of the forest to ensure
// the roots themselves are in ascending order before sifting down.
function trinkle<T>(
	arr: T[],
	head: number,
	cmp: CompareFn<T>,
	pp: bigint,
	pshift: number,
	trusty: boolean,
	lp: number[],
	buffer: number[]
) {
	let stepson: number;
	let rt: number;
	let lf: number;
	let p = pp;
	let i = 1;
	let trail: number;

	buffer[0] = head;

	while (p !== 1n) {
		stepson = head - lp[pshift];

		if (cmp(arr[stepson], arr[buffer[0]]) <= 0) {
			break;
		}

		if (!trusty && pshift > 1) {
			rt = head - 1;
			lf = head - 1 - lp[pshift - 2];
			if (
				cmp(arr[rt], arr[stepson]) >= 0 ||
				cmp(arr[lf], arr[stepson]) >= 0
			) {
				break;
			}
		}

		buffer[i++] = stepson;
		head = stepson;
		trail = pntz(p);
		p >>= BigInt(trail);
		pshift += trail;
		trusty = false;
	}

	if (!trusty) {
		cycle(arr, buffer, i);
		sift(arr, head, cmp, pshift, lp, buffer);
	}
}

// Smoothsort implementation.
export function smoothSort<T>(base: T[], cmp: CompareFn<T>): void {
	const nel = base.length;
	if (nel === 0) return;

	// Precompute Leonardo numbers
	// lp[0]=lp[1]=1. width is treated as 1 unit.
	const lp: number[] = [1, 1];
	let i = 2;
	while (true) {
		const next = lp[i - 2] + lp[i - 1] + 1;
		if (next >= nel) break;
		lp[i] = next;
		i++;
	}

	// Allocation buffer for sift/trinkle path tracking.
	// 128 is sufficient for any practical array size (Leonardo depth is logarithmic).
	const buffer = new Array(128);

	let head = 0;
	const high = nel - 1;
	let p = 1n;
	let pshift = 1;
	let trail: number;

	// Build the Heap
	while (head < high) {
		if ((p & 3n) === 3n) {
			sift(base, head, cmp, pshift, lp, buffer);
			p >>= 2n;
			pshift += 2;
		} else {
			if (lp[pshift - 1] >= high - head) {
				trinkle(base, head, cmp, p, pshift, false, lp, buffer);
			} else {
				sift(base, head, cmp, pshift, lp, buffer);
			}

			if (pshift === 1) {
				p <<= 1n;
				pshift = 0;
			} else {
				p <<= BigInt(pshift - 1);
				pshift = 1;
			}
		}
		p |= 1n;
		head++;
	}

	trinkle(base, head, cmp, p, pshift, false, lp, buffer);

	// Dequeue and Sort
	while (pshift !== 1 || p !== 1n) {
		if (pshift <= 1) {
			trail = pntz(p);
			p >>= BigInt(trail);
			pshift += trail;
		} else {
			p <<= 2n;
			pshift -= 2;
			p ^= 7n;
			p >>= 1n;
			trinkle(base, head - lp[pshift] - 1, cmp, p, pshift + 1, true, lp, buffer);
			p <<= 1n;
			p |= 1n;
			trinkle(base, head - 1, cmp, p, pshift, true, lp, buffer);
		}
		head--;
	}
}`,
		funFacts: [
			'Invented by **Edsger Dijkstra** in 1981, specifically to offer an alternative to Heapsort that could take advantage of existing order in the input.',
			'**Musl libc** (standard C library used in Alpine Linux) uses Smoothsort for its `qsort()` implementation, preferring it over Quicksort for its $O(1)$ memory usage and worst-case guarantees.',
			'The **Bitvector** technique allows the algorithm to track the complex forest of Leonardo trees using just a single integer variable (`p`), which is why it qualifies as $O(1)$ space.'
		]
	}
};
