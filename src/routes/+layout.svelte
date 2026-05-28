<script lang="ts">
import './layout.css';
import { injectAnalytics } from '@vercel/analytics/sveltekit';
import { cubicOut } from 'svelte/easing';
import { fly } from 'svelte/transition';
import { dev } from '$app/environment';
import { page } from '$app/state';
import Footer from '$lib/components/Footer.svelte';
import Header from '$lib/components/Header.svelte';
import { isVisualizerEmbedUrl } from '$lib/embed';

let { children } = $props();

injectAnalytics({ mode: dev ? 'development' : 'production' });

let isEmbedView = $derived(isVisualizerEmbedUrl(page.url));
</script>

{#if isEmbedView}
	<main class="flex h-screen w-full flex-1 px-2 py-2 sm:px-3 sm:py-3">
		{@render children()}
	</main>
{:else}
	<Header />

	{#key page.url.pathname}
		<main
			in:fly={{ y: 10, duration: 300, delay: 150, easing: cubicOut }}
			out:fly={{ y: -5, duration: 150, easing: cubicOut }}
			class="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8"
		>
			{@render children()}
		</main>
	{/key}

	<Footer />
{/if}
