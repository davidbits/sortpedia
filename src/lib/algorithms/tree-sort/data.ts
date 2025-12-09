import type { AlgorithmInfo } from '../types';

export const data: AlgorithmInfo = {
	id: 'tree-sort',
	name: 'Tree Sort',
	category: 'Tree',
	complexity: {
		best: 'O(n \\log n)',
		average: 'O(n \\log n)',
		worst: 'O(n^2)',
		space: 'O(n)'
	},
	stable: false,
	inPlace: false,
	adaptive: false,
	description:
		'A sorting algorithm that builds a Binary Search Tree (BST) from the input elements and then performs an in-order traversal to retrieve the elements in sorted order.',
	details: {
		summary:
			'Tree Sort operates in two main phases. First, it iterates through the input array, inserting each element into a Binary Search Tree. A BST has the property that for any given node, all values in its left subtree are smaller, and all values in its right subtree are greater or equal. The second phase involves performing an in-order traversal of the BST (visiting the left subtree, then the node itself, then the right subtree), which naturally visits the nodes in ascending order. The values are then placed back into the original array, resulting in a sorted list.',
		steps: [
			'**1. Initialize:** Create an empty Binary Search Tree (BST).',
			'**2. Build Tree:** Iterate through the input array from the first to the last element. For each element, insert it into the BST according to the rules: smaller values go left, larger or equal values go right.',
			'**3. In-order Traversal:** Once all elements are inserted, perform a recursive in-order traversal starting from the root of the tree.',
			'**4. Overwrite Array:** As each node is visited during the traversal, take its value and place it into the original array, starting from the first index. This overwrites the original unsorted array with the new sorted sequence.'
		],
		advantages: [
			'**Efficient on Average:** Provides an average time complexity of $O(n \\log n)$, which is very efficient for a comparison sort.',
			'**Naturally Online:** It can sort elements as they arrive (online sorting). After any number of insertions, the elements seen so far can be retrieved in sorted order at any time.',
			'**Simple Concept:** The underlying logic of using a BST and in-order traversal is conceptually straightforward.'
		],
		disadvantages: [
			'**Worst-Case Performance:** Degrades to $O(n^2)$ if the BST becomes unbalanced (degenerate), which can happen with already sorted or nearly sorted input.',
			'**High Space Complexity:** Requires $O(n)$ additional space to store the tree structure, unlike in-place algorithms like Quicksort or Heapsort.',
			'**Implementation Overhead:** Involves pointer manipulation and recursion, which can have higher constant-factor overhead than array-based sorts.'
		],
		javascript: `class Node {
  constructor(value) {
    this.key = value;
    this.left = null;
    this.right = null;
  }
}

function insert(root, key) {
  if (root === null) {
    return new Node(key);
  }
  // Place duplicates in the right subtree
  if (key < root.key) {
    root.left = insert(root.left, key);
  } else {
    root.right = insert(root.right, key);
  }
  return root;
}

function storeSorted(root, arr, index) {
  if (root !== null) {
    // Recur on left child
    index = storeSorted(root.left, arr, index);
    
    // Copy root's key
    arr[index] = root.key;
    index++; // update index for next insertion
    
    // Recur on right child
    index = storeSorted(root.right, arr, index);
  }
  return index;
}

function treeSort(arr) {
  let root = null;
  
  // 1. Build the BST
  for (const value of arr) {
    root = insert(root, value);
  }
  
  // 2. Store in-order traversal of the BST in arr
  let i = 0;
  storeSorted(root, arr, i);
  
  return arr;
}`,
		funFacts: [
			'The worst-case performance of Tree Sort can be improved to a guaranteed $O(n \\log n)$ by using a self-balancing binary search tree, such as an AVL tree or a Red-Black tree.',
			'Tree sort is closely related to Quicksort. Both algorithms recursively partition elements based on a pivot. In Quicksort, the pivot is chosen explicitly; in Tree Sort, the "pivot" is implicitly the root of the current subtree.',
			'If you use a Splay Tree instead of a standard BST, the resulting algorithm (Splaysort) becomes an adaptive sort, meaning it runs faster than $O(n \\log n)$ for inputs that are already nearly sorted.'
		]
	}
};
