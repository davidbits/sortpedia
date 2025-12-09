<script lang="ts">
	import Latex from '$lib/components/Latex.svelte';

	let { text = '' }: { text?: string } = $props();

	// Split the text by the '$' delimiter.
	// Even-indexed segments are plain text (which may contain **bold** or `code`).
	// Odd-indexed segments are LaTeX source.
	let segments = $derived(text.split('$'));

	/**
	 * Simple parser to convert markdown syntax to HTML.
	 * Supports:
	 * - **bold** -> <strong>bold</strong>
	 * - `code` -> <code ...>code</code>
	 */
	function parseMarkdown(str: string) {
		return (
			str
				// Parse inline code: `text`
				// We use specific tailwind classes to match the theme (surface colors, mono font)
				.replace(
					/`(.*?)`/g,
					'<code class="bg-surface-200 rounded px-1.5 py-0.5 font-mono text-sm text-surface-900">$1</code>'
				)
				// Parse bold: **text**
				.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
		);
	}
</script>

{#each segments as segment, i (i)}
	{#if i % 2 === 0}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<span>{@html parseMarkdown(segment)}</span>
	{:else if segment}
		<Latex src={segment} />
	{/if}
{/each}
