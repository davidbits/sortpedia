export interface AlgorithmInfo {
	id: string;
	name: string;
	category:
		| 'Exchange'
		| 'Selection'
		| 'Insertion'
		| 'Merge'
		| 'Distribution'
		| 'Brute Force'
		| 'Divide and Conquer'
		| 'Randomized'
		| 'Hybrid'
		| 'Tree';
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
