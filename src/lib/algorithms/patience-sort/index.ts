import type { SortEvent } from '../types';

// Define the specific shape of items in our heap: [value, pile_index]
type HeapItem = [number, number];

// --- Heap Helper Functions based on Python implementation ---

function _heap_push(heap: HeapItem[], value: HeapItem): void {
	heap.push(value);
	let index = heap.length - 1;
	while (index > 0) {
		const parent = Math.floor((index - 1) / 2);
		// Compare values (tuple: [value, pile_index])
		// We compare index 0 (the value), not index 1 (the pile ID)
		if (heap[parent][0] > heap[index][0]) {
			[heap[index], heap[parent]] = [heap[parent], heap[index]];
			index = parent;
		} else {
			break;
		}
	}
}

function _heap_pop(heap: HeapItem[]): HeapItem | null {
	if (heap.length === 0) return null;
	const min_val = heap[0];
	const last_val = heap.pop();

	// If the heap is empty after pop, just return the min_val
	if (heap.length === 0) return min_val;

	// Otherwise, move the last value to root and sift down
	if (last_val) {
		heap[0] = last_val;
	}

	let index = 0;
	const length = heap.length;
	while (true) {
		const left = 2 * index + 1;
		const right = 2 * index + 2;
		let smallest = index;

		if (left < length && heap[left][0] < heap[smallest][0]) {
			smallest = left;
		}
		if (right < length && heap[right][0] < heap[smallest][0]) {
			smallest = right;
		}
		if (smallest !== index) {
			[heap[index], heap[smallest]] = [heap[smallest], heap[index]];
			index = smallest;
		} else {
			break;
		}
	}
	return min_val;
}

export default function* (arr: number[]): Generator<SortEvent> {
	const n = arr.length;

	// Internal structure to hold the values in piles.
	// We simulate the 2D structure in memory.
	const piles: number[][] = [];

	// For Visualization:
	// We track the 'original index' of the element sitting at the top of each pile.
	// This allows us to highlight the "Top Cards" during the search phase.
	const pileTopIndices: number[] = [];

	// --- Phase 1: Piling ---
	yield {
		type: 'info',
		text: 'Phase 1: Distributing elements into piles',
		highlights: {}
	};

	for (let i = 0; i < n; i++) {
		const target = arr[i];

		// Highlight the card we are trying to place
		yield {
			type: 'compare',
			text: `Attempting to place card ${target} (Index ${i})`,
			highlights: {
				[i]: 'bg-purple-500',
				...Object.fromEntries(pileTopIndices.map((idx) => [idx, 'bg-vis-compare']))
			}
		};

		// Binary Search for the leftmost pile where top >= target
		let L = 0;
		let R = piles.length;

		while (L < R) {
			const m = L + Math.floor((R - L) / 2);
			const topVal = piles[m][piles[m].length - 1];
			const topIdx = pileTopIndices[m];

			// Visualization: Show Comparison
			yield {
				type: 'compare',
				text: `Checking Pile ${m} (Top: ${topVal}): Is ${topVal} < ${target}?`,
				highlights: {
					[i]: 'bg-purple-500', // Current card
					[topIdx]: 'bg-vis-compare' // Pile top being checked
				}
			};

			if (topVal < target) {
				L = m + 1;
			} else {
				R = m;
			}
		}

		// Placement
		const pileIndex = L;
		if (pileIndex === piles.length) {
			// Create new pile
			piles.push([target]);
			pileTopIndices.push(i);
			yield {
				type: 'compare',
				text: `No suitable pile found. Starting Pile ${pileIndex} with ${target}.`,
				highlights: {
					[i]: 'bg-vis-sorted' // Temporarily mark as "placed"
				}
			};
		} else {
			// Append to existing pile
			piles[pileIndex].push(target);
			pileTopIndices[pileIndex] = i; // Update the "visual top" of this pile
			yield {
				type: 'compare',
				text: `Placed ${target} on top of Pile ${pileIndex}.`,
				highlights: {
					[i]: 'bg-vis-sorted'
				}
			};
		}
	}

	// --- Phase 2: Merging ---
	yield {
		type: 'info',
		text: `Phase 2: Merging ${piles.length} piles (LIS Length: ${piles.length})`,
		highlights: {}
	};

	// Initialize Min Heap with (value, pile_index) tuples
	const min_heap: HeapItem[] = [];

	for (let i = 0; i < piles.length; i++) {
		if (piles[i].length > 0) {
			// We know pop() is safe because length > 0
			const val = piles[i].pop() as number;
			_heap_push(min_heap, [val, i]);
		}
	}

	let writeIndex = 0;

	while (min_heap.length > 0) {
		// We know shift() is safe because length > 0,
		// and _heap_pop handles internal logic returning HeapItem
		const popped = _heap_pop(min_heap);
		if (!popped) break;

		const [val, pile_index] = popped;

		// Visualization: Writing to the array
		// We highlight the write index.
		arr[writeIndex] = val;

		yield {
			type: 'write',
			text: `Merged smallest value ${val} from Pile ${pile_index}`,
			highlights: {
				[writeIndex]: 'bg-vis-write'
			},
			writes: {
				[writeIndex]: val
			}
		};

		// Mark as sorted
		yield {
			type: 'sorted',
			text: `${val} is sorted`,
			sorted: [writeIndex]
		};

		writeIndex++;

		// Push next value from the same pile if available
		if (piles[pile_index].length > 0) {
			const next_val = piles[pile_index].pop() as number;
			_heap_push(min_heap, [next_val, pile_index]);
		}
	}

	// Final cleanup to ensure everything is marked sorted
	const allIndices = Array.from({ length: n }, (_, k) => k);
	yield {
		type: 'sorted',
		text: 'All elements sorted',
		sorted: allIndices
	};
}
