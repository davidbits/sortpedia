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
		| 'Esoteric'
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
	warningThreshold?: number;
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

// Stats only, does not control visuals
export type SortEventType = string;

export interface StructuralEvent {
	type: 'add' | 'remove';
	index: number;
	value?: number;
}

export interface SortEvent {
	// The type of operation for statistical counting (e.g., 'compare', 'swap')
	type: SortEventType;

	// Text to display for this specific step
	text: string;

	// Visuals: Map of Index -> CSS Color Class
	// These apply only to the current frame/step
	highlights?: Record<number, string>;

	// Data: Map of Index -> New Value
	// Used for Swaps or Overwrites
	writes?: Record<number, number>;

	// Structural: Array of changes to length/indices
	structural?: StructuralEvent[];

	// State: Indices to mark as sorted
	sorted?: number[];
}

export interface SortWorkerRequest {
	algorithm: string;
	array: number[];
}

export interface SortWorkerResponse {
	trace: SortEvent[];
	sortedArray: number[];
}
