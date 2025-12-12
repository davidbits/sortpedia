export default function sorter(arr: number[]): number[] {
	const n = arr.length;

	for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
		for (let i = gap; i < n; i++) {
			const temp = arr[i];
			let j = i;

			while (j >= gap && arr[j - gap] > temp) {
				arr[j] = arr[j - gap];
				j -= gap;
			}

			if (j !== i) {
				arr[j] = temp;
			}
		}
	}

	return arr;
}
