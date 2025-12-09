import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'intro-sort',
	name: 'Intro Sort',
	category: 'Hybrid',
	complexity: {
		best: 'O(n \\log n)',
		average: 'O(n \\log n)',
		worst: 'O(n \\log n)',
		space: 'O(\\log n)'
	},
	stable: false, // Inherits instability from Quick Sort and Heap Sort
	inPlace: true,
	adaptive: false, // While insertion sort is adaptive, the overall algorithm is generally considered not adaptive due to Quick/Heap sort dominance
	description:
		'A hybrid sorting algorithm that provides both fast average performance and optimal worst-case performance by combining Quick Sort, Heap Sort, and Insertion Sort.',
	details: {
		summary:
			'Introsort (Introspective Sort) begins with **Quick Sort** and monitors the recursion depth. If the depth exceeds a specific limit (usually $2 \\log n$), it switches to **Heap Sort** to guarantee $O(n \\log n)$ worst-case performance. For small sub-arrays (typically fewer than 16 elements), it switches to **Insertion Sort**, which is more efficient for small datasets due to better memory locality and lower overhead.',
		steps: [
			'**1. Check Size:** For the current sub-array, check the number of elements. If the size is less than 16, switch to **Insertion Sort**.',
			'**2. Check Depth:** Check the recursion depth limit. If the limit reaches zero, switch to **Heap Sort** to sort the current sub-array.',
			'**3. Partition (Quick Sort):** If neither condition above is met, proceed with Quick Sort steps. Select a pivot using the **Median-of-Three** strategy (median of first, middle, and last elements).',
			'**4. Recurse:** Partition the array around the pivot and recursively apply Introsort to the left and right sub-arrays, decrementing the depth limit by one.'
		],
		advantages: [
			'**Best of Both Worlds:** Combines the fast average performance of Quick Sort with the guaranteed worst-case performance of Heap Sort.',
			'**Low Overhead:** Uses Insertion Sort for small arrays, which has a lower constant factor and better cache locality than recursive calls.',
			'**Standard Industry Choice:** It is the algorithm of choice for `std::sort` in C++, `Array.Sort` in .NET, and many other standard library implementations.'
		],
		disadvantages: [
			'**Unstable:** Like Quick Sort and Heap Sort, it does not preserve the relative order of equal elements.',
			'**Not Adaptive:** Unlike TimSort (used in Python/Java), it does not take advantage of existing runs of sorted data in the input.'
		],
		javascript: `// Main entry function for Introsort
function introSort(arr) {
  const maxDepth = Math.floor(Math.log2(arr.length)) * 2;
  introSortHelper(arr, 0, arr.length - 1, maxDepth);
  return arr;
}

// The core recursive function with hybrid logic
function introSortHelper(arr, begin, end, depthLimit) {
  const size = end - begin + 1;

  if (size <= 1) return;

  // 1. If partition size is small, switch to Insertion Sort
  if (size < 16) {
    insertionSort(arr, begin, end);
    return;
  }

  // 2. If depth limit is reached, switch to Heap Sort
  if (depthLimit === 0) {
    heapSort(arr, begin, end);
    return;
  }

  // 3. Otherwise, use Quick Sort
  const pIndex = medianOfThree(arr, begin, begin + Math.floor(size / 2), end);
  [arr[pIndex], arr[end]] = [arr[end], arr[pIndex]]; // Move pivot to end

  const partitionPoint = partition(arr, begin, end);
  
  introSortHelper(arr, begin, partitionPoint - 1, depthLimit - 1);
  introSortHelper(arr, partitionPoint + 1, end, depthLimit - 1);
}

// --- Quick Sort Helpers ---

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

function medianOfThree(arr, a, b, d) {
  const A = arr[a], B = arr[b], C = arr[d];
  if ((A <= B && B <= C) || (C <= B && B <= A)) return b;
  if ((B <= A && A <= C) || (C <= A && A <= B)) return a;
  if ((B <= C && C <= A) || (A <= C && C <= B)) return d;
  
  // Fallback (should not reach here)
  return b;
}

// --- Insertion Sort Helper (for small partitions) ---

function insertionSort(arr, left, right) {
  for (let i = left + 1; i <= right; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= left && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}

// --- Heap Sort Helpers (for worst-case partitions) ---

function heapSort(arr, low, high) {
  const n = high - low + 1;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i, low);
  }

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [arr[low], arr[low + i]] = [arr[low + i], arr[low]];
    heapify(arr, i, 0, low);
  }
}

function heapify(arr, n, i, offset) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[offset + left] > arr[offset + largest]) {
    largest = left;
  }
  if (right < n && arr[offset + right] > arr[offset + largest]) {
    largest = right;
  }

  if (largest !== i) {
    [arr[offset + i], arr[offset + largest]] = [arr[offset + largest], arr[offset + i]];
    heapify(arr, n, largest, offset);
  }
}`,
		funFacts: [
			'Intro Sort was invented by **David Musser** in 1997 specifically to provide a generic sorting algorithm for the C++ Standard Template Library (STL).',
			'Before Intro Sort, libraries often used Quick Sort, which could be exploited by "killer sequences" (like median-of-3 killers) to degrade performance to $O(n^2)$.',
			'The "Introspective" name comes from the algorithm\'s ability to inspect its own progress (recursion depth) and switch strategies accordingly.'
		]
	}
};
