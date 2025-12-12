import { QuantumEntropySource, QuantumRegister } from './tiny-quantum';

/**
 * The main entry point for the test harness script.
 */
function main() {
	console.log('=== 1. Physics Emulation: Superposition & Collapse ===');

	// Create a register with 2 Qubits initialized to |00>
	const qReg = new QuantumRegister(2);

	console.log('Initial State:');
	qReg.printState();

	// Apply Hadamard to Qubit 0 -> Creates state (|00> + |10>) / sqrt(2)
	// Note: C++ comment had a typo (|01>), the code correctly creates (|00> + |10>).
	// The state becomes 0.707|00> + 0.707|10>.
	console.log('Applying Hadamard to Qubit 0 (Superposition)...');
	qReg.applyHadamard(0);
	qReg.printState();

	// Measure Qubit 0
	console.log('Measuring Qubit 0...');
	const outcome = qReg.measure(0);
	console.log(`Measured Result: ${outcome}`);

	console.log('Post-Measurement State (Collapsed):');
	qReg.printState();

	console.log('\n=== 2. Quantum Entropy Source ===');

	console.log('Generating 10 random bits from quantum superposition:');
	const randomBits: boolean[] = [];
	for (let i = 0; i < 10; ++i) {
		randomBits.push(QuantumEntropySource.getBit());
	}
	// Convert boolean[] to number[] (0 or 1) and join for clean printing.
	console.log(randomBits.map((b) => (b ? 1 : 0)).join(' '));

	// The C++ version casts to int to avoid printing the ASCII character.
	// In TypeScript/JS, console.log handles numbers correctly by default.
	console.log(`Generating a random byte: ${QuantumEntropySource.getByte()}`);

	console.log('\n=== 3. Physics Emulation: Entanglement ===');

	// Create a 2-qubit register |00>
	const bellPair = new QuantumRegister(2);
	console.log('Initial State:');
	bellPair.printState();

	// 1. Apply Hadamard to qubit 0 to create superposition
	console.log('Applying H to qubit 0...');
	bellPair.applyHadamard(0);
	bellPair.printState();

	// 2. Apply CNOT with qubit 0 as control, qubit 1 as target
	console.log('Applying CNOT(0, 1)...');
	bellPair.applyCNOT(0, 1);
	console.log('Entangled Bell State:');
	bellPair.printState();

	// Now, measure one of the qubits
	console.log('Measuring just qubit 1...');
	const res = bellPair.measure(1);
	console.log(`Measured qubit 1, got: ${res}`);
	console.log('State after measuring qubit 1:');
	bellPair.printState();
}

// Run the main function
main();
