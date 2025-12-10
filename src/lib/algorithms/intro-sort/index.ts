import type { SortEvent } from '../types';

export default function* (arr: number[]): Generator<SortEvent> {
	// Confirmed correct implementation
	// https://www.geeksforgeeks.org/dsa/introsort-or-introspective-sort/
	const n = arr.length;
	// Standard depth limit is 2 * log2(n)
	const depthLimit = 2 * Math.floor(Math.log2(n));

	yield {
		type: 'info',
		text: `Starting Introsort. Depth limit calculated as ${depthLimit}.`,
		highlights: {}
	};

	yield* introSortUtil(arr, 0, n - 1, depthLimit);

	// Final pass to ensure visualization marks everything as sorted
	const allIndices = Array.from({ length: n }, (_, i) => i);
	yield {
		type: 'sorted',
		text: 'Finished: Array is fully sorted.',
		sorted: allIndices
	};
}

function* introSortUtil(
	arr: number[],
	begin: number,
	end: number,
	depthLimit: number
): Generator<SortEvent> {
	const size = end - begin + 1;

	// Case 1: If partition size is small, fall back to Insertion Sort.
	// 16 is the standard threshold derived from empirical research.
	if (size < 16) {
		yield {
			type: 'info',
			text: `Subarray size ${size} < 16. Switching to Insertion Sort for indices ${begin} to ${end}.`,
			highlights: {}
		};
		yield* insertionSort(arr, begin, end);
		return;
	}

	// Case 2: If recursion depth exceeds limit, switch to Heap Sort
	// to guarantee O(n log n) worst-case.
	if (depthLimit === 0) {
		yield {
			type: 'info',
			text: `Recursion depth limit reached. Switching to Heap Sort for indices ${begin} to ${end}.`,
			highlights: {}
		};
		yield* heapSort(arr, begin, end);
		return;
	}

	// Case 3: Standard Quick Sort Partitioning with Median-of-Three
	const pivotIndex = yield* medianOfThree(arr, begin, begin + Math.floor(size / 2), end);

	// Move pivot to the end for partitioning
	const pivotValue = arr[pivotIndex];
	const endValue = arr[end];

	yield {
		type: 'swap',
		text: `Moving chosen pivot ${pivotValue} to the end (index ${end}).`,
		highlights: {
			[pivotIndex]: 'bg-purple-500', // Chosen pivot
			[end]: 'bg-vis-swap'
		},
		writes: {
			[pivotIndex]: endValue,
			[end]: pivotValue
		}
	};
	[arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];

	// Partition the array
	const partitionPoint = yield* partition(arr, begin, end);

	// Recurse
	yield* introSortUtil(arr, begin, partitionPoint - 1, depthLimit - 1);
	yield* introSortUtil(arr, partitionPoint + 1, end, depthLimit - 1);
}

/**
 * Standard Insertion Sort restricted to a specific range.
 */
function* insertionSort(arr: number[], left: number, right: number): Generator<SortEvent> {
	// Mark first element as sorted relative to the range
	yield {
		type: 'sorted',
		text: `Insertion Sort: Element at ${left} is essentially sorted.`,
		sorted: [left]
	};

	for (let i = left + 1; i <= right; i++) {
		const key = arr[i];
		let j = i - 1;

		// Visualize selection of key
		yield {
			type: 'compare',
			text: `Insertion Sort: Selected ${key} as key to insert.`,
			highlights: {
				[i]: 'bg-purple-500' // Key
			}
		};

		while (j >= left && arr[j] > key) {
			yield {
				type: 'compare',
				text: `Checking: ${arr[j]} > ${key}? Yes.`,
				highlights: {
					[j]: 'bg-vis-compare',
					[j + 1]: 'bg-purple-500' // Key position
				}
			};

			arr[j + 1] = arr[j];
			yield {
				type: 'write',
				text: `Shifting ${arr[j]} to the right.`,
				highlights: {
					[j + 1]: 'bg-vis-write',
					[j]: 'bg-vis-write'
				},
				writes: {
					[j + 1]: arr[j + 1]
				}
			};

			j--;
		}
		arr[j + 1] = key;
		yield {
			type: 'write',
			text: `Inserted key ${key} at index ${j + 1}.`,
			highlights: {
				[j + 1]: 'bg-vis-sorted'
			},
			writes: {
				[j + 1]: key
			}
		};

		// Mark processed range as sorted
		const sortedRange = [];
		for (let k = left; k <= i; k++) sortedRange.push(k);
		yield {
			type: 'sorted',
			text: `Range [${left}, ${i}] sorted.`,
			sorted: sortedRange
		};
	}
}

/**
 * Heap Sort restricted to a specific range.
 * Treats arr[low...high] as a standalone array for heap operations.
 */
function* heapSort(arr: number[], low: number, high: number): Generator<SortEvent> {
	const n = high - low + 1;

	// Build Max Heap
	yield {
		type: 'info',
		text: 'Building Max Heap for current range.',
		highlights: {}
	};
	for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
		yield* heapify(arr, n, i, low);
	}

	// Extract elements
	for (let i = n - 1; i > 0; i--) {
		// Swap root (max) with end of current heap
		const maxVal = arr[low];
		const endVal = arr[low + i];

		yield {
			type: 'swap',
			text: `Heap Sort: Extracting max ${maxVal}, moving to index ${low + i}.`,
			highlights: {
				[low]: 'bg-purple-500', // Root
				[low + i]: 'bg-vis-swap'
			},
			writes: {
				[low]: endVal,
				[low + i]: maxVal
			}
		};
		[arr[low], arr[low + i]] = [arr[low + i], arr[low]];

		// Mark the extracted element as sorted
		yield {
			type: 'sorted',
			text: `Locked ${maxVal} in sorted position.`,
			sorted: [low + i]
		};

		// Restore heap property
		yield* heapify(arr, i, 0, low);
	}

	yield {
		type: 'sorted',
		text: 'Heap Sort segment complete.',
		sorted: [low]
	};
}

/**
 * Heapify helper that accounts for a 'low' offset.
 * @param arr The array
 * @param n Size of the heap
 * @param i Index to heapify (relative to low)
 * @param low Absolute start index of the sub-array
 */
function* heapify(arr: number[], n: number, i: number, low: number): Generator<SortEvent> {
	let largest = i;
	const l = 2 * i + 1;
	const r = 2 * i + 2;

	// Absolute indices
	const absI = low + i;
	const absL = low + l;
	const absR = low + r;
	const getAbsLargest = () => low + largest;

	// Compare left child
	if (l < n) {
		yield {
			type: 'compare',
			text: `Heapify: Check left child ${arr[absL]} > parent ${arr[getAbsLargest()]}.`,
			highlights: {
				[absL]: 'bg-vis-compare',
				[getAbsLargest()]: 'bg-blue-600'
			}
		};
		if (arr[low + l] > arr[low + largest]) {
			largest = l;
		}
	}

	// Compare right child
	if (r < n) {
		yield {
			type: 'compare',
			text: `Heapify: Check right child ${arr[absR]} > current largest ${arr[getAbsLargest()]}.`,
			highlights: {
				[absR]: 'bg-vis-compare',
				[getAbsLargest()]: 'bg-blue-600'
			}
		};
		if (arr[low + r] > arr[low + largest]) {
			largest = r;
		}
	}

	if (largest !== i) {
		const absLargest = low + largest;
		const valI = arr[absI];
		const valLargest = arr[absLargest];

		yield {
			type: 'swap',
			text: `Heapify: Swapping parent ${valI} with larger child ${valLargest}.`,
			highlights: {
				[absI]: 'bg-vis-swap',
				[absLargest]: 'bg-vis-swap'
			},
			writes: {
				[absI]: valLargest,
				[absLargest]: valI
			}
		};
		[arr[absI], arr[absLargest]] = [arr[absLargest], arr[absI]];

		yield* heapify(arr, n, largest, low);
	}
}

/**
 * Finds the index of the Median of Three (a, b, d) without modifying the array.
 */
function* medianOfThree(
	arr: number[],
	a: number,
	b: number,
	d: number
): Generator<SortEvent, number> {
	const A = arr[a];
	const B = arr[b];
	const C = arr[d];

	// Yield comparisons for visualization
	yield {
		type: 'compare',
		text: `Median of Three: Candidates at ${a}(${A}), ${b}(${B}), ${d}(${C}).`,
		highlights: {
			[a]: 'bg-vis-compare',
			[b]: 'bg-vis-compare',
			[d]: 'bg-vis-compare'
		}
	};

	if ((A <= B && B <= C) || (C <= B && B <= A)) return b;
	if ((B <= A && A <= C) || (C <= A && A <= B)) return a;
	if ((B <= C && C <= A) || (A <= C && C <= B)) return d;

	return b; // Fallback
}

/**
 * Standard Lomuto partition scheme.
 * Assumes pivot is already placed at arr[high].
 */
function* partition(arr: number[], low: number, high: number): Generator<SortEvent, number> {
	const pivot = arr[high];
	let i = low - 1;

	yield {
		type: 'pivot-select',
		text: `Partitioning range [${low}, ${high}]. Pivot is ${pivot}.`,
		highlights: {
			[high]: 'bg-purple-500' // Pivot
		}
	};

	for (let j = low; j < high; j++) {
		const highlights: Record<number, string> = {
			[j]: 'bg-vis-compare', // Scanner
			[high]: 'bg-purple-500' // Pivot
		};
		if (i >= low) highlights[i] = 'bg-blue-600'; // Wall

		yield {
			type: 'compare',
			text: `Is ${arr[j]} <= pivot ${pivot}?`,
			highlights
		};

		if (arr[j] <= pivot) {
			i++;
			yield {
				type: 'swap',
				text: `Swapping ${arr[j]} with ${arr[i]} to move it behind the wall.`,
				highlights: {
					[i]: 'bg-vis-swap',
					[j]: 'bg-vis-swap',
					[high]: 'bg-purple-500'
				},
				writes: {
					[i]: arr[j],
					[j]: arr[i]
				}
			};
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
	}

	const finalPivotIndex = i + 1;
	yield {
		type: 'swap',
		text: `Placing pivot ${pivot} into its sorted position at ${finalPivotIndex}.`,
		highlights: {
			[finalPivotIndex]: 'bg-vis-swap',
			[high]: 'bg-vis-swap'
		},
		writes: {
			[finalPivotIndex]: arr[high],
			[high]: arr[finalPivotIndex]
		}
	};
	[arr[finalPivotIndex], arr[high]] = [arr[high], arr[finalPivotIndex]];

	yield {
		type: 'sorted',
		text: `Pivot ${pivot} is now sorted.`,
		sorted: [finalPivotIndex]
	};

	return finalPivotIndex;
}
