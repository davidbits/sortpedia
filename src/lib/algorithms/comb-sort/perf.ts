export default function (arr: number[]): number[] {
	const n = arr.length;
	let gap = n;
	let swapped = true;

	while (gap !== 1 || swapped) {
		const newGap = Math.floor((gap * 10) / 13);
		gap = newGap < 1 ? 1 : newGap;

		swapped = false;

		for (let i = 0; i < n - gap; i++) {
			const j = i + gap;

			if (arr[i] > arr[j]) {
				// Swap elements
				const valI = arr[i];
				const valJ = arr[j];
				[arr[i], arr[j]] = [valJ, valI];

				swapped = true;
			}
		}
	}

	return arr;
}
