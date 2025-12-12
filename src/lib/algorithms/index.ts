import type { AlgorithmInfo } from './types';

// Define the expected shape of the modules we are importing.
// Each module should have a named export 'data' of type AlgorithmInfo.
type AlgorithmModule = {
	data: AlgorithmInfo;
};

// Use Vite's glob import to get all data.ts modules.
const modules = import.meta.glob<AlgorithmModule>('./*/data.ts', { eager: true });

// Detect which algorithms have a perf.ts implementation
const perfModules = import.meta.glob('./*/perf.ts');
const benchmarkableIds = new Set(Object.keys(perfModules).map((path) => path.split('/')[1]));

// Extract the 'data' export from each module and build the array.
export const algorithms: AlgorithmInfo[] = Object.values(modules).map((module) => module.data);

export const benchmarkAlgorithms = algorithms.filter((algo) => benchmarkableIds.has(algo.id));

// Re-create the helper function for easy lookups.
export const getAlgorithm = (id: string) => algorithms.find((a) => a.id === id);

export const categoryExplanations = {
	Exchange:
		'Sorts by repeatedly swapping adjacent elements to move them to their correct positions.',
	Selection: 'Sorts by repeatedly finding the minimum element and placing it at the beginning.',
	Insertion: 'Sorts by building a final sorted array one item at a time, inserting it into place.',
	'Brute Force': 'Sorts by generating and testing possibilities until a solution is found.',
	'Divide and Conquer':
		'Recursively breaks the problem into smaller sub-problems, solves them, and combines the results.',
	Probabilistic: 'Uses random choices to reduce the probability of worst-case performance.',
	Hybrid:
		'Combines two or more algorithms to leverage their specific strengths for different data sizes.',
	Tree: 'Constructs a tree data structure to organize elements, then traverses it to produce a sorted sequence.',
	Heap: 'Uses a heap data structure to efficiently find and extract elements in sorted order.',
	Counting: 'Counts occurrences of each distinct element and reconstructs the sorted array.',
	Bucket:
		'Distributes elements into several buckets, sorts each bucket individually, and then concatenates them.',
	Radix: 'Sorts by processing individual digits or characters from least to most significant.',
	Pigeonhole: 'Places each element directly into its designated position based on its value',
	External: "Designed for sorting data that doesn't fit in memory, using disk or external storage",
	Parallel: 'Divides the sorting task across multiple processors to improve speed.',
	'Cache-Efficient': 'Optimized to minimize cache misses and improve memory access patterns.',
	Online: 'Can sort a list as it receives it, without needing to know the entire list in advance.',
	Esoteric:
		'Algorithms that are more conceptual, humorous, or illustrative of a theoretical point than for practical use.'
};

export const adaptiveExplanation =
	'Performance improves significantly on data that is already partially sorted.';
export const inPlaceExplanation =
	'Requires a constant amount of extra memory space (O(1)), regardless of input size.';
export const stableExplanation = 'Preserves the relative order of elements with equal values.';
export const unstableExplanation =
	'Does not guarantee the relative order of elements with equal values.';
