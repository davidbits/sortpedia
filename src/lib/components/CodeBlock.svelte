<script lang="ts">
	import { Check, Copy } from 'lucide-svelte';

	let {
		code,
		language = 'JavaScript',
		filename = 'code.js'
	}: { code: string; language?: string; filename?: string } = $props();

	let copied = $state(false);
	let timeoutId: number | undefined;

	async function copyToClipboard() {
		if (!navigator.clipboard) {
			console.error('Clipboard API not available.');
			return;
		}
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			if (timeoutId) clearTimeout(timeoutId);
			timeoutId = window.setTimeout(() => {
				copied = false;
			}, 2000); // Reset after 2 seconds
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	}

	$effect(() => {
		// Cleanup timeout on component destruction to prevent memory leaks
		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	});
</script>

<div class="group relative overflow-hidden rounded-lg bg-[#1e1e1e] shadow-lg">
	<div class="flex items-center justify-between bg-[#2d2d2d] px-4 py-2 text-xs text-gray-400">
		<span>{language}</span>
		<span>{filename}</span>
	</div>
	<pre class="overflow-x-auto p-4 text-sm leading-6 text-gray-300"><code>{code}</code></pre>

	<button
		onclick={copyToClipboard}
		class="absolute top-1 right-2 rounded-md p-1.5 text-gray-400 opacity-0 transition-all hover:bg-white/10 hover:text-white group-hover:opacity-100 focus:opacity-100"
		aria-label="Copy code to clipboard"
	>
		{#if copied}
			<Check class="h-4 w-4 text-green-400" />
		{:else}
			<Copy class="h-4 w-4" />
		{/if}
	</button>
</div>
