export default function (arr: number[]): number[] {
	const n = arr.length;
	if (n <= 1) {
		return arr;
	}

	let isSorted = false;
	while (!isSorted) {
		isSorted = true;

		for (let i = 1; i < n - 1; i += 2) {
			if (arr[i] > arr[i + 1]) {
				[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
				isSorted = false;
			}
		}

		for (let i = 0; i < n - 1; i += 2) {
			if (arr[i] > arr[i + 1]) {
				[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
				isSorted = false;
			}
		}
	}

	return arr;
}
