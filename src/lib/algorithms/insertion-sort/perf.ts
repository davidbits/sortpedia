export default function insertionSort(arr: number[]): number[] {
	const n = arr.length;
	for (let i = 1; i < n; i++) {
		const key = arr[i];
		let j = i - 1;

		// Standard optimized insertion loop
		while (j >= 0 && arr[j] > key) {
			arr[j + 1] = arr[j];
			j--;
		}
		arr[j + 1] = key;
	}
	return arr;
}
