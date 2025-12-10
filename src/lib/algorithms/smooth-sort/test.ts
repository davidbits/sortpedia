import smoothSort from './index';

/**
 * Helper to simulate the worker/visualizer relationship.
 * It consumes the generator and applies mutations to the array.
 */
function executeSort(arr: number[]) {
	const generator = smoothSort(arr);
	for (const event of generator) {
		// New System: Mutations are explicit in the 'writes' map
		if (event.writes) {
			for (const indexStr of Object.keys(event.writes)) {
				const index = Number(indexStr);
				arr[index] = event.writes[index];
			}
		}
	}
}

function runTests() {
	console.log('Starting SmoothSort (Generator) Verification Tests...\n');

	let passed = 0;
	let total = 0;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const assert = (desc: string, actual: any, expected: any) => {
		total++;
		const actStr = JSON.stringify(actual);
		const expStr = JSON.stringify(expected);
		if (actStr === expStr) {
			console.log(`✅ ${desc}`);
			passed++;
		} else {
			console.error(`❌ ${desc}`);
			console.error(`   Expected: ${expStr}`);
			console.error(`   Actual:   ${actStr}`);
		}
	};

	const numCmp = (a: number, b: number) => a - b;

	// 1. Basic Integer Array
	const arr1 = [5, 2, 9, 1, 5, 6];
	const exp1 = [...arr1].sort(numCmp);
	executeSort(arr1);
	assert('Basic Integer Sort', arr1, exp1);

	// 2. Empty Array
	const arr2: number[] = [];
	const exp2: number[] = [];
	executeSort(arr2);
	assert('Empty Array', arr2, exp2);

	// 3. Single Element
	const arr3 = [42];
	const exp3 = [42];
	executeSort(arr3);
	assert('Single Element', arr3, exp3);

	// 4. Two Elements (Already Sorted)
	const arr4 = [1, 2];
	const exp4 = [1, 2];
	executeSort(arr4);
	assert('Two Elements (Sorted)', arr4, exp4);

	// 5. Two Elements (Reversed)
	const arr5 = [2, 1];
	const exp5 = [1, 2];
	executeSort(arr5);
	assert('Two Elements (Reversed)', arr5, exp5);

	// 6. All Duplicates
	const arr6 = [5, 5, 5, 5, 5];
	const exp6 = [5, 5, 5, 5, 5];
	executeSort(arr6);
	assert('All Duplicates', arr6, exp6);

	// 7. Negative Numbers
	const arr7 = [-5, -10, 0, 5, 2];
	const exp7 = [-10, -5, 0, 2, 5];
	executeSort(arr7);
	assert('Negative Numbers', arr7, exp7);

	// 8. Large Numbers / Infinity
	const arr8 = [Infinity, -Infinity, 1000000, -500];
	const exp8 = [-Infinity, -500, 1000000, Infinity];
	executeSort(arr8);
	assert('Infinity Handling', arr8, exp8);

	// Note: Object tests (9 & 10) removed as the visualizer implementation
	// is strictly typed for number[] to support SharedArrayBuffer/Worker optimization.

	// ==========================================
	// FUZZ TESTING
	// ==========================================
	console.log('\nStarting Fuzz Testing (Randomized Arrays)...');

	let fuzzFailures = 0;
	const NUM_FUZZ_TESTS = 100;
	const MAX_ARRAY_SIZE = 5000;

	for (let i = 0; i < NUM_FUZZ_TESTS; i++) {
		// Random size between 0 and MAX_ARRAY_SIZE
		const size = Math.floor(Math.random() * MAX_ARRAY_SIZE);
		const testArr: number[] = [];

		for (let j = 0; j < size; j++) {
			// Random integers
			testArr.push(Math.floor(Math.random() * 10000) - 5000);
		}

		// Create a copy for the control (native sort)
		const controlArr = [...testArr];

		// Execute sorts
		controlArr.sort(numCmp);
		try {
			executeSort(testArr);
		} catch (e) {
			console.error(`❌ Fuzz Test crashed on iteration ${i} with size ${size}`);
			console.error(e);
			fuzzFailures++;
			break;
		}

		// Compare
		let mismatch = false;
		if (testArr.length !== controlArr.length) {
			mismatch = true;
		} else {
			for (let k = 0; k < size; k++) {
				if (testArr[k] !== controlArr[k]) {
					mismatch = true;
					break;
				}
			}
		}

		if (mismatch) {
			fuzzFailures++;
			console.error(`❌ Fuzz Test Failed on iteration ${i}`);
			console.error(`Size: ${size}`);
			console.error('Expected (first 10):', controlArr.slice(0, 10));
			console.error('Actual (first 10):', testArr.slice(0, 10));
			break; // Stop on first failure
		}
	}

	if (fuzzFailures === 0) {
		console.log(`✅ Passed ${NUM_FUZZ_TESTS} randomized fuzz tests.`);
		passed++;
	} else {
		total++;
	}

	console.log(`\nFinal Result: ${passed} / ${total + 1} checks passed.`);
}

// Execute
runTests();
