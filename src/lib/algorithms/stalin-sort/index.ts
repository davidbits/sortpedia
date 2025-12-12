import type { SortEvent, StructuralEvent } from '../types';

export default function* (arr: number[]): Generator<SortEvent> {
	if (arr.length === 0) {
		yield {
			type: 'sorted',
			text: 'An empty collective is a perfectly ordered collective.',
			sorted: []
		};
		return;
	}

	// The first element is the first loyal comrade.
	let lastLoyalValue = arr[0];
	let lastLoyalIndex = 0;
	yield {
		type: 'sorted',
		text: `Comrade ${arr[0]} sets the standard.`,
		sorted: [0],
		highlights: {
			[0]: 'bg-vis-sorted'
		}
	};

	let i = 1;
	while (i < arr.length) {
		// Compare the current comrade to the last loyal one.
		yield {
			type: 'compare',
			text: `Is comrade ${arr[i]} loyal? (${arr[i]} >= ${lastLoyalValue})`,
			highlights: {
				[i]: 'bg-vis-compare', // The one being judged
				[lastLoyalIndex]: 'bg-vis-sorted' // The standard
			}
		};

		if (arr[i] >= lastLoyalValue) {
			// This comrade is loyal.
			lastLoyalValue = arr[i];
			lastLoyalIndex = i;
			yield {
				type: 'sorted',
				text: `Yes. Comrade ${arr[i]} joins the collective.`,
				sorted: [i],
				highlights: {
					[i]: 'bg-vis-sorted'
				}
			};
			i++; // Move to the next comrade.
		} else {
			// This comrade is a traitor. Send to Gulag.
			const traitor = arr[i];
			const structuralChanges: StructuralEvent[] = [{ type: 'remove', index: i }];

			// Splice the array and yield the event.
			arr.splice(i, 1);

			yield {
				type: 'remove',
				text: `No. Comrade ${traitor} is a traitor! Purged.`,
				highlights: {
					[lastLoyalIndex]: 'bg-vis-sorted'
				},
				structural: structuralChanges
			};
			// DO NOT increment `i`, as the next element has shifted into the current index.
		}
	}

	// Final state
	const sortedIndices = Array.from({ length: arr.length }, (_, k) => k);
	yield {
		type: 'sorted',
		text: 'The collective is now perfectly in order.',
		sorted: sortedIndices
	};
}
