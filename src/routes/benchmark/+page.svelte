<script lang="ts">
	import { benchmarkAlgorithms } from '$lib/algorithms';
	import { TriangleAlert, Play, RotateCcw, Timer } from 'lucide-svelte';
	import { SvelteSet } from 'svelte/reactivity';

	// Settings
	let arraySize = $state(1000);
	let runs = $state(5);

	const initialSelection = benchmarkAlgorithms.length > 0 ? [benchmarkAlgorithms[0].id] : [];
	let selectedIds = new SvelteSet<string>(initialSelection);

	// State
	let isRunning = $state(false);
	let results = $state<Record<string, number | null>>({});
	let progress = $state(0);

	let worker: Worker | undefined;

	// SvelteSet allows direct mutation while maintaining reactivity
	function toggleSelection(id: string) {
		if (selectedIds.has(id)) {
			selectedIds.delete(id);
		} else {
			selectedIds.add(id);
		}
	}

	async function runBenchmark() {
		if (selectedIds.size === 0) return;

		isRunning = true;
		results = {};
		progress = 0;

		// Initialize worker if needed
		if (!worker) {
			const WorkerModule = await import('$lib/logic/benchmark.worker?worker');
			worker = new WorkerModule.default();

			worker.onmessage = (e) => {
				const { id, averageTime } = e.data;
				results[id] = averageTime;
				progress++;

				// Check if finished
				if (progress >= selectedIds.size) {
					isRunning = false;
				}
			};
		}

		// Queue jobs
		for (const id of selectedIds) {
			results[id] = null; // Mark as pending
			worker.postMessage({
				id,
				arraySize,
				runs
			});
		}
	}

	function reset() {
		results = {};
		progress = 0;
		isRunning = false;
	}

	// Calculate chart scaling
	let maxTime = $derived(
		Math.max(...Object.values(results).filter((v): v is number => typeof v === 'number'), 0)
	);

	// Warning for slow algorithms in benchmark mode
	let warningMessage = $derived.by(() => {
		const dangerAlgos = [...selectedIds]
			.map((id) => benchmarkAlgorithms.find((a) => a.id === id))
			.filter((a) => a && a.warningThreshold && arraySize > a.warningThreshold);

		if (dangerAlgos.length > 0) {
			const names = dangerAlgos.map((a) => a?.name).join(', ');
			return `Caution: You are benchmarking ${names} with ${arraySize} elements. These algorithms have exponential complexity and may freeze the browser for an extended period.`;
		}
		return null;
	});
</script>

<div class="flex flex-col gap-8 pb-12">
	<div class="text-center md:text-left">
		<h1 class="text-3xl font-bold">Performance Benchmark</h1>
		<p class="text-surface-800 mt-2">Measure raw execution speed of algorithms.</p>
	</div>

	<!-- Configuration Panel -->
	<div class="bg-surface-50 border-surface-200 grid gap-8 rounded-xl border p-6 md:grid-cols-3">
		<!-- Algorithm Selection -->
		<div class="md:col-span-1">
			<h3 class="text-surface-900 mb-4 font-bold">Select Algorithms</h3>
			<div class="max-h-60 flex flex-col gap-2 overflow-y-auto pr-2">
				{#each benchmarkAlgorithms as algo (algo.id)}
					<label
						class="hover:bg-surface-100 flex cursor-pointer items-center gap-3 rounded-md border border-transparent p-2 transition-colors"
					>
						<input
							type="checkbox"
							checked={selectedIds.has(algo.id)}
							onchange={() => toggleSelection(algo.id)}
							disabled={isRunning}
							class="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
						/>
						<span
							class="text-sm font-medium {selectedIds.has(algo.id)
								? 'text-surface-900'
								: 'text-surface-600'}"
						>
							{algo.name}
						</span>
					</label>
				{/each}

				{#if benchmarkAlgorithms.length === 0}
					<div class="text-sm italic text-gray-500 p-2">
						No benchmarkable algorithms found (missing perf.ts).
					</div>
				{/if}
			</div>
		</div>

		<!-- Settings & Actions -->
		<div class="md:col-span-2 flex flex-col gap-6">
			<div class="grid gap-6 sm:grid-cols-2">
				<div class="space-y-3">
					<label for="arr-size" class="text-surface-700 text-sm font-medium">
						Array Size: <span class="text-primary font-mono font-bold"
							>{arraySize.toLocaleString()}</span
						> items
					</label>
					<input
						id="arr-size"
						type="range"
						min="100"
						max="20000"
						step="100"
						bind:value={arraySize}
						disabled={isRunning}
						class="accent-primary w-full"
					/>
					<div class="flex justify-between text-xs text-gray-400">
						<span>100</span>
						<span>20,000</span>
					</div>
				</div>

				<div class="space-y-3">
					<label for="runs" class="text-surface-700 text-sm font-medium">
						Iterations per Algo: <span class="text-primary font-mono font-bold">{runs}</span>
					</label>
					<input
						id="runs"
						type="range"
						min="1"
						max="20"
						bind:value={runs}
						disabled={isRunning}
						class="accent-primary w-full"
					/>
				</div>
			</div>

			{#if warningMessage}
				<div
					class="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"
				>
					<TriangleAlert class="h-5 w-5 shrink-0 text-red-600" />
					<p>{warningMessage}</p>
				</div>
			{/if}

			<div class="mt-auto flex gap-4">
				<button
					onclick={runBenchmark}
					disabled={isRunning || selectedIds.size === 0}
					class="bg-primary hover:bg-primary-dark disabled:bg-surface-200 disabled:text-gray-400 flex flex-1 items-center justify-center gap-2 rounded-lg py-3 font-bold text-white shadow-sm transition-all active:scale-95"
				>
					{#if isRunning}
						<Timer class="animate-spin" size={20} /> Running... ({progress}/{selectedIds.size})
					{:else}
						<Play size={20} /> Run Benchmark
					{/if}
				</button>

				<button
					onclick={reset}
					disabled={isRunning || Object.keys(results).length === 0}
					class="bg-surface-200 hover:bg-surface-300 text-surface-900 disabled:opacity-50 flex items-center justify-center rounded-lg px-6 font-medium transition-colors"
				>
					<RotateCcw size={20} />
				</button>
			</div>
		</div>
	</div>

	<!-- Results Section -->
	{#if Object.keys(results).length > 0}
		<div class="bg-white border-surface-200 rounded-xl border p-6 shadow-sm">
			<h2 class="mb-6 text-xl font-bold">Results (Average Time)</h2>

			<div class="flex flex-col gap-4">
				{#each [...selectedIds] as id (id)}
					{@const time = results[id]}
					{@const algo = benchmarkAlgorithms.find((a) => a.id === id)}

					<div class="flex items-center gap-4">
						<div class="text-surface-700 w-32 shrink-0 text-right text-sm font-bold">
							{algo?.name}
						</div>

						<div
							class="bg-surface-100 relative flex h-8 flex-1 items-center overflow-hidden rounded-md"
						>
							{#if time !== undefined && time !== null}
								<div
									class="bg-primary h-full rounded-r-md transition-all duration-500"
									style="width: {Math.max((time / maxTime) * 100, 1)}%"
								></div>
								<span
									class="absolute left-2 font-mono text-xs font-bold {time / maxTime > 0.1
										? 'text-white'
										: 'text-surface-900'}"
								>
									{time.toFixed(2)} ms
								</span>
							{:else if time === null}
								<div class="bg-surface-200 h-full w-full animate-pulse"></div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
