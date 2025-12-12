<script lang="ts">
	import { algorithms, getAlgorithm } from '$lib/algorithms';
	import { visualizer } from '$lib/stores/visualizer.svelte';
	import VisualizerDisplay from '$lib/components/visualizer/VisualizerDisplay.svelte';
	import TextWithLatex from '$lib/components/TextWithLatex.svelte';
	import { onMount } from 'svelte';
	import {
		TriangleAlert,
		ChevronLeft,
		ChevronRight,
		Pause,
		Play,
		RotateCcw,
		Shuffle
	} from 'lucide-svelte';

	// Bind controls to store
	let selectedAlgo = $state(algorithms[0].id);

	// Derived state for descriptions
	let currentAlgo = $derived(getAlgorithm(selectedAlgo));

	// Warning Logic
	let warningMessage = $derived.by(() => {
		if (currentAlgo?.warningThreshold && visualizer.targetSize > currentAlgo.warningThreshold) {
			return `Warning: ${currentAlgo.name} is extremely inefficient. Running with ${visualizer.targetSize} elements may freeze your browser or take a very long time. Recommended limit: ${currentAlgo.warningThreshold}.`;
		}
		return null;
	});

	// Effects to sync inputs with store
	const handleSizeChange = (e: Event) => {
		const size = +(e.target as HTMLInputElement).value;
		visualizer.generateArray(size);
	};

	const handleSort = () => {
		visualizer.runAlgorithm(selectedAlgo);
	};

	onMount(() => {
		// Ensure initial array exists
		if (visualizer.array.length === 0) visualizer.generateArray(50);
	});
</script>

<div class="grid min-h-[600px] grid-cols-1 gap-6 lg:grid-cols-4">
	<!-- Canvas Area -->
	<div
		class="bg-surface-100 border-surface-200 relative flex min-h-[400px] flex-col items-center justify-center overflow-hidden rounded-xl border p-8 shadow-inner lg:col-span-3"
	>
		<!-- Step Description Label -->
		<div
			class="bg-surface-50/90 text-surface-900 absolute top-4 left-1/2 z-10 -translate-x-1/2 rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium shadow-sm backdrop-blur-sm transition-all"
		>
			{visualizer.currentStepLabel}
		</div>

		{#if warningMessage}
			<div
				class="absolute top-16 left-1/2 z-20 flex w-11/12 max-w-lg -translate-x-1/2 items-start gap-3 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800 shadow-sm"
			>
				<TriangleAlert class="h-5 w-5 shrink-0 text-yellow-600" />
				<p>{warningMessage}</p>
			</div>
		{/if}

		<VisualizerDisplay engine={visualizer} />
	</div>

	<!-- Controls Panel -->
	<div class="bg-surface-50 border-surface-200 flex flex-col gap-6 rounded-xl border p-6 shadow-sm">
		<!-- Statistics Dashboard -->
		<div class="bg-white rounded-lg border border-surface-200 p-4 shadow-sm">
			<h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Statistics</h3>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<span class="text-xs text-gray-500 block">Status</span>
					<span
						class="font-mono text-sm font-bold {visualizer.isPlaying
							? 'text-primary'
							: 'text-gray-700'}"
					>
						{visualizer.isPlaying ? 'Running' : 'Idle'}
					</span>
				</div>
				<div>
					<span class="text-xs text-gray-500 block">Operations</span>
					<span class="font-mono text-sm font-bold text-gray-900">
						{visualizer.operationIndex}
						<span class="text-gray-400 font-normal">/ {visualizer.totalOperations}</span>
					</span>
				</div>
			</div>

			<!-- Progress Bar -->
			<div class="mt-3 h-1.5 w-full bg-surface-100 rounded-full overflow-hidden">
				<div
					class="h-full bg-primary transition-all duration-200"
					style="width: {visualizer.totalOperations > 0
						? (visualizer.operationIndex / visualizer.totalOperations) * 100
						: 0}%"
				></div>
			</div>
		</div>

		<h2 class="text-xl font-bold">Controls</h2>

		<div class="flex flex-col gap-2">
			<label for="algo-select" class="text-sm font-medium">Algorithm</label>
			<select
				id="algo-select"
				bind:value={selectedAlgo}
				onchange={() => visualizer.reset()}
				class="border-surface-200 bg-surface-50 focus:border-primary focus:ring-primary/20 rounded-md border p-2 transition-shadow focus:ring-2 focus:outline-none"
			>
				{#each algorithms as algo (algo.id)}
					<option value={algo.id}>{algo.name}</option>
				{/each}
			</select>
		</div>

		<div class="flex flex-col gap-3">
			<div class="flex justify-between">
				<label for="size" class="text-sm font-medium">Array Size</label>
				<span class="text-xs font-mono text-gray-500">
					{#if visualizer.array.length !== visualizer.targetSize}
						<span class="text-red-500 font-bold">{visualizer.array.length}</span>
						<span class="mx-1">/</span>
					{/if}
					{visualizer.targetSize}
				</span>
			</div>
			<input
				id="size"
				type="range"
				min="1"
				max="200"
				value={visualizer.targetSize}
				oninput={handleSizeChange}
				disabled={visualizer.isPlaying}
				class="accent-primary cursor-pointer disabled:opacity-50"
			/>
		</div>

		<div class="flex flex-col gap-3">
			<div class="flex justify-between">
				<label for="speed" class="text-sm font-medium">Speed</label>
				<span class="text-xs font-mono text-gray-500">{visualizer.speed}x</span>
			</div>
			<input
				id="speed"
				type="range"
				min="1"
				max="10"
				bind:value={visualizer.speed}
				class="accent-primary cursor-pointer"
			/>
		</div>

		<!-- Playback Controls -->
		<div class="mt-auto flex flex-col gap-3 pt-4">
			<div class="grid grid-cols-4 gap-2">
				<!-- Step Back -->
				<button
					onclick={() => visualizer.stepBack()}
					disabled={visualizer.trace.length === 0 ||
						visualizer.isPlaying ||
						visualizer.operationIndex <= 0}
					class="bg-surface-200 hover:bg-surface-300 disabled:bg-surface-100 flex items-center justify-center rounded-md py-2 text-gray-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
					title="Step Back"
				>
					<ChevronLeft size={20} />
				</button>

				<!-- Main Action Button: Start / Play / Pause -->
				{#if visualizer.trace.length === 0}
					<button
						onclick={handleSort}
						class="bg-primary hover:bg-primary-dark focus:ring-primary/50 col-span-2 flex items-center justify-center gap-2 rounded-md py-2 font-medium text-white shadow-sm transition-all active:scale-95 focus:ring-2 focus:outline-none"
					>
						<Play size={18} />
						Start
					</button>
				{:else}
					<button
						onclick={() => (visualizer.isPlaying ? visualizer.pause() : visualizer.play())}
						disabled={visualizer.operationIndex >= visualizer.totalOperations}
						class="col-span-2 flex items-center justify-center gap-2 rounded-md py-2 font-medium text-white shadow-sm transition-all active:scale-95 disabled:opacity-50 {visualizer.isPlaying
							? 'bg-vis-compare'
							: 'bg-primary hover:bg-primary-dark'}"
					>
						{#if visualizer.isPlaying}
							<Pause size={18} />
							Pause
						{:else}
							<Play size={18} />
							Resume
						{/if}
					</button>
				{/if}

				<!-- Step Forward -->
				<button
					onclick={() => visualizer.stepForward()}
					disabled={visualizer.trace.length === 0 ||
						visualizer.isPlaying ||
						visualizer.operationIndex >= visualizer.totalOperations}
					class="bg-surface-200 hover:bg-surface-300 disabled:bg-surface-100 flex items-center justify-center rounded-md py-2 text-gray-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
					title="Step Forward"
				>
					<ChevronRight size={20} />
				</button>
			</div>

			<button
				onclick={() => visualizer.resetPlayback()}
				disabled={visualizer.trace.length === 0}
				class="bg-surface-200 text-surface-900 hover:bg-surface-300 flex w-full items-center justify-center gap-2 rounded-md py-2.5 font-medium shadow-sm transition-all active:scale-95 disabled:opacity-50"
			>
				<RotateCcw size={16} />
				Reset
			</button>

			<button
				onclick={() => visualizer.generateArray(visualizer.targetSize)}
				disabled={visualizer.isPlaying}
				class="bg-surface-200 hover:bg-surface-300 text-surface-900 focus:ring-surface-300/50 flex w-full items-center justify-center gap-2 rounded-md py-2.5 font-medium transition-all active:scale-95 focus:ring-2 focus:outline-none disabled:opacity-50"
			>
				<Shuffle size={16} />
				New Array
			</button>
		</div>
	</div>
</div>

{#if currentAlgo}
	<div
		class="bg-surface-50 border-surface-200 mt-8 grid gap-8 rounded-xl border p-6 md:grid-cols-2"
	>
		<div>
			<h3 class="text-surface-900 mb-4 text-lg font-bold">Summary</h3>
			<p class="text-surface-800 leading-relaxed text-sm">
				<TextWithLatex text={currentAlgo.details.summary} />
			</p>
		</div>

		<div>
			<h3 class="text-surface-900 mb-4 text-lg font-bold">How it Works</h3>
			<ul class="space-y-3">
				{#each currentAlgo.details.steps as step, i (i)}
					<li class="flex gap-4">
						<div class="bg-surface-200 mt-1.5 h-2 w-2 shrink-0 rounded-full"></div>
						<p class="text-surface-800 leading-relaxed">
							<TextWithLatex text={step} />
						</p>
					</li>
				{/each}
			</ul>
		</div>
	</div>
{/if}
