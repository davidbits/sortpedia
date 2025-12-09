<script>
	import {
		adaptiveExplanation,
		algorithms,
		categoryExplanations,
		inPlaceExplanation,
		stableExplanation,
		unstableExplanation
	} from '$lib/algorithms';
	import { resolve } from '$app/paths';
	import { fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import Latex from '$lib/components/Latex.svelte';
	import { ArrowDownAZ, ArrowUpAZ, RotateCcw, Search, X } from 'lucide-svelte';

	// Filter & Sort State
	let searchQuery = $state('');
	let selectedCategory = $state('All');
	let filterStable = $state(false);
	let filterAdaptive = $state(false);
	let filterInPlace = $state(false);
	let sortAsc = $state(true);

	// Derived Data
	let categories = $derived(['All', ...new Set(algorithms.map((a) => a.category))].sort());

	// Check if any filter is active for the Reset button state
	let isFiltered = $derived(
		searchQuery !== '' ||
			selectedCategory !== 'All' ||
			filterStable ||
			filterAdaptive ||
			filterInPlace ||
			!sortAsc
	);

	let filteredAlgorithms = $derived(
		algorithms
			.filter((algo) => {
				const matchesSearch = algo.name.toLowerCase().includes(searchQuery.toLowerCase());
				const matchesCategory = selectedCategory === 'All' || algo.category === selectedCategory;
				const matchesStable = !filterStable || algo.stable;
				const matchesAdaptive = !filterAdaptive || algo.adaptive;
				const matchesInPlace = !filterInPlace || algo.inPlace;

				return (
					matchesSearch && matchesCategory && matchesStable && matchesAdaptive && matchesInPlace
				);
			})
			.sort((a, b) => {
				const comparison = a.name.localeCompare(b.name);
				return sortAsc ? comparison : -comparison;
			})
	);

	function resetFilters() {
		searchQuery = '';
		selectedCategory = 'All';
		filterStable = false;
		filterAdaptive = false;
		filterInPlace = false;
		sortAsc = true;
	}
</script>

<div class="flex flex-col gap-8">
	<div>
		<h1 class="text-surface-900 text-3xl font-bold">Algorithm Library</h1>
		<p class="text-surface-800 mt-2">Explore complexity, stability, and implementation details.</p>
	</div>

	<!-- Controls Section -->
	<div
		class="bg-surface-50 border-surface-200 flex flex-col gap-4 rounded-xl border p-4 shadow-sm lg:flex-row lg:items-center"
	>
		<!-- Search: Full width on mobile, Flex grow on desktop -->
		<div class="relative w-full lg:flex-1">
			<Search class="text-surface-400 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search algorithms..."
				class="border-surface-200 focus:border-primary focus:ring-primary/20 placeholder:text-surface-400 w-full rounded-lg border bg-white py-2 pr-4 pl-10 text-sm transition-all focus:ring-2 focus:outline-none"
			/>
			{#if searchQuery}
				<button
					onclick={() => (searchQuery = '')}
					class="text-surface-400 hover:text-surface-600 absolute top-1/2 right-3 -translate-y-1/2 p-1"
					aria-label="Clear search"
				>
					<X size={14} />
				</button>
			{/if}
		</div>

		<!-- Mobile Row: Category + Sort -->
		<div class="flex w-full gap-2 lg:w-auto">
			<div class="flex flex-1 items-center gap-2 lg:w-auto">
				<select
					id="category"
					bind:value={selectedCategory}
					class="border-surface-200 focus:border-primary focus:ring-primary/20 h-10 w-full rounded-lg border bg-white px-3 text-sm transition-all focus:ring-2 focus:outline-none cursor-pointer lg:w-40"
					aria-label="Filter by Category"
				>
					{#each categories as cat (cat)}
						<option value={cat}>{cat}</option>
					{/each}
				</select>
			</div>

			<button
				onclick={() => (sortAsc = !sortAsc)}
				class="border-surface-200 hover:bg-surface-100 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-white transition-colors lg:w-auto lg:px-3"
				title={sortAsc ? 'Sort Descending' : 'Sort Ascending'}
			>
				{#if sortAsc}
					<ArrowDownAZ size={18} />
				{:else}
					<ArrowUpAZ size={18} />
				{/if}
			</button>
		</div>

		<!-- Divider on Desktop -->
		<div class="bg-surface-200 hidden h-8 w-px lg:block"></div>

		<!-- Boolean Filters & Reset -->
		<div class="flex flex-wrap items-center gap-2">
			<button
				onclick={() => (filterStable = !filterStable)}
				class="h-8 rounded-full border px-4 text-xs font-medium transition-colors {filterStable
					? 'bg-primary border-primary text-white shadow-sm'
					: 'bg-white border-surface-200 text-surface-600 hover:border-primary hover:text-primary'}"
			>
				Stable
			</button>
			<button
				onclick={() => (filterAdaptive = !filterAdaptive)}
				class="h-8 rounded-full border px-4 text-xs font-medium transition-colors {filterAdaptive
					? 'bg-primary border-primary text-white shadow-sm'
					: 'bg-white border-surface-200 text-surface-600 hover:border-primary hover:text-primary'}"
			>
				Adaptive
			</button>
			<button
				onclick={() => (filterInPlace = !filterInPlace)}
				class="h-8 rounded-full border px-4 text-xs font-medium transition-colors {filterInPlace
					? 'bg-primary border-primary text-white shadow-sm'
					: 'bg-white border-surface-200 text-surface-600 hover:border-primary hover:text-primary'}"
			>
				In-Place
			</button>

			<!-- Reset Button: Always present to prevent layout shift, toggles opacity -->
			<button
				onclick={resetFilters}
				disabled={!isFiltered}
				class="text-surface-400 hover:text-red-500 hover:bg-surface-100 disabled:opacity-0 ml-1 flex h-8 w-8 items-center justify-center rounded-full transition-all disabled:pointer-events-none"
				title="Reset all filters"
				aria-label="Reset all filters"
			>
				<RotateCcw size={16} />
			</button>
		</div>
	</div>

	<!-- Results Grid -->
	{#if filteredAlgorithms.length > 0}
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each filteredAlgorithms as algo (algo.id)}
				<div animate:flip={{ duration: 300 }} in:fade={{ delay: 0, duration: 300 }}>
					<a
						href={resolve(`/library/${algo.id}`)}
						class="bg-surface-50 border-surface-200 hover:border-primary group flex h-full flex-col rounded-xl border p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
					>
						<div class="flex items-start justify-between">
							<h2
								class="group-hover:text-primary text-surface-900 text-xl font-bold transition-colors"
							>
								{algo.name}
							</h2>
							<span
								class="bg-surface-50 text-yellow-600 flex items-center rounded-full px-2 py-1 text-lg font-mono"
							>
								<Latex src={algo.complexity.average} />
							</span>
						</div>

						<p class="text-surface-600 mt-4 flex-1 line-clamp-3 text-sm leading-relaxed">
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
										class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-x-transparent border-b-transparent border-t-surface-900"
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
											class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-x-transparent border-b-transparent border-t-surface-900"
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
											class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-x-transparent border-b-transparent border-t-surface-900"
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
											class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-x-transparent border-b-transparent border-t-surface-900"
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
											class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-x-transparent border-b-transparent border-t-surface-900"
										></div>
									</div>
								</div>
							{/if}
						</div>
					</a>
				</div>
			{/each}
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center py-16 text-center">
			<div class="bg-surface-100 mb-4 rounded-full p-4">
				<Search size={32} class="text-surface-400" />
			</div>
			<h3 class="text-surface-900 text-lg font-semibold">No algorithms found</h3>
			<p class="text-surface-600 mt-2 max-w-sm">
				We couldn't find any algorithms matching your current filters. Try adjusting your search or
				categories.
			</p>
			<button
				onclick={resetFilters}
				class="text-primary hover:text-primary-dark mt-6 font-medium transition-colors hover:underline"
			>
				Clear all filters
			</button>
		</div>
	{/if}
</div>
