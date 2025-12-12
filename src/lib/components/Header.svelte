<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { slide } from 'svelte/transition';

	const navItems = [
		['Visualizer', '/visualizer'],
		['Compare', '/compare'],
		['Benchmark', '/benchmark'],
		['Library', '/library'],
		['About', '/about']
	] as const;

	let isMenuOpen = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	// Close menu when route changes
	$effect(() => {
		if (page.url.pathname) {
			isMenuOpen = false;
		}
	});

	function isActive(path: string) {
		return page.url.pathname.startsWith(path);
	}
</script>

<header
	class="border-surface-200 bg-surface-50/80 sticky top-0 z-50 w-full border-b backdrop-blur-md"
>
	<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
		<!-- Logo -->
		<div class="flex items-center gap-2">
			<a
				href={resolve('/')}
				class="text-xl font-bold tracking-tight transition-opacity hover:opacity-80"
			>
				<span class="text-primary">Sort</span>Pedia
			</a>
		</div>

		<!-- Desktop Nav -->
		<nav class="hidden gap-8 md:flex">
			{#each navItems as [label, href] (href)}
				<a
					href={resolve(href)}
					class="text-sm font-medium transition-colors hover:text-primary {isActive(href)
						? 'text-primary'
						: 'text-surface-800'}"
				>
					{label}
				</a>
			{/each}
		</nav>

		<!-- Mobile Menu Button -->
		<div class="md:hidden">
			<button
				onclick={toggleMenu}
				class="text-surface-800 hover:text-primary focus:ring-primary/50 flex h-10 w-10 items-center justify-center rounded-md focus:outline-none focus:ring-2"
				aria-label="Toggle menu"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-6 w-6 transition-transform duration-200"
					class:rotate-90={isMenuOpen}
				>
					{#if isMenuOpen}
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					{:else}
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
						/>
					{/if}
				</svg>
			</button>
		</div>
	</div>

	<!-- Mobile Nav Drawer -->
	{#if isMenuOpen}
		<div
			transition:slide={{ duration: 200 }}
			class="border-surface-200 bg-surface-50 absolute left-0 right-0 border-b shadow-lg md:hidden"
		>
			<nav class="flex flex-col p-4">
				{#each navItems as [label, href] (href)}
					<a
						href={resolve(href)}
						class="hover:bg-surface-100 rounded-md py-3 px-4 text-base font-medium transition-colors {isActive(
							href
						)
							? 'text-primary bg-primary/5'
							: 'text-surface-800'}"
					>
						{label}
					</a>
				{/each}
			</nav>
		</div>
	{/if}
</header>
