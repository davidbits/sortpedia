<script lang="ts">
	import { resolve } from '$app/paths';
	import TextWithLatex from '$lib/components/TextWithLatex.svelte';
	import { Eye, Swords, Timer, BookOpen, Cpu, Network, FileCode } from 'lucide-svelte';
</script>

<svelte:head>
	<title>About SortPedia</title>
	<meta
		name="description"
		content="SortPedia is an educational project designed to demystify computer science algorithms through interactive visualizations."
	/>
	<meta property="og:title" content="About SortPedia" />
	<meta
		property="og:description"
		content="Learn about our mission to make computer science concepts accessible through interactive tools."
	/>
	<meta property="og:url" content="https://sortpedia.com/about" />
	<meta property="twitter:title" content="About SortPedia" />
	<meta
		property="twitter:description"
		content="Learn about our mission to make computer science concepts accessible through interactive tools."
	/>
</svelte:head>

<div class="mx-auto max-w-4xl pb-12">
	<!-- Hero Section -->
	<div class="prose prose-slate max-w-none mb-12 text-center md:text-left">
		<h1>About SortPedia</h1>
		<p class="lead text-xl text-surface-600">
			SortPedia is a modern, interactive encyclopedia of sorting algorithms. It bridges the gap
			between abstract computer science theory and intuitive visual understanding.
		</p>
	</div>

	<!-- Offerings Grid -->
	<h2 class="text-surface-900 mb-6 text-2xl font-bold">What We Offer</h2>

	<div class="not-prose grid gap-6 sm:grid-cols-2 mb-16">
		<!-- Feature 1 -->
		<div
			class="bg-surface-50 border-surface-200 hover:border-primary/30 rounded-xl border p-6 transition-all hover:-translate-y-1 hover:shadow-md"
		>
			<div
				class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600"
			>
				<Eye size={24} />
			</div>
			<h3 class="text-surface-900 mb-2 text-lg font-bold">Interactive Visualizer</h3>
			<p class="text-surface-600 text-sm leading-relaxed">
				Don't just read code—watch it execute. Step through algorithms in real-time, track memory
				accesses, and visualize how data moves through the array.
			</p>
		</div>

		<!-- Feature 2 -->
		<div
			class="bg-surface-50 border-surface-200 hover:border-primary/30 rounded-xl border p-6 transition-all hover:-translate-y-1 hover:shadow-md"
		>
			<div
				class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-600"
			>
				<Swords size={24} />
			</div>
			<h3 class="text-surface-900 mb-2 text-lg font-bold">Algorithm Racing</h3>
			<p class="text-surface-600 text-sm leading-relaxed">
				<TextWithLatex
					text="Compare algorithms side-by-side on identical datasets. Visually understand why $O(n \log n)$ vastly outperforms $O(n^2)$ as input sizes grow."
				/>
			</p>
		</div>

		<!-- Feature 3 -->
		<div
			class="bg-surface-50 border-surface-200 hover:border-primary/30 rounded-xl border p-6 transition-all hover:-translate-y-1 hover:shadow-md"
		>
			<div
				class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600"
			>
				<Timer size={24} />
			</div>
			<h3 class="text-surface-900 mb-2 text-lg font-bold">Performance Benchmarking</h3>
			<p class="text-surface-600 text-sm leading-relaxed">
				Run actual performance tests in your browser. Our multi-threaded engine allows you to
				measure raw execution time across averaged runs without freezing the UI.
			</p>
		</div>

		<!-- Feature 4 -->
		<div
			class="bg-surface-50 border-surface-200 hover:border-primary/30 rounded-xl border p-6 transition-all hover:-translate-y-1 hover:shadow-md"
		>
			<div
				class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600"
			>
				<BookOpen size={24} />
			</div>
			<h3 class="text-surface-900 mb-2 text-lg font-bold">Comprehensive Library</h3>
			<p class="text-surface-600 text-sm leading-relaxed">
				A dedicated wiki for over 30 algorithms. Includes clean implementations, mathematical
				complexity analysis, stability info, and historical context.
			</p>
		</div>
	</div>

	<!-- Content Split -->
	<div class="grid gap-12 md:grid-cols-2">
		<!-- Mission -->
		<div class="prose prose-slate">
			<h2>Our Mission</h2>
			<p>
				Sorting algorithms are often the "Hello World" of algorithm analysis, introducing crucial
				concepts like Big-O notation, Divide and Conquer, and memory management.
			</p>
			<p>
				However, static diagrams in textbooks often fail to convey the dynamic nature of how these
				algorithms manipulate memory. SortPedia aims to provide a "Single Source of Truth" for
				sorting knowledge, ensuring that students and enthusiasts have access to:
			</p>
			<ul>
				<li>Accurate, step-by-step visualizations.</li>
				<li>Real-time operation counting (comparisons, swaps).</li>
				<li>Clear, formatted mathematical explanations.</li>
			</ul>
		</div>

		<!-- Tech Stack -->
		<div>
			<h2 class="text-surface-900 mb-4 text-2xl font-bold">How it Works</h2>
			<div class="bg-surface-900 rounded-xl p-6 text-white shadow-lg">
				<p class="text-gray-300 mb-6 text-sm">
					SortPedia is built for performance and accuracy using modern web technologies.
				</p>

				<ul class="space-y-4">
					<li class="flex items-start gap-3">
						<Cpu class="mt-1 h-5 w-5 shrink-0 text-blue-400" />
						<div>
							<strong class="block text-white">Generators for State</strong>
							<span class="text-gray-400 text-sm">
								Algorithms are implemented as Generator Functions, yielding execution control at
								every step to allow for frame-perfect pausing and rewinding.
							</span>
						</div>
					</li>
					<li class="flex items-start gap-3">
						<Network class="mt-1 h-5 w-5 shrink-0 text-purple-400" />
						<div>
							<strong class="block text-white">Web Workers</strong>
							<span class="text-gray-400 text-sm">
								Heavy computations and benchmarks run off the main thread, keeping the animations
								smooth at 60fps even during intense sorting.
							</span>
						</div>
					</li>
					<li class="flex items-start gap-3">
						<FileCode class="mt-1 h-5 w-5 shrink-0 text-yellow-400" />
						<div>
							<strong class="block text-white">Strict TypeScript</strong>
							<span class="text-gray-400 text-sm">
								Built with strict type safety to ensure implementation accuracy and codebase
								maintainability.
							</span>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>

	<!-- CTA -->
	<div class="mt-16 text-center">
		<a
			href={resolve('/library')}
			class="bg-primary hover:bg-primary-dark inline-flex items-center justify-center rounded-lg px-8 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
		>
			Start Exploring
		</a>
	</div>
</div>
