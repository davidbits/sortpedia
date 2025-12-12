import type { SortEvent } from '../types';

function highlightSubarray(
	start: number,
	end: number,
	color: string,
	existing: Record<number, string> = {}
): Record<number, string> {
	const highlights = { ...existing };
	for (let k = start; k <= end; k++) {
		highlights[k] = color;
	}
	return highlights;
}

function* slowSortRecursive(arr: number[], i: number, j: number): Generator<SortEvent> {
	if (i >= j) {
		return;
	}

	const m = Math.floor((i + j) / 2);

	// Recursively sort the first half
	yield {
		type: 'recursion',
		text: `Recursively sorting first half [${i}..${m}]`,
		highlights: highlightSubarray(i, m, 'bg-vis-accent')
	};
	yield* slowSortRecursive(arr, i, m);

	// Recursively sort the second half
	yield {
		type: 'recursion',
		text: `Recursively sorting second half [${m + 1}..${j}]`,
		highlights: highlightSubarray(m + 1, j, 'bg-vis-accent')
	};
	yield* slowSortRecursive(arr, m + 1, j);

	// Compare the maxima of the two halves
	const isSwapNeeded = arr[j] < arr[m];
	yield {
		type: 'compare',
		text: `Comparing maxima of halves: ${arr[m]} (at index ${m}) and ${arr[j]} (at index ${j}). Swap needed? ${
			isSwapNeeded ? 'Yes' : 'No'
		}`,
		highlights: {
			[m]: isSwapNeeded ? 'bg-vis-swap' : 'bg-vis-compare',
			[j]: isSwapNeeded ? 'bg-vis-swap' : 'bg-vis-compare'
		}
	};

	if (isSwapNeeded) {
		const valM = arr[m];
		const valJ = arr[j];
		[arr[j], arr[m]] = [arr[m], arr[j]]; // Swap
		yield {
			type: 'swap',
			text: `Placing overall maximum at the end. Swapping ${valM} and ${valJ}.`,
			highlights: {
				[m]: 'bg-vis-swap',
				[j]: 'bg-vis-swap'
			},
			writes: {
				[m]: arr[m],
				[j]: arr[j]
			}
		};
	}

	// The element at 'j' is now the maximum for the range [i..j]
	// but it is not yet globally sorted.

	// Recursively sort everything except for the maximum
	yield {
		type: 'recursion',
		text: `Maximum for [${i}..${j}] is now in place. Recursively sorting all but the max [${i}..${j - 1}]`,
		highlights: highlightSubarray(i, j - 1, 'bg-blue-600', { [j]: 'bg-vis-sorted' })
	};
	yield* slowSortRecursive(arr, i, j - 1);
}

export default function* (arr: number[]): Generator<SortEvent> {
	if (arr.length <= 1) {
		if (arr.length === 1) {
			yield { type: 'sorted', text: 'Array is sorted', sorted: [0] };
		}
		return;
	}

	yield* slowSortRecursive(arr, 0, arr.length - 1);

	// Final event to mark all elements as sorted
	const allIndices = Array.from({ length: arr.length }, (_, i) => i);
	yield {
		type: 'sorted',
		text: 'Array is sorted',
		sorted: allIndices
	};
}
