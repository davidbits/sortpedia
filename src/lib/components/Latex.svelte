<script lang="ts">
	import katex from 'katex';

	let { src }: { src: string } = $props();

	let html = $derived.by(() => {
		try {
			return katex.renderToString(src, {
				throwOnError: false, // Prevents crashing on invalid LaTeX
				displayMode: false
			});
		} catch (e) {
			console.error('KaTeX rendering error:', e);
			// Fallback to show the raw string on error
			return `<span class="text-red-500 font-mono">${src}</span>`;
		}
	});
</script>

<span class="inline-block" aria-label={src}>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html html}
</span>
