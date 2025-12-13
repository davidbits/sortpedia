<script>
	import { resolve } from '$app/paths';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const schema = JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': 'https://sortpedia.com/#website',
				url: 'https://sortpedia.com/',
				name: 'SortPedia',
				description: 'Interactive Sorting Algorithm Visualizer',
				publisher: {
					'@id': 'https://sortpedia.com/#organization'
				}
			},
			{
				'@type': 'Organization',
				'@id': 'https://sortpedia.com/#organization',
				name: 'SortPedia',
				url: 'https://sortpedia.com/',
				logo: 'https://sortpedia.com/favicon.svg',
				sameAs: []
			}
		]
	});
</script>

<svelte:head>
	<title>SortPedia - Interactive Sorting Algorithm Visualizer</title>
	<meta property="og:title" content="SortPedia - Interactive Sorting Algorithm Visualizer" />
	<meta property="twitter:title" content="SortPedia - Interactive Sorting Algorithm Visualizer" />
	<meta property="og:url" content="https://sortpedia.com/" />

	<script type="application/ld+json">
{schema}
	</script>
</svelte:head>

<div class="flex flex-col items-center justify-center py-20 text-center">
	<h1 class="text-surface-900 text-5xl font-extrabold tracking-tight sm:text-6xl">
		Master <span class="text-primary">Sorting Algorithms</span><br /> Through Visualization
	</h1>
	<p class="text-surface-800 mt-6 max-w-2xl text-lg">
		Interactive visualizers, side-by-side comparisons, and deep-dive explanations for computer
		science students and enthusiasts.
	</p>

	<div class="mt-10 flex flex-wrap justify-center gap-4">
		<a
			href={resolve('/visualizer')}
			class="bg-primary hover:bg-primary-dark rounded-md px-6 py-3 font-medium text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
		>
			Start Visualizing
		</a>
		<a
			href={resolve('/library')}
			class="bg-surface-200 hover:bg-surface-300 text-surface-900 rounded-md px-6 py-3 font-medium transition-colors hover:text-black"
		>
			Browse Library
		</a>
	</div>

	<!-- Hero Placeholder Animation -->
	<div
		class="bg-surface-100 border-surface-200 mt-16 flex h-64 w-full max-w-4xl items-end justify-center gap-1 rounded-xl border p-8 shadow-inner overflow-hidden"
	>
		{#each Array.from({ length: 24 }, (_, k) => k) as i (i)}
			{@const startH = Math.max(10, Math.random() * 100) + '%'}
			{@const endH = Math.max(10, Math.random() * 100) + '%'}
			<div
				class="bg-vis-idle animate-bar w-full rounded-t-sm"
				style="
                    --h-start: {startH};
                    --h-end: {endH};
                    animation-delay: {Math.random() * 2}s;
                    height: {startH}
                "
			></div>
		{/each}
	</div>
</div>
