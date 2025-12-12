export default function (arr: number[]): number[] {
	for (let i = 1; i < arr.length; i++) {
		const key = arr[i];
		let low = 0;
		let high = i - 1;

		while (low <= high) {
			const mid = Math.floor((low + high) / 2);

			if (arr[mid] <= key) {
				low = mid + 1;
			} else {
				high = mid - 1;
			}
		}
		for (let j = i - 1; j >= low; j--) {
			arr[j + 1] = arr[j];
		}

		if (low !== i) {
			arr[low] = key;
		}
	}

	return arr;
}
