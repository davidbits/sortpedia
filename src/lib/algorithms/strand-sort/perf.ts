export default function (ip: number[]): number[] {
	const op: number[] = [];

	function sort(ip: number[]): void {
		if (ip.length === 0) return;

		const sublist: number[] = [];
		sublist.push(ip.shift()!);

		let i = 0;
		while (i < ip.length) {
			if (ip[i] > sublist[sublist.length - 1]) {
				sublist.push(ip[i]);
				ip.splice(i, 1);
			} else {
				i++;
			}
		}

		merge(op, sublist);

		sort(ip);
	}

	function merge(target: number[], source: number[]): void {
		let t = 0;
		while (source.length > 0) {
			if (t < target.length && target[t] <= source[0]) {
				t++;
			} else {
				target.splice(t, 0, source.shift()!);
				t++;
			}
		}
	}

	sort(ip);
	return op;
}
