<script lang="ts">
	import { page } from '$app/state';
	import { getAlgorithm } from '$lib/algorithms';
	import { resolve } from '$app/paths';
	import { VisualizerEngine } from '$lib/stores/visualizer.svelte';
	import VisualizerDisplay from '$lib/components/visualizer/VisualizerDisplay.svelte';
	import { untrack } from 'svelte';
	import Latex from '$lib/components/Latex.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import TextWithLatex from '$lib/components/TextWithLatex.svelte';
	import { Play, Pause, RotateCcw, Shuffle } from 'lucide-svelte';

	let algoId = $derived(page.params.id ?? '');
	let algorithm = $derived(getAlgorithm(algoId));

	// Bogo Sort is only practical for tiny arrays. Set a specific size for it.
	const DEMO_SIZE = $derived(algorithm?.id === 'bogo-sort' ? 5 : 20);
	const demoEngine = new VisualizerEngine(0);

	const categoryExplanations = {
		Exchange:
			'Sorts by repeatedly swapping adjacent elements to move them to their correct positions.',
		Selection: 'Sorts by repeatedly finding the minimum element and placing it at the beginning.',
		Insertion:
			'Sorts by building a final sorted array one item at a time, inserting it into place.',
		Merge: 'Sorts by recursively dividing the list, sorting the halves, and merging them back.',
		Distribution: 'Sorts by distributing elements into buckets based on their values.',
		'Brute Force': 'Sorts by generating and testing possibilities until a solution is found.'
	};

	// Reset demo when algorithm or size changes
	$effect(() => {
		if (algorithm) {
			// Wrap internal state reads in untrack() to prevent infinite loops.
			// This tells Svelte: "Execute this, but don't track any state read inside as a dependency."
			untrack(() => {
				demoEngine.resetPlayback();
				demoEngine.generateArray(DEMO_SIZE);
			});
		}
	});

	function runDemo() {
		if (algorithm) {
			demoEngine.speed = 6;
			demoEngine.runAlgorithm(algorithm.id);
		}
	}
</script>

<svelte:head>
	<title>{algorithm ? algorithm.name : 'Algorithm Not Found'} - SortPedia</title>
</svelte:head>

{#if algorithm}
	<article class="mx-auto max-w-4xl pb-20">
		<!-- Header Section -->
		<div class="border-surface-200 mb-10 border-b pb-8">
			<a
				href={resolve('/library')}
				class="text-primary mb-6 inline-flex items-center text-sm font-medium hover:underline"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="mr-1"
				>
					<path d="m15 18-6-6 6-6" />
				</svg>
				Back to Library
			</a>

			<div class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-8">
				<div class="min-w-0 flex-1">
					<h1 class="text-surface-900 text-4xl font-extrabold tracking-tight sm:text-5xl">
						{algorithm.name}
					</h1>
					<p class="text-surface-800 mt-4 text-xl leading-relaxed">
						<TextWithLatex text={algorithm.details.summary} />
					</p>
				</div>
				<div class="flex flex-shrink-0 flex-wrap items-center gap-2">
					<!-- Category Tag with Tooltip -->
					<div class="group relative">
						<span
							class="bg-primary/10 text-primary cursor-help rounded-full px-4 py-1.5 text-sm font-bold"
						>
							{algorithm.category} Sort
						</span>
						<div
							class="pointer-events-none absolute bottom-full left-0 z-10 mb-2 w-max max-w-[80vw] rounded-md bg-surface-900 px-3 py-2 text-xs font-medium text-surface-50 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:left-1/2 sm:max-w-xs sm:-translate-x-1/2"
						>
							{categoryExplanations[algorithm.category]}
							<div
								class="absolute left-3 top-full border-4 border-x-transparent border-b-transparent border-t-surface-900 sm:left-1/2 sm:-translate-x-1/2"
							></div>
						</div>
					</div>

					<!-- Stability Tag with Tooltip -->
					{#if algorithm.stable}
						<div class="group relative">
							<span
								class="bg-green-100 text-green-800 cursor-help rounded-full px-4 py-1.5 text-sm font-bold"
							>
								Stable
							</span>
							<div
								class="pointer-events-none absolute bottom-full left-0 z-10 mb-2 w-max max-w-[80vw] rounded-md bg-surface-900 px-3 py-2 text-xs font-medium text-surface-50 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:left-1/2 sm:max-w-xs sm:-translate-x-1/2"
							>
								Preserves the relative order of elements with equal values.
								<div
									class="absolute left-3 top-full border-4 border-x-transparent border-b-transparent border-t-surface-900 sm:left-1/2 sm:-translate-x-1/2"
								></div>
							</div>
						</div>
					{:else}
						<div class="group relative">
							<span
								class="bg-red-100 text-red-800 cursor-help rounded-full px-4 py-1.5 text-sm font-bold"
							>
								Unstable
							</span>
							<div
								class="pointer-events-none absolute bottom-full left-0 z-10 mb-2 w-max max-w-[80vw] rounded-md bg-surface-900 px-3 py-2 text-xs font-medium text-surface-50 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:left-1/2 sm:max-w-xs sm:-translate-x-1/2"
							>
								Does not guarantee the relative order of elements with equal values.
								<div
									class="absolute left-3 top-full border-4 border-x-transparent border-b-transparent border-t-surface-900 sm:left-1/2 sm:-translate-x-1/2"
								></div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<div class="grid gap-12 lg:grid-cols-3">
			<!-- Main Content Column -->
			<div class="min-w-0 space-y-12 lg:col-span-2">
				<!-- How it works -->
				<section>
					<h2 class="text-surface-900 mb-6 text-2xl font-bold">How it Works</h2>
					<ul class="space-y-4">
						{#each algorithm.details.steps as step (step)}
							<li class="flex gap-4">
								<div class="bg-surface-200 mt-1.5 h-2 w-2 flex-shrink-0 rounded-full"></div>
								<p class="text-surface-800 leading-relaxed"><TextWithLatex text={step} /></p>
							</li>
						{/each}
					</ul>
				</section>

				<!-- Complexity Analysis -->
				<section class="bg-surface-50 border-surface-200 rounded-xl border p-6">
					<h2 class="text-surface-900 mb-6 text-xl font-bold">Complexity Analysis</h2>
					<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
						<div class="border-surface-100 min-w-0 rounded-lg border bg-white p-4 shadow-sm">
							<dt class="text-xs font-semibold tracking-wider text-gray-500 uppercase">
								Best Case
							</dt>
							<dd class="mt-1 font-mono text-lg font-bold text-green-600">
								<Latex src={algorithm.complexity.best} />
							</dd>
						</div>
						<div class="border-surface-100 min-w-0 rounded-lg border bg-white p-4 shadow-sm">
							<dt class="text-xs font-semibold tracking-wider text-gray-500 uppercase">Average</dt>
							<dd class="mt-1 font-mono text-lg font-bold text-yellow-600">
								<Latex src={algorithm.complexity.average} />
							</dd>
						</div>
						<div class="border-surface-100 min-w-0 rounded-lg border bg-white p-4 shadow-sm">
							<dt class="text-xs font-semibold tracking-wider text-gray-500 uppercase">
								Worst Case
							</dt>
							<dd class="mt-1 font-mono text-lg font-bold text-red-600">
								<Latex src={algorithm.complexity.worst} />
							</dd>
						</div>
						<div class="border-surface-100 min-w-0 rounded-lg border bg-white p-4 shadow-sm">
							<dt class="text-xs font-semibold tracking-wider text-gray-500 uppercase">Space</dt>
							<dd class="text-primary mt-1 font-mono text-lg font-bold">
								<Latex src={algorithm.complexity.space} />
							</dd>
						</div>
					</div>
				</section>

				<!-- Pros & Cons -->
				<section class="grid gap-6 sm:grid-cols-2">
					<div class="min-w-0">
						<h3 class="mb-4 flex items-center gap-2 font-bold text-green-700">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg
							>
							Advantages
						</h3>
						<ul class="text-surface-800 space-y-3 text-sm">
							{#each algorithm.details.advantages as item (item)}
								<li class="border-green-200 border-l-2 pl-2">
									<TextWithLatex text={item} />
								</li>
							{/each}
						</ul>
					</div>
					<div class="min-w-0">
						<h3 class="mb-4 flex items-center gap-2 font-bold text-red-700">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line
									x1="9"
									y1="9"
									x2="15"
									y2="15"
								/></svg
							>
							Disadvantages
						</h3>
						<ul class="text-surface-800 space-y-3 text-sm">
							{#each algorithm.details.disadvantages as item (item)}
								<li class="border-red-200 border-l-2 pl-2">
									<TextWithLatex text={item} />
								</li>
							{/each}
						</ul>
					</div>
				</section>

				<!-- Implementation -->
				<section>
					<h2 class="text-surface-900 mb-4 text-2xl font-bold">Implementation</h2>
					<CodeBlock
						code={algorithm.details.javascript}
						language="JavaScript"
						filename={`${algorithm.id}.js`}
					/>
				</section>
			</div>

			<!-- Sidebar / Mini Visualizer -->
			<div class="lg:col-span-1">
				<div class="sticky top-24 space-y-6">
					<div class="bg-surface-50 border-surface-200 overflow-hidden rounded-xl border shadow-sm">
						<div class="border-surface-200 border-b bg-white p-4">
							<h3 class="font-bold">Live Demo</h3>
							<p class="text-xs text-gray-500">{DEMO_SIZE} elements • 6x Speed</p>
						</div>

						<div class="bg-surface-100 h-48 p-4">
							<VisualizerDisplay engine={demoEngine} />
						</div>

						<div class="grid grid-cols-2 gap-2 bg-white p-4">
							{#if demoEngine.isPlaying}
								<!-- Running State: Stop + Reset -->
								<button
									onclick={() => demoEngine.pause()}
									class="bg-vis-compare hover:brightness-90 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium text-white transition-colors active:scale-95"
								>
									<Pause size={16} />
									Stop
								</button>
								<button
									onclick={() => demoEngine.resetPlayback()}
									class="bg-surface-200 hover:bg-surface-300 flex items-center justify-center gap-2 rounded-md py-2 px-3 text-sm font-medium transition-colors active:scale-95"
								>
									<RotateCcw size={14} />
									Reset
								</button>
							{:else}
								<!-- Idle State: Start + Shuffle -->
								<button
									onclick={runDemo}
									class="bg-primary hover:bg-primary-dark flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium text-white transition-colors active:scale-95"
								>
									<Play size={16} />
									Start
								</button>
								<button
									onclick={() => demoEngine.generateArray(DEMO_SIZE)}
									class="bg-surface-200 hover:bg-surface-300 flex items-center justify-center gap-2 rounded-md py-2 px-3 text-sm font-medium transition-colors active:scale-95"
									aria-label="Shuffle"
								>
									<Shuffle size={14} />
									Shuffle
								</button>
							{/if}
						</div>
					</div>

					{#if algorithm.details.funFacts && algorithm.details.funFacts.length > 0}
						<div class="bg-primary/5 border-primary/10 rounded-xl border p-6">
							<h4 class="text-primary mb-3 font-bold">Did you know?</h4>
							<ul class="text-surface-800 list-inside list-disc space-y-2 text-sm">
								{#each algorithm.details.funFacts as fact (fact)}
									<li>
										<TextWithLatex text={fact} />
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</article>
{:else}
	<div class="flex h-[50vh] flex-col items-center justify-center text-center">
		<h1 class="text-3xl font-bold">Algorithm not found</h1>
		<a href={resolve('/library')} class="text-primary mt-4 hover:underline">Return to library</a>
	</div>
{/if}
