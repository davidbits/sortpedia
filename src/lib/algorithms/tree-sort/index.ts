import type { SortEvent } from '../types';

// Define the Node for our Binary Search Tree.
// It stores the value and the original index for visualization purposes.
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

/**
 * Main generator function for Tree Sort.
 * @param arr The array to be sorted.
 */
export default function* (arr: number[]): Generator<SortEvent> {
	// Confirmed correct implementation
	// https://www.geeksforgeeks.org/dsa/tree-sort/
	const n = arr.length;
	if (n <= 1) {
		if (n === 1) yield { type: 'sorted', indices: [0] };
		return;
	}

	let root: Node | null = null;

	// --- Phase 1: Build the Binary Search Tree ---
	// Iterate through the input array and insert each element into the tree.
	for (let i = 0; i < n; i++) {
		const valueToInsert = arr[i];
		// The insert helper is a generator that yields comparison events.
		root = yield* insert(root, valueToInsert, i);
	}

	// --- Phase 2: In-order Traversal and Array Update ---
	// Use an object to pass the sorted index by reference through recursion.
	const sortedIndexTracker = { index: 0 };
	// The inorder helper is a generator that yields write and sorted events.
	yield* inorder(root, arr, sortedIndexTracker);
}

/**
 * A recursive generator function to insert a new value into the BST.
 * It yields 'compare' events for visualization as it traverses the tree.
 * @param node - The current node in the traversal.
 * @param value - The value to insert.
 * @param originalIndex - The original index of the value in the input array.
 * @returns The (potentially new) root of the subtree.
 */
function* insert(
	node: Node | null,
	value: number,
	originalIndex: number
): Generator<SortEvent, Node> {
	// Base case: If the current node is null, we've found the insertion point.
	if (node === null) {
		return new Node(value, originalIndex);
	}

	// Yield a comparison event between the element being inserted and the current node.
	yield { type: 'compare', indices: [originalIndex, node.originalIndex] };

	// Recur down the tree. Duplicates are placed in the right subtree.
	if (value < node.value) {
		node.left = yield* insert(node.left, value, originalIndex);
	} else {
		node.right = yield* insert(node.right, value, originalIndex);
	}

	return node;
}

/**
 * A recursive generator function to perform an in-order traversal of the BST.
 * It yields 'write' and 'sorted' events as it places elements back into the array.
 * @param node - The current node in the traversal.
 * @param arr - The original array to be overwritten with sorted values.
 * @param tracker - An object holding the current index for placing sorted elements.
 */
function* inorder(
	node: Node | null,
	arr: number[],
	tracker: { index: number }
): Generator<SortEvent> {
	if (node === null) {
		return;
	}

	// 1. Traverse the left subtree.
	yield* inorder(node.left, arr, tracker);

	// 2. Process the current node.
	const targetIndex = tracker.index;
	const valueToWrite = node.value;

	// Overwrite the element at the current sorted position in the array.
	arr[targetIndex] = valueToWrite;
	yield { type: 'write', indices: [targetIndex], value: valueToWrite };

	// Mark this position as sorted.
	yield { type: 'sorted', indices: [targetIndex] };

	// Increment the sorted position index for the next element.
	tracker.index++;

	// 3. Traverse the right subtree.
	yield* inorder(node.right, arr, tracker);
}
