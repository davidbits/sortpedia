export default function countingSort(arr: number[]): number[] {
	const n = arr.length;
	if (n === 0) return arr;

	let maxVal = arr[0];
	for (let i = 1; i < n; i++) {
		if (arr[i] > maxVal) {
			maxVal = arr[i];
		}
	}

	const cntArr = new Array(maxVal + 1).fill(0);

	for (let i = 0; i < n; i++) {
		cntArr[arr[i]]++;
	}

	for (let i = 1; i <= maxVal; i++) {
		cntArr[i] += cntArr[i - 1];
	}

	const output = new Array(n);
	for (let i = n - 1; i >= 0; i--) {
		const val = arr[i];
		const targetIndex = cntArr[val] - 1;
		cntArr[val]--;
		output[targetIndex] = val;
	}

	for (let i = 0; i < n; i++) {
		arr[i] = output[i];
	}

	return arr;
}
