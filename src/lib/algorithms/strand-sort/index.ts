import type { SortEvent } from '../types';

export default function* (arr: number[]): Generator<SortEvent> {
	// The 'arr' passed in represents the visual state.
	// We treat the visual array as: [ ...Sorted Output... | ...Remaining Input... ]
	// 'sortedBoundary' marks the index where the Input begins.
	let sortedBoundary = 0;

	// Loop until the "Input" section is empty
	while (sortedBoundary < arr.length) {
		const strand: number[] = [];

		// --- Step 1: Initialize Strand ---
		// Take the first element of the remaining input
		const firstInputVal = arr[sortedBoundary];

		yield {
			type: 'compare',
			text: `Starting new strand with ${firstInputVal}`,
			highlights: {
				[sortedBoundary]: 'bg-purple-500' // Strand color
			}
		};

		// Remove from Input (Visual & Logical)
		strand.push(firstInputVal);
		arr.splice(sortedBoundary, 1);

		yield {
			type: 'remove',
			text: `Moved ${firstInputVal} to strand`,
			structural: [{ type: 'remove', index: sortedBoundary }]
		};

		// --- Step 2: Build Strand ---
		// Iterate through the rest of the Input section
		// Note: Since we removed the item at sortedBoundary, the Input still starts at sortedBoundary.
		let i = sortedBoundary;

		while (i < arr.length) {
			const currentVal = arr[i];
			const lastStrandVal = strand[strand.length - 1];

			// Comparison
			yield {
				type: 'compare',
				text: `Compare: ${currentVal} > ${lastStrandVal}?`,
				highlights: {
					[i]: 'bg-vis-compare'
				}
			};

			if (currentVal > lastStrandVal) {
				// Add to Strand
				strand.push(currentVal);

				// Highlight successful candidate
				yield {
					type: 'compare',
					text: `Yes, ${currentVal} joins the strand`,
					highlights: {
						[i]: 'bg-purple-500'
					}
				};

				// Remove from Input
				arr.splice(i, 1);
				yield {
					type: 'remove',
					text: `Moved ${currentVal} to strand`,
					structural: [{ type: 'remove', index: i }]
				};
				// Do not increment 'i' because the array shifted left
			} else {
				// Skip
				i++;
			}
		}

		// --- Step 3: Merge Strand into Output ---
		// We now have a sorted 'strand' and a sorted 'Output' (arr[0...sortedBoundary-1]).
		// We insert strand items into the Output section.

		yield {
			type: 'compare',
			text: `Merging strand [${strand.join(', ')}] into output`,
			highlights: {}
		};

		for (const strandItem of strand) {
			// Find insertion point in the Sorted Output section
			let insertIndex = 0;

			// Scan through the Sorted Output (which ends at sortedBoundary)
			while (insertIndex < sortedBoundary) {
				yield {
					type: 'compare',
					text: `Merging ${strandItem}: Compare with ${arr[insertIndex]}`,
					highlights: {
						[insertIndex]: 'bg-vis-sorted'
					}
				};

				if (arr[insertIndex] > strandItem) {
					break;
				}
				insertIndex++;
			}

			// Insert logic
			arr.splice(insertIndex, 0, strandItem);

			yield {
				type: 'add',
				text: `Inserted ${strandItem} at index ${insertIndex}`,
				structural: [{ type: 'add', index: insertIndex, value: strandItem }],
				highlights: {
					[insertIndex]: 'bg-vis-sorted'
				}
			};

			// Since we added an item to the Output, the Output section grows
			sortedBoundary++;
		}

		// Mark the current Output as sorted visually
		const sortedIndices = [];
		for (let k = 0; k < sortedBoundary; k++) sortedIndices.push(k);

		yield {
			type: 'sorted',
			text: `Output size is now ${sortedBoundary}`,
			sorted: sortedIndices
		};
	}

	yield {
		type: 'sorted',
		text: 'Sorting complete',
		sorted: arr.map((_, i) => i)
	};
}
