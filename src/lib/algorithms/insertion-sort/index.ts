import type { SortEvent } from '../types';

export default function* (arr: number[]): Generator<SortEvent> {
	// Confirmed correct implementation
	// https://www.geeksforgeeks.org/dsa/insertion-sort-algorithm/
	const n = arr.length;
	// Mark first as sorted
	yield {
		type: 'sorted',
		text: 'First element is essentially sorted',
		sorted: [0]
	};

	for (let i = 1; i < n; i++) {
		const key = arr[i];
		let j = i - 1;

		// Key Selection Event
		yield {
			type: 'compare',
			text: `Selected ${key} as key to insert`,
			highlights: {
				[i]: 'bg-purple-500' // Custom color for Key
			}
		};

		while (j >= 0 && arr[j] > key) {
			// Comparison Event
			yield {
				type: 'compare',
				text: `Is ${arr[j]} > ${key}? Yes.`,
				highlights: {
					[j]: 'bg-vis-compare',
					[j + 1]: 'bg-purple-500' // Keep key highlighted
				}
			};

			// Shift Event
			arr[j + 1] = arr[j];
			yield {
				type: 'write',
				text: `Shifting ${arr[j]} to the right`,
				highlights: {
					[j + 1]: 'bg-vis-write',
					[j]: 'bg-vis-write'
				},
				writes: {
					[j + 1]: arr[j + 1]
				}
			};

			j = j - 1;
		}

		// Insert Event
		arr[j + 1] = key;
		yield {
			type: 'write',
			text: `Inserted key ${key} at index ${j + 1}`,
			highlights: {
				[j + 1]: 'bg-vis-sorted'
			},
			writes: {
				[j + 1]: key
			}
		};

		// Visual cleanup: refresh sorted status for visualization
		const sortedSoFar = [];
		for (let k = 0; k <= i; k++) sortedSoFar.push(k);
		yield { type: 'sorted', text: 'Section sorted', sorted: sortedSoFar };
	}
}
