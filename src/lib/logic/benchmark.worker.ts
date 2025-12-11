interface BenchmarkRequest {
	id: string; // Algorithm ID
	arraySize: number;
	runs: number;
}

interface BenchmarkResult {
	id: string;
	averageTime: number;
	error?: string;
}

self.onmessage = async (e: MessageEvent<BenchmarkRequest>) => {
	const { id, arraySize, runs } = e.data;

	try {
		// Dynamically import the perf.ts file for the requested algorithm
		const algoModule = await import(`../algorithms/${id}/perf.ts`);
		const sortFn = algoModule.default as (arr: number[]) => number[];

		let totalTime = 0;

		// Perform multiple runs to average out JIT warmup and GC pauses
		for (let i = 0; i < runs; i++) {
			// Generate integers for all algorithms
			const arr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 10000));

			const start = performance.now();
			sortFn(arr);
			const end = performance.now();

			totalTime += end - start;
		}

		const result: BenchmarkResult = {
			id,
			averageTime: totalTime / runs
		};

		self.postMessage(result);
	} catch (error) {
		console.error(`Benchmark failed for ${id}:`, error);
		self.postMessage({ id, averageTime: 0, error: 'Failed to run' } as BenchmarkResult);
	}
};

export {};
