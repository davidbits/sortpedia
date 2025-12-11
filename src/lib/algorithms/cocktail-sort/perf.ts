export default function (arr: number[]): number[] {
	let swapped = true;
	let start = 0;
	let end = arr.length;

	while (swapped) {
		swapped = false;

		// --- FORWARD PASS ---
		for (let i = start; i < end - 1; ++i) {
			if (arr[i] > arr[i + 1]) {
				[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
				swapped = true;
			}
		}

		// If no swaps occurred, the array is sorted.
		if (!swapped) break;
		end--;

		// --- BACKWARD PASS ---
		swapped = false;

		for (let i = end - 1; i >= start; i--) {
			if (arr[i] > arr[i + 1]) {
				[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
				swapped = true;
			}
		}

		start++;
	}

	return arr;
}
