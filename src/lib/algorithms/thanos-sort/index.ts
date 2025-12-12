import type { SortEvent, StructuralEvent } from '../types';

export default function* (arr: number[]): Generator<SortEvent> {
	// Loop until the array is empty or sorted
	while (arr.length > 0) {
		let isSorted = true;
		const currentLength = arr.length;

		// 1. Check for sortedness
		for (let i = 0; i < currentLength - 1; i++) {
			yield {
				type: 'compare',
				text: `This universe is finite... its resources, finite.`,
				highlights: {
					[i]: 'bg-vis-compare',
					[i + 1]: 'bg-vis-compare'
				}
			};

			if (arr[i] > arr[i + 1]) {
				isSorted = false;
				yield {
					type: 'compare',
					text: `Fun isn't something one considers... But this does put a smile on my face.`,
					highlights: {
						[i]: 'bg-red-600',
						[i + 1]: 'bg-red-600'
					}
				};
				break; // Stop checking, we need to snap
			}
		}

		// 2. If sorted, finish
		if (isSorted) {
			const sortedIndices = Array.from({ length: arr.length }, (_, k) => k);
			yield {
				type: 'sorted',
				text: 'I finally rest and watch the sun rise on a grateful universe.',
				sorted: sortedIndices
			};
			return;
		}

		// 3. The SNAP: Remove half the array
		const countToRemove = Math.floor(currentLength / 2);
		if (countToRemove === 0 && currentLength > 1) {
			// Edge case: If length is 1, it's sorted (caught above).
			// If logic falls here exceptionally, ensure loop termination.
			return;
		}

		// Determine indices to remove randomly
		const indicesToRemove = new Set<number>();
		while (indicesToRemove.size < countToRemove) {
			indicesToRemove.add(Math.floor(Math.random() * currentLength));
		}

		// Convert to array and sort DESCENDING to prevent index shifting during splice.
		const sortedRemovalIndices = Array.from(indicesToRemove).sort((a, b) => b - a);

		const structuralChanges: StructuralEvent[] = [];

		// Perform the logical removal and queue the visual events
		for (const index of sortedRemovalIndices) {
			arr.splice(index, 1);
			structuralChanges.push({
				type: 'remove',
				index: index
			});
		}

		yield {
			type: 'remove', // A statistical event type
			text: 'I am... inevitable.',
			structural: structuralChanges
		};
	}

	// If we end up with 0 or 1 elements
	yield {
		type: 'sorted',
		text: 'Perfectly balanced, as all things should be.',
		sorted: Array.from({ length: arr.length }, (_, k) => k)
	};
}
