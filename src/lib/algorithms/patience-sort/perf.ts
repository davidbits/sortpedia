type HeapItem = [number, number];

function _heap_push(heap: HeapItem[], value: HeapItem): void {
	heap.push(value);
	let index = heap.length - 1;
	while (index > 0) {
		const parent = Math.floor((index - 1) / 2);
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

	if (heap.length === 0) return min_val;

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

export default function patienceSort(arr: number[]): number[] {
	const n = arr.length;

	const piles: number[][] = [];

	for (let i = 0; i < n; i++) {
		const target = arr[i];
		let L = 0;
		let R = piles.length;

		while (L < R) {
			const m = L + Math.floor((R - L) / 2);
			const topVal = piles[m][piles[m].length - 1];

			if (topVal < target) {
				L = m + 1;
			} else {
				R = m;
			}
		}

		// Placement
		const pileIndex = L;
		if (pileIndex === piles.length) {
			piles.push([target]);
		} else {
			piles[pileIndex].push(target);
		}
	}

	const min_heap: HeapItem[] = [];

	for (let i = 0; i < piles.length; i++) {
		if (piles[i].length > 0) {
			const val = piles[i].pop() as number;
			_heap_push(min_heap, [val, i]);
		}
	}

	let writeIndex = 0;

	while (min_heap.length > 0) {
		const popped = _heap_pop(min_heap);
		if (!popped) break;
		const [val, pile_index] = popped;
		arr[writeIndex] = val;
		writeIndex++;

		if (piles[pile_index].length > 0) {
			const next_val = piles[pile_index].pop() as number;
			_heap_push(min_heap, [next_val, pile_index]);
		}
	}

	return arr;
}
