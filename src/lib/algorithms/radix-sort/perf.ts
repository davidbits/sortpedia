export default function (arr: number[]): number[] {
	const n = arr.length;
	if (n === 0) return arr;

	const maxVal = Math.max(...arr);

	for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
		const count = new Array(10).fill(0);

		for (const num of arr) {
			count[Math.floor(num / exp) % 10]++;
		}

		for (let i = 1; i < 10; i++) {
			count[i] += count[i - 1];
		}

		const output = new Array(arr.length);
		for (let i = arr.length - 1; i >= 0; i--) {
			const digit = Math.floor(arr[i] / exp) % 10;
			output[--count[digit]] = arr[i];
		}

		for (let i = 0; i < arr.length; i++) {
			arr[i] = output[i];
		}
	}

	return arr;
}
