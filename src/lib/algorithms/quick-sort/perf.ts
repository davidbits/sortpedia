export default function quickSort(arr: number[]): number[] {
	quickSortHelper(arr, 0, arr.length - 1);
	return arr;
}

function quickSortHelper(arr: number[], low: number, high: number): void {
	if (low < high) {
		const pivotIndex = partition(arr, low, high);
		quickSortHelper(arr, low, pivotIndex - 1);
		quickSortHelper(arr, pivotIndex + 1, high);
	}
}

function partition(arr: number[], low: number, high: number): number {
	const pivot = arr[high];
	let i = low;

	for (let j = low; j < high; j++) {
		if (arr[j] < pivot) {
			[arr[i], arr[j]] = [arr[j], arr[i]];
			i++;
		}
	}

	[arr[i], arr[high]] = [arr[high], arr[i]];
	return i;
}
