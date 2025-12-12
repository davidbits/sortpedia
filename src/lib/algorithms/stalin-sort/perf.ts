export default function stalinSort(arr: number[]): number[] {
	if (arr.length === 0) {
		return [];
	}

	const sortedArr = [arr[0]];

	for (let i = 1; i < arr.length; i++) {
		if (arr[i] >= sortedArr[sortedArr.length - 1]) {
			sortedArr.push(arr[i]);
		}
	}
	return sortedArr;
}
