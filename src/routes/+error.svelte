<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>{page.status} - SortPedia</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="flex flex-col items-center justify-center py-20 text-center">
	<h1 class="text-8xl font-extrabold tracking-tight text-primary">{page.status}</h1>
	<h2 class="mt-2 text-3xl font-bold text-surface-900">
		{page.status === 404 ? 'Page Not Found' : 'Something Went Wrong'}
	</h2>
	<p class="text-surface-800 mt-4 max-w-md">
		{page.error?.message ||
			"Sorry, we couldn't find the page you're looking for. It might have been moved or removed."}
	</p>

	<div class="mt-10">
		<a
			href={resolve('/')}
			class="bg-primary hover:bg-primary-dark rounded-md px-6 py-3 font-medium text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
		>
			Return to Homepage
		</a>
	</div>
</div>
