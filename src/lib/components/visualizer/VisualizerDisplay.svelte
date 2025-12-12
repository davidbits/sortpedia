<script lang="ts">
	import type { VisualizerEngine } from '$lib/stores/visualizer.svelte';

	interface Props {
		engine: VisualizerEngine;
	}

	let { engine }: Props = $props();
</script>

<div class="relative flex h-full w-full flex-col overflow-hidden">
	{#if engine.array.length === 0}
		<div class="flex h-full items-center justify-center text-center">
			<p class="text-surface-800 text-sm font-medium">No Data</p>
		</div>
	{/if}

	<!-- Bar Container -->
	<div class="flex h-full w-full items-end gap-px md:gap-0.5">
		{#each engine.array as item, i (item.id)}
			<div
				class="w-full rounded-t-sm transition-colors duration-75 {engine.getBarColor(i)}"
				style="height: {item.value}%"
			></div>
		{/each}
	</div>
</div>
