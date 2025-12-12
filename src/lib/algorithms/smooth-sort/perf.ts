function ntz(n: bigint): number {
	if (n === 0n) return 0;
	let count = 0;
	while ((n & 1n) === 0n) {
		n >>= 1n;
		count++;
	}
	return count;
}

function pntz(p: bigint): number {
	return ntz(p - 1n);
}

function cycle(arr: number[], arIndices: number[], n: number): void {
	if (n < 2) return;

	const temp = arr[arIndices[0]];

	for (let i = 0; i < n - 1; i++) {
		const sourceVal = arr[arIndices[i + 1]];
		const targetIdx = arIndices[i];

		arr[targetIdx] = sourceVal;
	}

	const finalIdx = arIndices[n - 1];
	arr[finalIdx] = temp;
}

function sift(arr: number[], head: number, pshift: number, lp: number[], buffer: number[]): void {
	let rt: number;
	let lf: number;
	let i = 1;

	buffer[0] = head;

	while (pshift > 1) {
		rt = head - 1;
		lf = head - 1 - lp[pshift - 2];

		if (arr[buffer[0]] >= arr[lf] && arr[buffer[0]] >= arr[rt]) {
			break;
		}

		if (arr[lf] >= arr[rt]) {
			buffer[i++] = lf;
			head = lf;
			pshift -= 1;
		} else {
			buffer[i++] = rt;
			head = rt;
			pshift -= 2;
		}
	}
	cycle(arr, buffer, i);
}

function trinkle(
	arr: number[],
	head: number,
	pp: bigint,
	pshift: number,
	trusty: boolean,
	lp: number[],
	buffer: number[]
): void {
	let stepson: number;
	let rt: number;
	let lf: number;
	let p = pp;
	let i = 1;
	let trail: number;

	buffer[0] = head;

	while (p !== 1n) {
		stepson = head - lp[pshift];

		if (arr[stepson] <= arr[buffer[0]]) {
			break;
		}

		if (!trusty && pshift > 1) {
			rt = head - 1;
			lf = head - 1 - lp[pshift - 2];

			if (arr[rt] >= arr[stepson] && arr[lf] >= arr[stepson]) {
				break;
			}
		}

		buffer[i++] = stepson;
		head = stepson;
		trail = pntz(p);
		p >>= BigInt(trail);
		pshift += trail;
		trusty = false;
	}

	if (!trusty) {
		cycle(arr, buffer, i);
		sift(arr, head, pshift, lp, buffer);
	}
}

export default function smoothSort(arr: number[]): number[] {
	const nel = arr.length;
	if (nel === 0) return arr;

	const lp: number[] = [1, 1];
	let i = 2;
	while (true) {
		const next = lp[i - 2] + lp[i - 1] + 1;
		if (next >= nel) break;
		lp[i] = next;
		i++;
	}

	const buffer = new Array(128);

	let head = 0;
	const high = nel - 1;
	let p = 1n;
	let pshift = 1;
	let trail: number;

	while (head < high) {
		if ((p & 3n) === 3n) {
			sift(arr, head, pshift, lp, buffer);
			p >>= 2n;
			pshift += 2;
		} else {
			if (lp[pshift - 1] >= high - head) {
				trinkle(arr, head, p, pshift, false, lp, buffer);
			} else {
				sift(arr, head, pshift, lp, buffer);
			}

			if (pshift === 1) {
				p <<= 1n;
				pshift = 0;
			} else {
				p <<= BigInt(pshift - 1);
				pshift = 1;
			}
		}
		p |= 1n;
		head++;
	}

	trinkle(arr, head, p, pshift, false, lp, buffer);

	while (pshift !== 1 || p !== 1n) {
		if (pshift <= 1) {
			trail = pntz(p);
			p >>= BigInt(trail);
			pshift += trail;
		} else {
			p <<= 2n;
			pshift -= 2;
			p ^= 7n;
			p >>= 1n;
			trinkle(arr, head - lp[pshift] - 1, p, pshift + 1, true, lp, buffer);
			p <<= 1n;
			p |= 1n;
			trinkle(arr, head - 1, p, pshift, true, lp, buffer);
		}
		head--;
	}

	return arr;
}
