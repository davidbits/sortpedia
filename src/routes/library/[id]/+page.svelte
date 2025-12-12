<script lang="ts">
	import { page } from '$app/state';
	import {
		getAlgorithm,
		categoryExplanations,
		adaptiveExplanation,
		inPlaceExplanation,
		stableExplanation,
		unstableExplanation
	} from '$lib/algorithms';
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

	// Check if the algorithm is considered dangerous by comparing its ID against a predefined list.
	let isDangerAlgo = $derived(() => {
		const dangerousAlgorithms = ['bogo-sort', 'bogobogo-sort', 'stooge-sort', 'bozo-sort'];
		return algorithm ? dangerousAlgorithms.includes(algorithm.id) : false;
	});

	let DEMO_SIZE = $derived(isDangerAlgo() ? 5 : 20);
	let DEMO_SPEED = 4;
	const demoEngine = new VisualizerEngine(0);

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
			demoEngine.speed = DEMO_SPEED;
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

			<div class="mt-2">
				<!-- Name and Tags grouped together -->
				<div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
					<h1 class="text-surface-900 text-4xl font-extrabold tracking-tight sm:text-5xl">
						{algorithm.name}
					</h1>

					<div class="flex flex-wrap items-center gap-2 sm:justify-end">
						<!-- Category Tags -->
						{#each algorithm.category as category, i (category)}
							<div class="group relative">
								<span
									class="cursor-help rounded-full px-4 py-1.5 text-sm font-bold {i === 0
										? 'bg-primary/10 text-primary'
										: 'bg-surface-100 text-surface-800'}"
								>
									{category}
								</span>
								{#if categoryExplanations[category]}
									<div
										class="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-40 -translate-x-1/2 whitespace-normal rounded-md bg-surface-900 px-3 py-2 text-center text-xs font-medium text-surface-50 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:max-w-xs"
									>
										{categoryExplanations[category]}
										<div
											class="absolute left-1/2 top-full -translate-x-1/2 border-4 border-x-transparent border-b-transparent border-t-surface-900"
										></div>
									</div>
								{/if}
							</div>
						{/each}

						<!-- Adaptive Tag -->
						{#if algorithm.adaptive}
							<div class="group relative">
								<span
									class="bg-indigo-100 text-indigo-800 cursor-help rounded-full px-4 py-1.5 text-sm font-bold"
								>
									Adaptive
								</span>
								<div
									class="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-40 -translate-x-1/2 whitespace-normal rounded-md bg-surface-900 px-3 py-2 text-center text-xs font-medium text-surface-50 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:max-w-xs"
								>
									{adaptiveExplanation}
									<div
										class="absolute left-1/2 top-full -translate-x-1/2 border-4 border-x-transparent border-b-transparent border-t-surface-900"
									></div>
								</div>
							</div>
						{/if}

						<!-- In-Place Tag -->
						{#if algorithm.inPlace}
							<div class="group relative">
								<span
									class="bg-teal-100 text-teal-800 cursor-help rounded-full px-4 py-1.5 text-sm font-bold"
								>
									In-Place
								</span>
								<div
									class="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-40 -translate-x-1/2 whitespace-normal rounded-md bg-surface-900 px-3 py-2 text-center text-xs font-medium text-surface-50 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:max-w-xs"
								>
									{inPlaceExplanation}
									<div
										class="absolute left-1/2 top-full -translate-x-1/2 border-4 border-x-transparent border-b-transparent border-t-surface-900"
									></div>
								</div>
							</div>
						{:else}
							<div class="group relative">
								<span
									class="bg-orange-100 text-orange-800 cursor-help rounded-full px-4 py-1.5 text-sm font-bold"
								>
									Out-of-Place
								</span>
								<div
									class="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-40 -translate-x-1/2 whitespace-normal rounded-md bg-surface-900 px-3 py-2 text-center text-xs font-medium text-surface-50 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:max-w-xs"
								>
									Requires auxiliary memory proportional to the input size (O(n)).
									<div
										class="absolute left-1/2 top-full -translate-x-1/2 border-4 border-x-transparent border-b-transparent border-t-surface-900"
									></div>
								</div>
							</div>
						{/if}

						<!-- Stability Tag -->
						{#if algorithm.stable}
							<div class="group relative">
								<span
									class="bg-green-100 text-green-800 cursor-help rounded-full px-4 py-1.5 text-sm font-bold"
								>
									Stable
								</span>
								<div
									class="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-40 -translate-x-1/2 whitespace-normal rounded-md bg-surface-900 px-3 py-2 text-center text-xs font-medium text-surface-50 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:max-w-xs"
								>
									{stableExplanation}
									<div
										class="absolute left-1/2 top-full -translate-x-1/2 border-4 border-x-transparent border-b-transparent border-t-surface-900"
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
									class="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-40 -translate-x-1/2 whitespace-normal rounded-md bg-surface-900 px-3 py-2 text-center text-xs font-medium text-surface-50 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:max-w-xs"
								>
									{unstableExplanation}
									<div
										class="absolute left-1/2 top-full -translate-x-1/2 border-4 border-x-transparent border-b-transparent border-t-surface-900"
									></div>
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Summary consumes full width below -->
				<p class="text-surface-800 mt-6 text-xl leading-relaxed">
					<TextWithLatex text={algorithm.details.summary} />
				</p>
			</div>
		</div>

		<div class="grid gap-12 lg:grid-cols-3">
			<!--Sidebar / Mini Visualizer -->
			<div class="lg:col-span-1 lg:col-start-3">
				<div class="sticky top-24 space-y-6">
					<div class="bg-surface-50 border-surface-200 overflow-hidden rounded-xl border shadow-sm">
						<div class="border-surface-200 border-b bg-white p-4">
							<h3 class="font-bold">Demo</h3>
							<p class="text-xs text-gray-500">{DEMO_SIZE} elements • {DEMO_SPEED}x Speed</p>
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

			<!-- Main Content Column -->
			<div class="min-w-0 space-y-12 lg:col-span-2 lg:col-start-1 lg:row-start-1">
				<!-- How it works -->
				<section>
					<h2 class="text-surface-900 mb-6 text-2xl font-bold">How it Works</h2>
					<ul class="space-y-4">
						{#each algorithm.details.steps as step (step)}
							<li class="flex gap-4">
								<div class="bg-surface-200 mt-1.5 h-2 w-2 shrink-0 rounded-full"></div>
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
		</div>
	</article>
{:else}
	<div class="flex h-[50vh] flex-col items-center justify-center text-center">
		<h1 class="text-3xl font-bold">Algorithm not found</h1>
		<a href={resolve('/library')} class="text-primary mt-4 hover:underline">Return to library</a>
	</div>
{/if}
