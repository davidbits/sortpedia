export default function thanosSort(arr: number[]): number[] {
	let current = [...arr];

	while (current.length > 0) {
		let isSorted = true;

		for (let i = 0; i < current.length - 1; i++) {
			if (current[i] > current[i + 1]) {
				isSorted = false;
				break;
			}
		}

		if (isSorted) {
			return current;
		}

		const countToKeep = Math.ceil(current.length / 2);

		current = current
			.map((value) => ({ value, sort: Math.random() }))
			.sort((a, b) => a.sort - b.sort)
			.slice(0, countToKeep)
			.map((item) => item.value);
	}

	return current;
}
