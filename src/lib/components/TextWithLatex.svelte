<script lang="ts">
	import Latex from '$lib/components/Latex.svelte';

	let { text = '' }: { text?: string } = $props();

	// 1. Tokenize the string by splitting on Markdown containers (bold, code).
	// The capturing group in split() keeps the delimiters in the resulting array.
	// We filter out empty strings that can result from the split.
	const segments = $derived(text.split(/(\*\*.*?\*\*|`.*?`)/g).filter(Boolean));
</script>

{#each segments as segment, i (i)}
	{#if segment.startsWith('**') && segment.endsWith('**')}
		{@const innerText = segment.slice(2, -2)}
		<strong>
			<!-- 2. For bold segments, parse their *inner content* for LaTeX -->
			{#each innerText.split('$') as latexSegment, j (j)}
				{#if j % 2 === 0}
					<span>{latexSegment}</span>
				{:else if latexSegment}
					<Latex src={latexSegment} />
				{/if}
			{/each}
		</strong>
	{:else if segment.startsWith('`') && segment.endsWith('`')}
		{@const innerText = segment.slice(1, -1)}
		<!-- 3. Code segments are treated as literal text and are not parsed further -->
		<code class="bg-surface-200 rounded px-1.5 py-0.5 font-mono text-sm text-surface-900">
			{innerText}
		</code>
	{:else}
		<!-- 4. For plain text segments, parse them for LaTeX -->
		{#each segment.split('$') as latexSegment, j (j)}
			{#if j % 2 === 0}
				<span>{latexSegment}</span>
			{:else if latexSegment}
				<Latex src={latexSegment} />
			{/if}
		{/each}
	{/if}
{/each}
