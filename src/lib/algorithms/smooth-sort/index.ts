import type { SortEvent } from '../types';

/**
 * Counts trailing zeros of a BigInt.
 * Pure math helper, logic identical to verified source.
 */
function ntz(n: bigint): number {
	if (n === 0n) return 0;
	let count = 0;
	while ((n & 1n) === 0n) {
		n >>= 1n;
		count++;
	}
	return count;
}

/**
 * Calculates ntz(p - 1).
 * Pure math helper, logic identical to verified source.
 */
function pntz(p: bigint): number {
	return ntz(p - 1n);
}

/**
 * Rotates values in the array based on the indices in arIndices.
 * Converted to Generator to visualize the writes.
 */
function* cycle(arr: number[], arIndices: number[], n: number): Generator<SortEvent> {
	if (n < 2) return;

	// Visualizing the rotation as a series of writes (copies),
	// which accurately reflects the algorithm's memory operations.
	const temp = arr[arIndices[0]];

	// We do not visualize reading into 'temp', but we visualize writing FROM temp later.
	for (let i = 0; i < n - 1; i++) {
		const sourceVal = arr[arIndices[i + 1]];
		yield { type: 'write', indices: [arIndices[i]], value: sourceVal };
		arr[arIndices[i]] = sourceVal;
	}

	yield { type: 'write', indices: [arIndices[n - 1]], value: temp };
	arr[arIndices[n - 1]] = temp;
}

/**
 * Sifts the root of a heap down to restore heap property.
 * Converted to Generator to yield comparisons and delegate to cycle*.
 */
function* sift(
	arr: number[],
	head: number,
	pshift: number,
	lp: number[],
	buffer: number[]
): Generator<SortEvent> {
	let rt: number;
	let lf: number;
	let i = 1;

	buffer[0] = head;

	while (pshift > 1) {
		rt = head - 1;
		lf = head - 1 - lp[pshift - 2];

		// Logic: if (val[root] >= val[lf] && val[root] >= val[rt]) break;
		// Expanded to yield comparisons sequentially and respect short-circuiting.

		yield { type: 'compare', indices: [buffer[0], lf] };
		if (arr[buffer[0]] >= arr[lf]) {
			yield { type: 'compare', indices: [buffer[0], rt] };
			if (arr[buffer[0]] >= arr[rt]) {
				break;
			}
		}

		yield { type: 'compare', indices: [lf, rt] };
		if (arr[lf] >= arr[rt]) {
			buffer[i++] = lf;
			head = lf;
			pshift -= 1;
		} else {
			buffer[i++] = rt;
			head = rt;
			pshift -= 2;
		}
	}
	yield* cycle(arr, buffer, i);
}

/**
 * "Trinkles" the roots of the forest.
 * Converted to Generator.
 */
function* trinkle(
	arr: number[],
	head: number,
	pp: bigint,
	pshift: number,
	trusty: boolean,
	lp: number[],
	buffer: number[]
): Generator<SortEvent> {
	let stepson: number;
	let rt: number;
	let lf: number;
	let p = pp;
	let i = 1;
	let trail: number;

	buffer[0] = head;

	while (p !== 1n) {
		stepson = head - lp[pshift];

		yield { type: 'compare', indices: [stepson, buffer[0]] };
		if (arr[stepson] <= arr[buffer[0]]) {
			break;
		}

		if (!trusty && pshift > 1) {
			rt = head - 1;
			lf = head - 1 - lp[pshift - 2];

			// Logic: if (val[rt] >= val[stepson] || val[lf] >= val[stepson]) break;
			// Expanded for visualization fidelity.
			let shouldBreak = false;

			yield { type: 'compare', indices: [rt, stepson] };
			if (arr[rt] >= arr[stepson]) {
				shouldBreak = true;
			} else {
				yield { type: 'compare', indices: [lf, stepson] };
				if (arr[lf] >= arr[stepson]) {
					shouldBreak = true;
				}
			}

			if (shouldBreak) {
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
		yield* cycle(arr, buffer, i);
		yield* sift(arr, head, pshift, lp, buffer);
	}
}

/**
 * Main Smoothsort Generator.
 * An adaptive sorting algorithm that approaches O(n) for nearly sorted arrays
 * and O(n log n) in the worst case.
 */
export default function* smoothSort(arr: number[]): Generator<SortEvent> {
	const nel = arr.length;
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
			yield* sift(arr, head, pshift, lp, buffer);
			p >>= 2n;
			pshift += 2;
		} else {
			if (lp[pshift - 1] >= high - head) {
				yield* trinkle(arr, head, p, pshift, false, lp, buffer);
			} else {
				yield* sift(arr, head, pshift, lp, buffer);
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

	yield* trinkle(arr, head, p, pshift, false, lp, buffer);

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
			yield* trinkle(arr, head - lp[pshift] - 1, p, pshift + 1, true, lp, buffer);
			p <<= 1n;
			p |= 1n;
			yield* trinkle(arr, head - 1, p, pshift, true, lp, buffer);
		}
		head--;

		// Mark the element as sorted as it leaves the heap structure
		yield { type: 'sorted', indices: [head + 1] };
	}

	// The loop finishes when index 0 and 1 are remaining, handle final sorted marks
	yield { type: 'sorted', indices: [1] };
	yield { type: 'sorted', indices: [0] };
}
