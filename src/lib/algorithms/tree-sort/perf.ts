class Node {
	value: number;
	originalIndex: number;
	left: Node | null = null;
	right: Node | null = null;

	constructor(value: number, originalIndex: number) {
		this.value = value;
		this.originalIndex = originalIndex;
	}
}

export default function treeSort(arr: number[]): number[] {
	const n = arr.length;
	if (n <= 1) {
		return arr;
	}

	let root: Node | null = null;

	for (let i = 0; i < n; i++) {
		const valueToInsert = arr[i];
		root = insert(root, valueToInsert, i);
	}

	const sortedIndexTracker = { index: 0 };
	inorder(root, arr, sortedIndexTracker);

	return arr;
}

function insert(node: Node | null, value: number, originalIndex: number): Node {
	if (node === null) {
		return new Node(value, originalIndex);
	}

	if (value < node.value) {
		node.left = insert(node.left, value, originalIndex);
	} else {
		node.right = insert(node.right, value, originalIndex);
	}

	return node;
}

function inorder(node: Node | null, arr: number[], tracker: { index: number }): void {
	if (node === null) {
		return;
	}

	inorder(node.left, arr, tracker);

	const targetIndex = tracker.index;

	arr[targetIndex] = node.value;

	tracker.index++;

	inorder(node.right, arr, tracker);
}
