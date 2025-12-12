<script lang="ts">
	import { algorithms, getAlgorithm } from '$lib/algorithms';
	import { VisualizerEngine } from '$lib/stores/visualizer.svelte';
	import VisualizerDisplay from '$lib/components/visualizer/VisualizerDisplay.svelte';
	import TextWithLatex from '$lib/components/TextWithLatex.svelte';
	import { onMount } from 'svelte';
	import { TriangleAlert, Pause, Play, RotateCcw, Shuffle } from 'lucide-svelte';

	// Independent engines for comparison
	const engineA = new VisualizerEngine(40);
	const engineB = new VisualizerEngine(40);

	let algoIdA = $state(algorithms[0].id);
	let algoIdB = $state(algorithms[1].id);

	// Derived state for info blocks
	let infoA = $derived(getAlgorithm(algoIdA));
	let infoB = $derived(getAlgorithm(algoIdB));

	let sharedSize = $state(40);
	let sharedSpeed = $state(5);

	let isRunning = $derived(engineA.isPlaying || engineB.isPlaying);
	let isFinished = $derived(
		engineA.totalOperations > 0 &&
			engineA.operationIndex >= engineA.totalOperations &&
			engineB.totalOperations > 0 &&
			engineB.operationIndex >= engineB.totalOperations
	);

	function generateSharedArray() {
		const newArray = Array.from({ length: sharedSize }, () => Math.floor(Math.random() * 95) + 5);
		engineA.setArray(newArray);
		engineB.setArray(newArray);
	}

	function handleSpeedChange() {
		engineA.speed = sharedSpeed;
		engineB.speed = sharedSpeed;
	}

	/**
	 * When changing an algorithm, perform a full reset on both engines.
	 * This clears the trace and stats, while preserving the initialArray.
	 */
	function handleAlgorithmChange() {
		engineA.reset();
		engineB.reset();
	}

	function startRace() {
		handleSpeedChange();
		engineA.runAlgorithm(algoIdA);
		engineB.runAlgorithm(algoIdB);
	}

	function pauseRace() {
		engineA.pause();
		engineB.pause();
	}

	function resetRace() {
		engineA.resetPlayback();
		engineB.resetPlayback();
	}

	// Warning Logic for Compare Mode
	let activeWarning = $derived.by(() => {
		const warnA = infoA?.warningThreshold && sharedSize > infoA.warningThreshold;
		const warnB = infoB?.warningThreshold && sharedSize > infoB.warningThreshold;

		if (warnA || warnB) {
			const names = [];
			if (warnA) names.push(infoA?.name);
			if (warnB) names.push(infoB?.name);
			return `High Latency Warning: ${names.join(' and ')} ${names.length > 1 ? 'are' : 'is'} not designed for ${sharedSize} elements. Expect significant delays.`;
		}
		return null;
	});

	onMount(() => {
		generateSharedArray();
	});
</script>

<div class="flex flex-col gap-8">
	<div
		class="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left"
	>
		<div>
			<h1 class="text-3xl font-bold">Algorithm Comparison</h1>
			<p class="text-surface-800 mt-2">
				Compare algorithmic efficiency and operation counts side-by-side.
			</p>
		</div>

		<!-- Playback Controls -->
		<div class="flex items-center gap-3">
			{#if !isRunning && !isFinished}
				<button
					onclick={startRace}
					class="bg-primary hover:bg-primary-dark flex items-center justify-center gap-2 rounded-md px-6 py-2.5 font-medium text-white shadow-sm transition-all active:scale-95"
				>
					<Play size={18} />
					Start Race
				</button>
			{:else if isRunning}
				<button
					onclick={pauseRace}
					class="bg-vis-compare text-white hover:brightness-90 flex items-center justify-center gap-2 rounded-md px-6 py-2.5 font-medium shadow-sm transition-all active:scale-95"
				>
					<Pause size={18} />
					Pause
				</button>
			{:else}
				<button
					onclick={resetRace}
					class="bg-surface-200 text-surface-900 hover:bg-surface-300 flex items-center justify-center gap-2 rounded-md px-6 py-2.5 font-medium shadow-sm transition-all active:scale-95"
				>
					<RotateCcw size={16} />
					Reset
				</button>
			{/if}
			<button
				onclick={generateSharedArray}
				disabled={isRunning}
				class="bg-surface-200 hover:bg-surface-300 text-surface-900 flex items-center justify-center gap-2 rounded-md px-4 py-2.5 font-medium transition-colors disabled:opacity-50"
			>
				<Shuffle size={16} />
				Shuffle
			</button>
		</div>
	</div>

	{#if activeWarning}
		<div
			class="flex items-center gap-3 rounded-md border border-yellow-200 bg-yellow-50 p-4 text-yellow-800"
		>
			<TriangleAlert class="h-5 w-5 shrink-0 text-yellow-600" />
			<span class="text-sm font-medium">{activeWarning}</span>
		</div>
	{/if}

	<!-- Configuration Row -->
	<div class="bg-surface-50 border-surface-200 grid gap-6 rounded-xl border p-4 sm:grid-cols-2">
		<div class="flex flex-col gap-2">
			<label for="race-size" class="text-sm font-medium">Dataset Size: {sharedSize}</label>
			<input
				id="race-size"
				type="range"
				min="1"
				max="150"
				bind:value={sharedSize}
				oninput={generateSharedArray}
				disabled={isRunning}
				class="accent-primary cursor-pointer disabled:opacity-50"
			/>
		</div>
		<div class="flex flex-col gap-2">
			<label for="race-speed" class="text-sm font-medium">Simulation Speed: {sharedSpeed}x</label>
			<input
				id="race-speed"
				type="range"
				min="1"
				max="10"
				bind:value={sharedSpeed}
				oninput={handleSpeedChange}
				class="accent-primary cursor-pointer"
			/>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<!-- Left Competitor -->
		<div
			class="bg-surface-50 border-surface-200 flex h-96 flex-col rounded-xl border p-4 shadow-sm"
		>
			<div class="mb-4 flex items-center justify-between border-b pb-2">
				<span class="font-bold text-primary">Competitor A</span>
				<select
					bind:value={algoIdA}
					onchange={handleAlgorithmChange}
					disabled={isRunning}
					class="border-surface-200 bg-surface-50 focus:border-primary focus:ring-primary/20 rounded-md border p-2 text-sm transition-shadow focus:ring-2 focus:outline-none disabled:opacity-50"
				>
					{#each algorithms as algo (algo.id)}
						<option value={algo.id} disabled={algo.id === algoIdB}>{algo.name}</option>
					{/each}
				</select>
			</div>
			<div class="bg-surface-100 relative flex-1 overflow-hidden rounded-md p-4 shadow-inner">
				<VisualizerDisplay engine={engineA} />
			</div>
		</div>

		<!-- Right Competitor -->
		<div
			class="bg-surface-50 border-surface-200 flex h-96 flex-col rounded-xl border p-4 shadow-sm"
		>
			<div class="mb-4 flex items-center justify-between border-b pb-2">
				<span class="font-bold text-primary">Competitor B</span>
				<select
					bind:value={algoIdB}
					onchange={handleAlgorithmChange}
					disabled={isRunning}
					class="border-surface-200 bg-surface-50 focus:border-primary focus:ring-primary/20 rounded-md border p-2 text-sm transition-shadow focus:ring-2 focus:outline-none disabled:opacity-50"
				>
					{#each algorithms as algo (algo.id)}
						<option value={algo.id} disabled={algo.id === algoIdA}>{algo.name}</option>
					{/each}
				</select>
			</div>
			<div class="bg-surface-100 relative flex-1 overflow-hidden rounded-md p-4 shadow-inner">
				<VisualizerDisplay engine={engineB} />
			</div>
		</div>
	</div>

	<div class="bg-surface-50 border-surface-200 mx-auto w-full max-w-4xl rounded-xl border p-6">
		<h3 class="mb-4 font-bold">Live Statistics</h3>
		<div class="grid grid-cols-3 gap-4 text-center text-sm">
			<div class="text-gray-500 font-medium text-left">Metric</div>
			<div class="font-bold text-primary">{getAlgorithm(algoIdA)?.name}</div>
			<div class="font-bold text-accent">{getAlgorithm(algoIdB)?.name}</div>

			<div class="border-t pt-2 text-left">Total Operations</div>
			<div class="border-t pt-2 font-mono">
				{engineA.totalOperations > 0 ? engineA.totalOperations : '-'}
			</div>
			<div class="border-t pt-2 font-mono">
				{engineB.totalOperations > 0 ? engineB.totalOperations : '-'}
			</div>

			<div class="border-t pt-2 text-left">Current Step</div>
			<div class="border-t pt-2 font-mono">{engineA.operationIndex}</div>
			<div class="border-t pt-2 font-mono">{engineB.operationIndex}</div>

			<div class="border-t pt-2 text-left">Progress</div>
			<div class="border-t pt-2 font-mono">
				{engineA.totalOperations > 0
					? Math.round((engineA.operationIndex / engineA.totalOperations) * 100)
					: 0}%
			</div>
			<div class="border-t pt-2 font-mono">
				{engineB.totalOperations > 0
					? Math.round((engineB.operationIndex / engineB.totalOperations) * 100)
					: 0}%
			</div>
		</div>
	</div>

	<!-- Comparison Details Section -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<!-- Algorithm A Info -->
		{#if infoA}
			<div class="bg-surface-50 border-surface-200 rounded-xl border p-6">
				<h3 class="text-surface-900 mb-3 border-b pb-2 text-lg font-bold">{infoA.name}</h3>
				<p class="text-surface-800 mb-6 text-sm leading-relaxed">
					<TextWithLatex text={infoA.details.summary} />
				</p>
				<h4 class="text-surface-900 mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">
					Steps
				</h4>
				<ul class="space-y-3 text-sm">
					{#each infoA.details.steps as step, i (i)}
						<li class="flex gap-3">
							<div class="bg-primary/40 mt-1.5 h-2 w-2 shrink-0 rounded-full"></div>
							<div class="text-surface-700">
								<TextWithLatex text={step} />
							</div>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Algorithm B Info -->
		{#if infoB}
			<div class="bg-surface-50 border-surface-200 rounded-xl border p-6">
				<h3 class="text-surface-900 mb-3 border-b pb-2 text-lg font-bold">{infoB.name}</h3>
				<p class="text-surface-800 mb-6 text-sm leading-relaxed">
					<TextWithLatex text={infoB.details.summary} />
				</p>
				<h4 class="text-surface-900 mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">
					Steps
				</h4>
				<ul class="space-y-3 text-sm">
					{#each infoB.details.steps as step, i (i)}
						<li class="flex gap-3">
							<div class="bg-accent/40 mt-1.5 h-2 w-2 shrink-0 rounded-full"></div>
							<div class="text-surface-700">
								<TextWithLatex text={step} />
							</div>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
</div>
