export default function selectionSort(arr: number[]): number[] {
	const n = arr.length;
	for (let i = 0; i < n - 1; i++) {
		let minIdx = i;

		// Find minimum
		for (let j = i + 1; j < n; j++) {
			if (arr[j] < arr[minIdx]) {
				minIdx = j;
			}
		}

		// Swap if needed
		if (minIdx !== i) {
			const temp = arr[i];
			arr[i] = arr[minIdx];
			arr[minIdx] = temp;
		}
	}
	return arr;
}
