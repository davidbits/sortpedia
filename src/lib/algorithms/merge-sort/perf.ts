export default function (arr: number[]): number[] {
	if (arr.length <= 1) return arr;

	const aux = [...arr];
	mergeSortHelper(arr, 0, arr.length - 1, aux);
	return arr;
}

function mergeSortHelper(arr: number[], left: number, right: number, aux: number[]): void {
	if (left >= right) return;
	const mid = Math.floor(left + (right - left) / 2);
	mergeSortHelper(aux, left, mid, arr);
	mergeSortHelper(aux, mid + 1, right, arr);
	merge(arr, aux, left, mid, right);
}

function merge(arr: number[], aux: number[], left: number, mid: number, right: number): void {
	let i = left;
	let j = mid + 1;
	let k = left;

	while (i <= mid && j <= right) {
		if (aux[i] <= aux[j]) {
			arr[k++] = aux[i++];
		} else {
			arr[k++] = aux[j++];
		}
	}

	while (i <= mid) {
		arr[k++] = aux[i++];
	}

	while (j <= right) {
		arr[k++] = aux[j++];
	}
}
