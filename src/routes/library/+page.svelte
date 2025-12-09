<script>
	import {
		algorithms,
		categoryExplanations,
		adaptiveExplanation,
		inPlaceExplanation,
		stableExplanation,
		unstableExplanation
	} from '$lib/algorithms';
	import { resolve } from '$app/paths';
	import { fade } from 'svelte/transition';
	import Latex from '$lib/components/Latex.svelte';
</script>

<div class="flex flex-col gap-8">
	<div>
		<h1 class="text-3xl font-bold">Algorithm Library</h1>
		<p class="text-surface-800 mt-2">Explore complexity, stability, and implementation details.</p>
	</div>

	<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each algorithms as algo, i (algo.id)}
			<div in:fade={{ delay: i * 50, duration: 400 }}>
				<a
					href={resolve(`/library/${algo.id}`)}
					class="bg-surface-50 border-surface-200 hover:border-primary group flex h-full flex-col rounded-xl border p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
				>
					<div class="flex items-start justify-between">
						<h2 class="group-hover:text-primary text-xl font-bold transition-colors">
							{algo.name}
						</h2>
						<span
							class="bg-surface-50 text-yellow-600 flex items-center rounded-full px-2 py-1 text-lg font-mono"
						>
							<Latex src={algo.complexity.average} />
						</span>
					</div>

					<p class="text-surface-800 mt-4 flex-1 line-clamp-3 text-sm">
						{algo.description}
					</p>

					<div class="mt-6 flex flex-wrap items-center gap-2">
						<!-- Category Tag with Tooltip -->
						<div class="group/tooltip relative">
							<span
								class="bg-surface-100 text-surface-800 border-surface-200 cursor-help rounded border px-2 py-1 text-xs font-medium"
							>
								{algo.category}
							</span>
							<div
								class="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-40 -translate-x-1/2 whitespace-normal rounded-md bg-surface-900 px-3 py-2 text-center text-xs font-medium text-surface-50 opacity-0 shadow-lg transition-opacity group-hover/tooltip:opacity-100 sm:max-w-xs"
							>
								{categoryExplanations[algo.category]}
								<div
									class="absolute left-1/2 top-full -translate-x-1/2 border-4 border-x-transparent border-b-transparent border-t-surface-900"
								></div>
							</div>
						</div>

						<!-- Adaptive Tag -->
						{#if algo.adaptive}
							<div class="group/tooltip relative">
								<span
									class="bg-indigo-50 text-indigo-800 border-indigo-200 cursor-help rounded border px-2 py-1 text-xs font-medium"
								>
									Adaptive
								</span>
								<div
									class="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-40 -translate-x-1/2 whitespace-normal rounded-md bg-surface-900 px-3 py-2 text-center text-xs font-medium text-surface-50 opacity-0 shadow-lg transition-opacity group-hover/tooltip:opacity-100 sm:max-w-xs"
								>
									{adaptiveExplanation}
									<div
										class="absolute left-1/2 top-full -translate-x-1/2 border-4 border-x-transparent border-b-transparent border-t-surface-900"
									></div>
								</div>
							</div>
						{/if}

						<!-- In-Place Tag -->
						{#if algo.inPlace}
							<div class="group/tooltip relative">
								<span
									class="bg-teal-50 text-teal-800 border-teal-200 cursor-help rounded border px-2 py-1 text-xs font-medium"
								>
									In-Place
								</span>
								<div
									class="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-40 -translate-x-1/2 whitespace-normal rounded-md bg-surface-900 px-3 py-2 text-center text-xs font-medium text-surface-50 opacity-0 shadow-lg transition-opacity group-hover/tooltip:opacity-100 sm:max-w-xs"
								>
									{inPlaceExplanation}
									<div
										class="absolute left-1/2 top-full -translate-x-1/2 border-4 border-x-transparent border-b-transparent border-t-surface-900"
									></div>
								</div>
							</div>
						{/if}

						<!-- Stability Tag with Tooltip -->
						{#if algo.stable}
							<div class="group/tooltip relative">
								<span
									class="bg-green-100 text-green-800 border-green-200 cursor-help rounded border px-2 py-1 text-xs font-medium"
								>
									Stable
								</span>
								<div
									class="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-40 -translate-x-1/2 whitespace-normal rounded-md bg-surface-900 px-3 py-2 text-center text-xs font-medium text-surface-50 opacity-0 shadow-lg transition-opacity group-hover/tooltip:opacity-100 sm:max-w-xs"
								>
									{stableExplanation}
									<div
										class="absolute left-1/2 top-full -translate-x-1/2 border-4 border-x-transparent border-b-transparent border-t-surface-900"
									></div>
								</div>
							</div>
						{:else}
							<div class="group/tooltip relative">
								<span
									class="bg-red-50 text-red-800 border-red-200 cursor-help rounded border px-2 py-1 text-xs font-medium"
								>
									Unstable
								</span>
								<div
									class="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-40 -translate-x-1/2 whitespace-normal rounded-md bg-surface-900 px-3 py-2 text-center text-xs font-medium text-surface-50 opacity-0 shadow-lg transition-opacity group-hover/tooltip:opacity-100 sm:max-w-xs"
								>
									{unstableExplanation}
									<div
										class="absolute left-1/2 top-full -translate-x-1/2 border-4 border-x-transparent border-b-transparent border-t-surface-900"
									></div>
								</div>
							</div>
						{/if}
					</div>
				</a>
			</div>
		{/each}
	</div>
</div>
