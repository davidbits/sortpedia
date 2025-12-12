import type { SortEvent, SortWorkerRequest, SortWorkerResponse } from '$lib/algorithms/types';

self.onmessage = async (e: MessageEvent<SortWorkerRequest>) => {
	const { algorithm, array } = e.data;

	try {
		// Dynamically import the specific algorithm's logic module.
		const algoModule = await import(`../algorithms/${algorithm}/index.ts`);
		const sortFn = algoModule.default as (arr: number[]) => Generator<SortEvent>;

		// Create a working copy of the array
		const workingArray = [...array];
		const generator = sortFn(workingArray);
		const trace: SortEvent[] = [];

		// Run generator to completion and record every event
		for (const event of generator) {
			trace.push(event);
		}

		const response: SortWorkerResponse = {
			trace,
			sortedArray: workingArray
		};

		self.postMessage(response);
	} catch (error) {
		console.error(`Failed to load or run algorithm '${algorithm}':`, error);
		// Optionally, post an error message back to the main thread
		// self.postMessage({ error: `Algorithm ${algorithm} failed.` });
	}
};

export {};
