import type { AlgorithmInfo } from './types';

// Define the expected shape of the modules we are importing.
// Each module should have a named export 'data' of type AlgorithmInfo.
type AlgorithmModule = {
	data: AlgorithmInfo;
};

// Use Vite's glob import to get all data.ts modules.
// The `eager: true` option imports them synchronously.
const modules = import.meta.glob<AlgorithmModule>('./*/data.ts', { eager: true });

// Extract the 'data' export from each module and build the array.
export const algorithms: AlgorithmInfo[] = Object.values(modules).map((module) => module.data);

// Re-create the helper function for easy lookups.
export const getAlgorithm = (id: string) => algorithms.find((a) => a.id === id);

export const categoryExplanations = {
	Exchange:
		'Sorts by repeatedly swapping adjacent elements to move them to their correct positions.',
	Selection: 'Sorts by repeatedly finding the minimum element and placing it at the beginning.',
	Insertion: 'Sorts by building a final sorted array one item at a time, inserting it into place.',
	Merge: 'Sorts by recursively dividing the list, sorting the halves, and merging them back.',
	Distribution: 'Sorts by distributing elements into buckets based on their values.',
	'Brute Force': 'Sorts by generating and testing possibilities until a solution is found.',
	'Divide and Conquer':
		'Recursively breaks the problem into smaller sub-problems, solves them, and combines the results.',
	Randomized:
		'Uses random choices (like pivot selection) to reduce the probability of worst-case performance.',
	Hybrid:
		'Combines two or more algorithms to leverage their specific strengths for different data sizes.',
	Tree: 'Constructs a tree data structure to organize elements, then traverses it to produce a sorted sequence.',
	Heap: 'Uses a heap data structure to efficiently find and extract elements in sorted order.'
};

export const adaptiveExplanation =
	'Performance improves significantly on data that is already partially sorted.';
export const inPlaceExplanation =
	'Requires a constant amount of extra memory space (O(1)), regardless of input size.';
export const stableExplanation = 'Preserves the relative order of elements with equal values.';
export const unstableExplanation =
	'Does not guarantee the relative order of elements with equal values.';
