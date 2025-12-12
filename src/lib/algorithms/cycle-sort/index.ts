import type { SortEvent } from '../types';

export default function* (arr: number[]): Generator<SortEvent> {
	// Confirmed correct implementation
	// https://www.geeksforgeeks.org/dsa/cycle-sort/
	const n = arr.length;

	// Loop through the array to find cycles to rotate.
	for (let cycleStart = 0; cycleStart <= n - 2; cycleStart++) {
		let item = arr[cycleStart];

		// Highlight the start of the cycle
		yield {
			type: 'compare',
			text: `Starting new cycle. Holding value ${item}.`,
			highlights: {
				[cycleStart]: 'bg-purple-500' // Anchor point
			}
		};

		// --- FIRST PASS: Find where to put the item ---
		let pos = cycleStart;
		for (let i = cycleStart + 1; i < n; i++) {
			// Visualize the scan
			yield {
				type: 'compare',
				text: `Checking if ${arr[i]} < ${item} (Held Item)`,
				highlights: {
					[cycleStart]: 'bg-purple-500', // Origin
					[i]: 'bg-vis-compare' // Scanner
				}
			};

			if (arr[i] < item) {
				pos++;
			}
		}

		// If the item is already there, this is not a cycle.
		if (pos === cycleStart) {
			yield {
				type: 'sorted',
				text: `Value ${item} is already in correct position.`,
				sorted: [cycleStart]
			};
			continue;
		}

		// Otherwise, put the item there or right after any duplicates.
		while (item === arr[pos]) {
			pos += 1;
		}

		// WRITE OPERATION
		if (pos !== cycleStart) {
			// Swap held item with element at pos
			const temp = arr[pos];
			arr[pos] = item;
			item = temp;

			yield {
				type: 'write',
				text: `Wrote ${arr[pos]} to index ${pos}. Picked up ${item}.`,
				highlights: {
					[cycleStart]: 'bg-purple-500', // Cycle Start
					[pos]: 'bg-vis-swap' // Write location
				},
				writes: {
					[pos]: arr[pos]
				}
			};
		}

		// --- ROTATE REST OF CYCLE ---
		while (pos !== cycleStart) {
			pos = cycleStart;

			// Find where to put the item (Recalculate rank)
			for (let i = cycleStart + 1; i < n; i++) {
				// Visualize the scan for the DISPLACED item
				yield {
					type: 'compare',
					text: `Finding position for displaced item ${item}. Checking index ${i}`,
					highlights: {
						[cycleStart]: 'bg-purple-500',
						[i]: 'bg-vis-compare'
					}
				};

				if (arr[i] < item) {
					pos += 1;
				}
			}

			// Put the item there or right after any duplicates.
			while (item === arr[pos]) {
				pos += 1;
			}

			// Swap/Write
			if (item !== arr[pos]) {
				const temp = arr[pos];
				arr[pos] = item;
				item = temp;

				yield {
					type: 'write',
					text: `Wrote ${arr[pos]} to index ${pos}. Picked up ${item}.`,
					highlights: {
						[cycleStart]: 'bg-purple-500',
						[pos]: 'bg-vis-swap'
					},
					writes: {
						[pos]: arr[pos]
					}
				};
			}
		}

		// Cycle complete, start index is sorted
		yield {
			type: 'sorted',
			text: `Cycle complete. Index ${cycleStart} is sorted.`,
			sorted: [cycleStart]
		};
	}

	// Final cleanup: mark end of array sorted
	const remaining = [];
	for (let i = 0; i < n; i++) remaining.push(i);
	yield {
		type: 'sorted',
		text: 'Array is sorted',
		sorted: remaining
	};
}
