export default function introSort(arr: number[]): number[] {
	const n = arr.length;
	const depthLimit = 2 * Math.floor(Math.log2(n));

	introSortUtil(arr, 0, n - 1, depthLimit);

	return arr;
}

function introSortUtil(arr: number[], begin: number, end: number, depthLimit: number): void {
	const size = end - begin + 1;

	if (size < 16) {
		insertionSort(arr, begin, end);
		return;
	}

	if (depthLimit === 0) {
		heapSort(arr, begin, end);
		return;
	}

	const pivotIndex = medianOfThree(arr, begin, begin + Math.floor(size / 2), end);

	[arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];

	const partitionPoint = partition(arr, begin, end);

	introSortUtil(arr, begin, partitionPoint - 1, depthLimit - 1);
	introSortUtil(arr, partitionPoint + 1, end, depthLimit - 1);
}

function insertionSort(arr: number[], left: number, right: number): void {
	for (let i = left + 1; i <= right; i++) {
		const key = arr[i];
		let j = i - 1;

		while (j >= left && arr[j] > key) {
			arr[j + 1] = arr[j];
			j--;
		}
		arr[j + 1] = key;
	}
}

function heapSort(arr: number[], low: number, high: number): void {
	const n = high - low + 1;

	for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
		heapify(arr, n, i, low);
	}

	for (let i = n - 1; i > 0; i--) {
		[arr[low], arr[low + i]] = [arr[low + i], arr[low]];
		heapify(arr, i, 0, low);
	}
}

function heapify(arr: number[], n: number, i: number, low: number): void {
	let largest = i;
	const l = 2 * i + 1;
	const r = 2 * i + 2;
	const absI = low + i;

	if (l < n && arr[low + l] > arr[low + largest]) {
		largest = l;
	}

	if (r < n && arr[low + r] > arr[low + largest]) {
		largest = r;
	}

	if (largest !== i) {
		const absLargest = low + largest;
		[arr[absI], arr[absLargest]] = [arr[absLargest], arr[absI]];

		heapify(arr, n, largest, low);
	}
}

function medianOfThree(arr: number[], a: number, b: number, d: number): number {
	const A = arr[a];
	const B = arr[b];
	const C = arr[d];

	if ((A <= B && B <= C) || (C <= B && B <= A)) return b;
	if ((B <= A && A <= C) || (C <= A && A <= B)) return a;
	if ((B <= C && C <= A) || (A <= C && C <= B)) return d;

	return b;
}

function partition(arr: number[], low: number, high: number): number {
	const pivot = arr[high];
	let i = low;

	for (let j = low; j < high; j++) {
		if (arr[j] <= pivot) {
			[arr[i], arr[j]] = [arr[j], arr[i]];
			i++;
		}
	}

	[arr[i], arr[high]] = [arr[high], arr[i]];

	return i;
}
