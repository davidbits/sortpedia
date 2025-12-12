import type { SortEvent } from '../types';

export default function* (arr: number[]): Generator<SortEvent> {
	// Confirmed correct implementation
	// https://www.geeksforgeeks.org/dsa/radix-sort/
	const n = arr.length;
	if (n === 0) return;

	// 1. Find Maximum to determine max digits
	let maxVal = arr[0];
	yield {
		type: 'compare',
		text: 'Scanning for maximum value to determine digit count...',
		highlights: { [0]: 'bg-vis-compare' }
	};

	for (let i = 1; i < n; i++) {
		if (arr[i] > maxVal) maxVal = arr[i];
		yield {
			type: 'compare',
			text: `Current Max: ${maxVal}. Checking index ${i}...`,
			highlights: { [i]: 'bg-vis-compare' }
		};
	}

	// 2. Iterate for every digit. exp is 10^i
	for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
		const digitLabel = exp === 1 ? 'Units' : exp === 10 ? 'Tens' : exp === 100 ? 'Hundreds' : exp;

		yield {
			type: 'write',
			text: `Starting pass for digit: ${digitLabel} (exp=${exp})`,
			highlights: {}
		};

		// We need a stable Counting Sort for this digit.
		// Since Radix Sort isn't in-place, we read from a snapshot
		// and write to the visual array.
		const inputSnapshot = [...arr];
		const count = new Array(10).fill(0);

		// A. Frequency Count
		for (let i = 0; i < n; i++) {
			const digit = Math.floor(inputSnapshot[i] / exp) % 10;
			count[digit]++;
			yield {
				type: 'compare',
				text: `Scanning ${inputSnapshot[i]}: Digit at ${exp}s place is ${digit}`,
				highlights: {
					[i]: 'bg-vis-compare'
				}
			};
		}

		// B. Prefix Sums
		for (let i = 1; i < 10; i++) {
			count[i] += count[i - 1];
		}

		// C. Build Output (Backwards for Stability)
		// We iterate the snapshot backwards, calculate position, and write to 'arr'
		for (let i = n - 1; i >= 0; i--) {
			const val = inputSnapshot[i];
			const digit = Math.floor(val / exp) % 10;

			// Calculate target index
			const targetIndex = count[digit] - 1;
			count[digit]--;

			// Write to the live array
			arr[targetIndex] = val;

			yield {
				type: 'write',
				text: `Moving ${val} to index ${targetIndex} (sorted by ${digitLabel} digit)`,
				highlights: {
					[targetIndex]: 'bg-vis-write'
				},
				writes: {
					[targetIndex]: val
				}
			};
		}
	}

	yield {
		type: 'sorted',
		text: 'Radix Sort Complete',
		sorted: Array.from({ length: n }, (_, k) => k)
	};
}
