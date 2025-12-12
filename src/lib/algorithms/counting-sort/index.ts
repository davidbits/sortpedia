import type { SortEvent } from '../types';

export default function* (arr: number[]): Generator<SortEvent> {
	// Confirmed correct implementation
	// https://www.geeksforgeeks.org/dsa/counting-sort/
	// Standard Stable Counting Sort Implementation adapted for Visualization
	const n = arr.length;
	if (n === 0) return;

	// Note: Because Counting Sort is not in-place, we must keep a copy of the
	// original values to determine placement, while visually overwriting 'arr'
	// to show the result.
	const inputCopy = [...arr];

	// --- Step 1: Find Max ---
	let maxVal = inputCopy[0];
	yield {
		type: 'compare',
		text: `Starting search for maximum value...`,
		highlights: { [0]: 'bg-vis-compare' }
	};

	for (let i = 1; i < n; i++) {
		const isLarger = inputCopy[i] > maxVal;
		yield {
			type: 'compare',
			text: `Scanning index ${i} (${inputCopy[i]}). Current Max: ${maxVal}`,
			highlights: {
				[i]: 'bg-vis-compare'
			}
		};

		if (isLarger) {
			maxVal = inputCopy[i];
			yield {
				type: 'compare',
				text: `Found new maximum: ${maxVal}`,
				highlights: { [i]: 'bg-vis-compare' }
			};
		}
	}

	// --- Step 2: Initialize Count Array ---
	// Visually, we cannot show the auxiliary array, so we explain the process.
	yield {
		type: 'write', // Using write to indicate memory allocation step
		text: `Initializing Count Array of size ${maxVal + 1} (Range 0 to ${maxVal})`,
		highlights: {}
	};

	const cntArr = new Array(maxVal + 1).fill(0);

	// --- Step 3: Frequency Count ---
	for (let i = 0; i < n; i++) {
		const val = inputCopy[i];
		cntArr[val]++;
		yield {
			type: 'compare', // Using compare color to signify "reading/counting"
			text: `Counting ${val} (Frequency: ${cntArr[val]})`,
			highlights: {
				[i]: 'bg-vis-compare'
			}
		};
	}

	// --- Step 4: Prefix Sums ---
	yield {
		type: 'write',
		text: 'Calculating Prefix Sums to determine element positions...',
		highlights: {}
	};
	for (let i = 1; i <= maxVal; i++) {
		cntArr[i] += cntArr[i - 1];
	}

	// --- Step 5: Build Output ---
	// We reconstruct the array. We iterate backwards through the COPY
	// to preserve stability, but we write to the VISUAL array.
	yield {
		type: 'write',
		text: 'Reconstructing the sorted array (iterating backwards for stability)...',
		highlights: {}
	};

	// We track which indices we have written to for visualization purposes
	const writtenIndices = new Set<number>();

	for (let i = n - 1; i >= 0; i--) {
		const val = inputCopy[i];

		// Calculate target index: cntArr[val] - 1
		const targetIndex = cntArr[val] - 1;

		// Decrement count for the next item of this value
		cntArr[val]--;

		// Update actual array
		arr[targetIndex] = val;
		writtenIndices.add(targetIndex);

		yield {
			type: 'write',
			text: `Placing value ${val} at index ${targetIndex}`,
			highlights: {
				[targetIndex]: 'bg-vis-write' // Highlight where it lands
			},
			writes: {
				[targetIndex]: val
			}
		};
	}

	// Final sorted state
	const allIndices = Array.from({ length: n }, (_, i) => i);
	yield {
		type: 'sorted',
		text: 'Array sorted using Counting Sort',
		sorted: allIndices
	};
}
