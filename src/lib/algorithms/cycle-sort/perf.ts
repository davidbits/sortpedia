export default function (arr: number[]): number[] {
	const n = arr.length;

	for (let cycleStart = 0; cycleStart <= n - 2; cycleStart++) {
		let item = arr[cycleStart];
		let pos = findPosition(arr, item, cycleStart, n);

		if (pos === cycleStart) {
			continue;
		}

		pos = skipDuplicates(arr, item, pos);
		[arr[pos], item] = [item, arr[pos]];

		while (pos !== cycleStart) {
			pos = findPosition(arr, item, cycleStart, n);
			pos = skipDuplicates(arr, item, pos);

			if (item !== arr[pos]) {
				[arr[pos], item] = [item, arr[pos]];
			}
		}
	}

	return arr;
}

function findPosition(arr: number[], item: number, start: number, n: number): number {
	let pos = start;
	for (let i = start + 1; i < n; i++) {
		if (arr[i] < item) {
			pos++;
		}
	}
	return pos;
}

function skipDuplicates(arr: number[], item: number, pos: number): number {
	while (item === arr[pos]) {
		pos++;
	}
	return pos;
}
