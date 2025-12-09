export interface AlgorithmInfo {
	id: string;
	name: string;
	group: 'Comparison-Based' | 'Non-Comparison-Based' | 'Specialized';
	category: (// Comparison-Based
	| 'Exchange'
		| 'Selection'
		| 'Insertion'
		| 'Divide and Conquer'
		| 'Hybrid'
		| 'Tree'
		| 'Heap'
		| 'Probabilistic'
		| 'Brute Force'
		// Non-Comparison-Based / Distribution-Based
		| 'Counting'
		| 'Bucket'
		| 'Radix'
		| 'Pigeonhole' // A specific case of bucket counting
		// Specialized / Other
		| 'External'
		| 'Parallel'
		| 'Cache-Efficient'
		| 'Online'
	)[];
	complexity: {
		best: string;
		average: string;
		worst: string;
		space: string;
	};
	stable: boolean;
	adaptive: boolean;
	inPlace: boolean;
	description: string;
	details: {
		summary: string;
		steps: string[];
		advantages: string[];
		disadvantages: string[];
		javascript: string;
		funFacts?: string[];
	};
}

export type SortEventType = 'compare' | 'swap' | 'write' | 'sorted' | 'shuffle';

export interface SortEvent {
	type: SortEventType;
	indices: number[];
	value?: number;
}

export interface SortWorkerRequest {
	algorithm: string;
	array: number[];
}

export interface SortWorkerResponse {
	trace: SortEvent[];
	sortedArray: number[];
}
