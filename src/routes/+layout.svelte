<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { page } from '$app/state';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>SortPedia - Learn Algorithms Visually</title>
</svelte:head>

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
