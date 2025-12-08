<script lang="ts">
	import { algorithms, getAlgorithm } from '$lib/algorithms';
	import { VisualizerEngine } from '$lib/stores/visualizer.svelte';
	import VisualizerDisplay from '$lib/components/visualizer/VisualizerDisplay.svelte';
	import { onMount } from 'svelte';
	import { Play, Pause, RotateCcw, Shuffle } from 'lucide-svelte';

	// Independent engines for comparison
	const engineA = new VisualizerEngine(40);
	const engineB = new VisualizerEngine(40);

	let algoIdA = $state(algorithms[0].id);
	let algoIdB = $state(algorithms[1].id);
	let sharedSize = $state(40);
	let sharedSpeed = $state(5);

	let isRunning = $derived(engineA.isPlaying || engineB.isPlaying);
	let isFinished = $derived(
		engineA.trace.length > 0 &&
			engineA.stepIndex >= engineA.trace.length &&
			engineB.trace.length > 0 &&
			engineB.stepIndex >= engineB.trace.length
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

	onMount(() => {
		generateSharedArray();
	});
</script>

<div class="flex flex-col gap-8">
	<div
		class="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left"
	>
		<div>
			<h1 class="text-3xl font-bold">Algorithm Race</h1>
			<p class="text-surface-800 mt-2">Compare performance side-by-side on identical datasets</p>
		</div>

		<!-- Improved Playback Controls -->
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

	<!-- Configuration Row -->
	<div class="bg-surface-50 border-surface-200 grid gap-6 rounded-xl border p-4 sm:grid-cols-2">
		<div class="flex flex-col gap-2">
			<label for="race-size" class="text-sm font-medium">Dataset Size: {sharedSize}</label>
			<input
				id="race-size"
				type="range"
				min="10"
				max="100"
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
				{engineA.trace.length > 0 ? engineA.trace.length : '-'}
			</div>
			<div class="border-t pt-2 font-mono">
				{engineB.trace.length > 0 ? engineB.trace.length : '-'}
			</div>

			<div class="border-t pt-2 text-left">Current Step</div>
			<div class="border-t pt-2 font-mono">{engineA.stepIndex}</div>
			<div class="border-t pt-2 font-mono">{engineB.stepIndex}</div>

			<div class="border-t pt-2 text-left">Progress</div>
			<div class="border-t pt-2 font-mono">
				{engineA.trace.length > 0
					? Math.round((engineA.stepIndex / engineA.trace.length) * 100)
					: 0}%
			</div>
			<div class="border-t pt-2 font-mono">
				{engineB.trace.length > 0
					? Math.round((engineB.stepIndex / engineB.trace.length) * 100)
					: 0}%
			</div>
		</div>
	</div>
</div>
