/**
 * Recursive helper for Stooge Sort.
 * @param arr The array to sort.
 * @param l The starting index.
 * @param h The ending index.
 */
function stoogeSortRecursive(arr: number[], l: number, h: number): void {
	if (l >= h) {
		return;
	}

	if (arr[l] > arr[h]) {
		const temp = arr[l];
		arr[l] = arr[h];
		arr[h] = temp;
	}

	const size = h - l + 1;
	if (size > 2) {
		const t = Math.floor(size / 3);
		stoogeSortRecursive(arr, l, h - t);
		stoogeSortRecursive(arr, l + t, h);

		stoogeSortRecursive(arr, l, h - t);
	}
}

/**
 * Main function for Stooge Sort for performance benchmarking.
 * @param arr The array to be sorted.
 * @returns The sorted array.
 */
export default function stoogeSort(arr: number[]): number[] {
	stoogeSortRecursive(arr, 0, arr.length - 1);
	return arr;
}
