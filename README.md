# SortPedia

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=flat&logo=svelte&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)

**SortPedia** is a modern, interactive encyclopedia of sorting algorithms. It bridges the gap between abstract computer
science theory and intuitive visual understanding.

From industry standards like **Quick Sort** and **Merge Sort** to chaotic esoteric algorithms like **Thanos Sort** and \*
\*Quantum Bogo Sort\*\*, SortPedia lets you watch, race, and benchmark them all.

## Features

### 1. Interactive Visualizer

Watch algorithms process data step-by-step.

- **Control Time:** Pause, play, step forward/backward, and adjust speed.
- **Live Metrics:** Track comparisons, swaps, and array accesses in real-time.
- **Code Highlighting:** See exactly which line of code is executing.

### 2. Algorithm Racinng

Compare two algorithms side-by-side on identical datasets.

- Visualize how $O(n^2)$ differs from $O(n \log n)$ visually.
- Spot differences in stability and access patterns.

### 3. Performance Benchmarking

Run actual performance tests in your browser.

- Measure raw execution time (ms) across thousands of iterations.
- Uses **Web Workers** to prevent UI freezing during heavy computations.

### 4. Comprehensive Library

A dedicated wiki for every algorithm.

- **Complexity Analysis:** Best, Average, and Worst-case time/space complexity rendered with $\LaTeX$.
- **Deep Dives:** Explanations of stability, adaptivity, and in-place sorting.
- **Implementation:** Clean, copy-pasteable TypeScript/JavaScript implementations.

## Supported Algorithms

SortPedia currently implements **31 algorithms**, from industry standards to esoteric jokes.
Each is visualized with detailed explanations of its properties. See the full list [below](#implemented-algorithms).

## Tech Stack

- **Framework:** SvelteKit (Svelte 5 Runes)
- **Language:** TypeScript
- **Styling:** TailwindCSS (v4)
- **Math Rendering:** KaTeX
- **Architecture:**
  - **Web Workers:** Heavy sorting logic runs off the main thread.
  - **Generators:** Algorithms are implemented as generator functions to yield exact steps for visualization.

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended)

### Installation

```bash
git clone https://github.com/astraen-dev/sortpedia.git
cd sortpedia
pnpm install
pnpm dev --open
```

## Contributing

We welcome new sorting algorithms!

1. Create a folder in `src/lib/algorithms/` with the algorithm name.
2. Implement `data.ts` (metadata), `index.ts` (generator logic), and `perf.ts` (raw performance logic if bounded worst
   case).
3. Open a Pull Request.

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

## Implemented Algorithms

| Algorithm               |                                               Languages                                               |
| :---------------------- | :---------------------------------------------------------------------------------------------------: |
| Binary Insertion Sort   | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Bogo Sort               | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Bogobogo Sort           | ![TypeScript](https://img.shields.io/badge/-3178C6?style=flat-square&logo=typescript&logoColor=white) |
| Bozo Sort               | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Bubble Sort             | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Cocktail Sort           | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Comb Sort               | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Counting Sort           | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Cycle Sort              | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Gnome Sort              | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Heap Sort               | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Insertion Sort          | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Intelligent Design Sort | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Intro Sort              | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Merge Sort              | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Miracle Sort            | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Odd-Even Sort           | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Pancake Sort            | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Patience Sort           | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Quantum Bogo Sort       | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Quick Sort              | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Radix Sort              | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Selection Sort          | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Shell Sort              | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Slow Sort               | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Smooth Sort             | ![TypeScript](https://img.shields.io/badge/-3178C6?style=flat-square&logo=typescript&logoColor=white) |
| Stalin Sort             | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Stooge Sort             | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Strand Sort             | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Thanos Sort             | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| Tree Sort               | ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
