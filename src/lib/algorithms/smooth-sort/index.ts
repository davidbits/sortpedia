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

	// Visual cue for the cycle operation
	const cycleHighlights: Record<number, string> = {};
	for (let i = 0; i < n; i++) {
		cycleHighlights[arIndices[i]] = 'bg-blue-600'; // Highlight all nodes in the cycle
	}

	yield {
		type: 'cycle-start',
		text: `Rotating ${n} elements in the heap structure.`,
		highlights: cycleHighlights
	};

	// Visualizing the rotation as a series of writes (copies),
	// which accurately reflects the algorithm's memory operations.
	const temp = arr[arIndices[0]];

	// We do not visualize reading into 'temp', but we visualize writing FROM temp later.
	for (let i = 0; i < n - 1; i++) {
		const sourceVal = arr[arIndices[i + 1]];
		const targetIdx = arIndices[i];

		arr[targetIdx] = sourceVal;
		yield {
			type: 'write',
			text: `Moving ${sourceVal} to index ${targetIdx}.`,
			highlights: {
				[targetIdx]: 'bg-vis-write'
			},
			writes: {
				[targetIdx]: sourceVal
			}
		};
	}

	const finalIdx = arIndices[n - 1];
	arr[finalIdx] = temp;
	yield {
		type: 'write',
		text: `Completing cycle: Moving temp value ${temp} to index ${finalIdx}.`,
		highlights: {
			[finalIdx]: 'bg-vis-write'
		},
		writes: {
			[finalIdx]: temp
		}
	};
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

		yield {
			type: 'compare',
			text: `Sifting: Checking root ${arr[buffer[0]]} vs left child ${arr[lf]}`,
			highlights: {
				[buffer[0]]: 'bg-purple-500', // Root
				[lf]: 'bg-vis-compare'
			}
		};

		if (arr[buffer[0]] >= arr[lf]) {
			yield {
				type: 'compare',
				text: `Sifting: Checking root ${arr[buffer[0]]} vs right child ${arr[rt]}`,
				highlights: {
					[buffer[0]]: 'bg-purple-500',
					[rt]: 'bg-vis-compare'
				}
			};
			if (arr[buffer[0]] >= arr[rt]) {
				break;
			}
		}

		// Comparison between children to decide path
		yield {
			type: 'compare',
			text: `Comparing children: ${arr[lf]} vs ${arr[rt]}`,
			highlights: {
				[lf]: 'bg-vis-compare',
				[rt]: 'bg-vis-compare'
			}
		};

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

		yield {
			type: 'compare',
			text: `Trinkle: Comparing forest root ${arr[head]} with previous root ${arr[stepson]}`,
			highlights: {
				[head]: 'bg-purple-500',
				[stepson]: 'bg-vis-compare'
			}
		};

		if (arr[stepson] <= arr[buffer[0]]) {
			break;
		}

		if (!trusty && pshift > 1) {
			rt = head - 1;
			lf = head - 1 - lp[pshift - 2];

			// Logic: if (val[rt] >= val[stepson] || val[lf] >= val[stepson]) break;
			// Expanded for visualization fidelity.
			let shouldBreak = false;

			yield {
				type: 'compare',
				text: `Trinkle: Checking children vs stepson`,
				highlights: {
					[rt]: 'bg-vis-compare',
					[stepson]: 'bg-vis-compare'
				}
			};

			if (arr[rt] >= arr[stepson]) {
				shouldBreak = true;
			} else {
				yield {
					type: 'compare',
					text: `Trinkle: Checking left child vs stepson`,
					highlights: {
						[lf]: 'bg-vis-compare',
						[stepson]: 'bg-vis-compare'
					}
				};
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

	yield {
		type: 'info',
		text: 'Starting Smooth Sort: Building Leonardo Heap structure.',
		highlights: {}
	};

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

	yield {
		type: 'info',
		text: 'Heap construction complete. Dequeuing and sorting.',
		highlights: {}
	};

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
		yield {
			type: 'sorted',
			text: `Element at index ${head + 1} is sorted.`,
			sorted: [head + 1]
		};
	}

	// The loop finishes when index 0 and 1 are remaining, handle final sorted marks
	yield {
		type: 'sorted',
		text: 'Finished: Array is fully sorted.',
		sorted: [0, 1]
	};
}
