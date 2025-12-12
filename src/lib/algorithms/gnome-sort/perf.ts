export default function (arr: number[]): number[] {
	let pos = 0;

	while (pos < arr.length) {
		if (pos === 0 || arr[pos] >= arr[pos - 1]) {
			pos++;
		} else {
			[arr[pos], arr[pos - 1]] = [arr[pos - 1], arr[pos]];
			pos--;
		}
	}

	return arr;
}
