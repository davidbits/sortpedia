export default function bubbleSort(arr: number[]): number[] {
	const n = arr.length;
	let swapped = false;

	for (let i = 0; i < n - 1; i++) {
		swapped = false;
		for (let j = 0; j < n - i - 1; j++) {
			if (arr[j] > arr[j + 1]) {
				// Swap
				const temp = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = temp;
				swapped = true;
			}
		}
		// Optimization: stop if array is sorted
		if (!swapped) break;
	}
	return arr;
}
