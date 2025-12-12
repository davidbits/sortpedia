function slowSortRecursive(A: number[], i: number, j: number): void {
	if (i >= j) {
		return;
	}

	const m = Math.floor((i + j) / 2);

	slowSortRecursive(A, i, m);
	slowSortRecursive(A, m + 1, j);

	if (A[j] < A[m]) {
		const temp = A[j];
		A[j] = A[m];
		A[m] = temp;
	}

	slowSortRecursive(A, i, j - 1);
}

export default function slowSort(arr: number[]): number[] {
	if (arr.length > 1) {
		slowSortRecursive(arr, 0, arr.length - 1);
	}
	return arr;
}
