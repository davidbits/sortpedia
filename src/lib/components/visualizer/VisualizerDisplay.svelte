<script lang="ts">
	import type { VisualizerEngine } from '$lib/stores/visualizer.svelte';

	interface Props {
		engine: VisualizerEngine;
		showStats?: boolean;
	}

	let { engine, showStats = false }: Props = $props();
</script>

<div class="relative flex h-full w-full flex-col overflow-hidden">
	{#if engine.array.length === 0}
		<div class="flex h-full items-center justify-center text-center">
			<p class="text-surface-800 text-sm font-medium">No Data</p>
		</div>
	{/if}

	<!-- Bar Container -->
	<div class="flex h-full w-full items-end gap-[1px] md:gap-0.5">
		{#each engine.array as value, i (i)}
			<div
				class="w-full rounded-t-sm transition-colors duration-75 {engine.getBarColor(i)}"
				style="height: {value}%"
			></div>
		{/each}
	</div>

	<!-- Optional Stats Overlay -->
	{#if showStats}
		<div
			class="bg-surface-50/90 border-surface-200 absolute top-4 left-4 rounded border p-2 text-xs font-mono shadow backdrop-blur"
		>
			<div>Ops: {engine.operationIndex} / {engine.totalOperations}</div>
			<div>Status: {engine.isPlaying ? 'Running' : 'Idle'}</div>
		</div>
	{/if}
</div>
