export default function (arr: number[]): number[] {
	const n = arr.length;

	function performFlip(k: number): void {
		let start = 0;
		let end = k;

		while (start < end) {
			[arr[start], arr[end]] = [arr[end], arr[start]];
			start++;
			end--;
		}
	}

	for (let curr_size = n; curr_size > 1; curr_size--) {
		let mi = 0;

		for (let i = 1; i < curr_size; i++) {
			if (arr[i] > arr[mi]) {
				mi = i;
			}
		}

		if (mi !== curr_size - 1) {
			if (mi > 0) {
				performFlip(mi);
			}
			performFlip(curr_size - 1);
		}
	}

	return arr;
}
