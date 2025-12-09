/**
 * A direct and faithful port of the TinyQuantum C++ library to TypeScript.
 * This implementation provides a simple quantum circuit simulator.
 */

/**
 * Represents a complex number with real and imaginary parts.
 * A necessary utility class as TypeScript has no built-in complex number type.
 */
class Complex {
	constructor(
		public real: number = 0,
		public imag: number = 0
	) {}

	/**
	 * Adds two complex numbers.
	 * @param other The complex number to add.
	 * @returns A new Complex number representing the sum.
	 */
	add(other: Complex): Complex {
		return new Complex(this.real + other.real, this.imag + other.imag);
	}

	/**
	 * Subtracts another complex number from this one.
	 * @param other The complex number to subtract.
	 * @returns A new Complex number representing the difference.
	 */
	subtract(other: Complex): Complex {
		return new Complex(this.real - other.real, this.imag - other.imag);
	}

	/**
	 * Multiplies this complex number by a scalar value.
	 * @param scalar The scalar to multiply by.
	 * @returns A new Complex number representing the scaled value.
	 */
	multiplyByScalar(scalar: number): Complex {
		return new Complex(this.real * scalar, this.imag * scalar);
	}

	/**
	 * Calculates the norm (squared magnitude) of the complex number.
	 * This corresponds to `std::norm` in C++ and is equivalent to `real² + imag²`.
	 * @returns The norm of the complex number.
	 */
	norm(): number {
		return this.real * this.real + this.imag * this.imag;
	}

	/**
	 * Returns a string representation of the complex number.
	 */
	toString(): string {
		if (Math.abs(this.imag) < 1e-9) {
			return this.real.toFixed(4);
		}
		if (Math.abs(this.real) < 1e-9) {
			return `${this.imag.toFixed(4)}i`;
		}
		const sign = this.imag > 0 ? '+' : '-';
		return `(${this.real.toFixed(4)} ${sign} ${Math.abs(this.imag).toFixed(4)}i)`;
	}
}

// Constants
const INV_SQRT_2: number = 1.0 / Math.sqrt(2.0);

/**
 * @brief Simulates a system of Qubits (Quantum Register).
 *
 * Represents the state vector |psi>.
 * For N qubits, the state vector size is 2^N.
 */
export class QuantumRegister {
	private numQubits: number;
	private stateVector: Complex[];

	/**
	 * @brief Initialize register with N qubits.
	 * Default state is |0...0> (all qubits spin up).
	 */
	constructor(n: number) {
		if (n < 1) {
			throw new Error('Must have at least 1 qubit');
		}
		this.numQubits = n;

		// Size is 2^n
		const size = 1 << this.numQubits;
		this.stateVector = Array.from({ length: size }, () => new Complex(0, 0));

		// Initialize system to classical state |0...0>
		// Probability amplitude is 1.0 (100%) at index 0
		this.stateVector[0] = new Complex(1.0, 0);
	}

	/**
	 * @brief Applies a Controlled-NOT (CNOT) gate.
	 *
	 * Flips the target_qubit if and only if the control_qubit is |1>.
	 * This is how entanglement is created.
	 */
	applyCNOT(controlQubit: number, targetQubit: number): void {
		this.checkQubitIndex(controlQubit);
		this.checkQubitIndex(targetQubit);
		if (controlQubit === targetQubit) {
			throw new Error('Control and target qubits cannot be the same.');
		}

		const size = this.stateVector.length;
		const controlMask = 1 << controlQubit;
		const targetMask = 1 << targetQubit;

		for (let i = 0; i < size; ++i) {
			// We only care about states where the control bit is 1
			if ((i & controlMask) !== 0) {
				// Find the state where the target bit is flipped and swap amplitudes
				// CNOT acts on pairs, so we only need to process one of them.
				// We process i when i < j to avoid double-swapping.
				const j = i ^ targetMask;
				if (i < j) {
					[this.stateVector[i], this.stateVector[j]] = [this.stateVector[j], this.stateVector[i]];
				}
			}
		}
	}

	/**
	 * @brief Applies the Hadamard Gate (H) to a specific qubit.
	 *
	 * Physically: Puts a qubit into Superposition.
	 * |0> becomes (|0> + |1>) / sqrt(2)
	 */
	applyHadamard(targetQubit: number): void {
		this.checkQubitIndex(targetQubit);

		const size = this.stateVector.length;
		const pairDist = 1 << targetQubit;

		// Iterate over the state vector, applying the gate to pairs of amplitudes
		for (let i = 0; i < size; i += 2 * pairDist) {
			for (let j = 0; j < pairDist; ++j) {
				const idx0 = i + j; // Index where target bit is 0
				const idx1 = i + j + pairDist; // Index where target bit is 1

				const a = this.stateVector[idx0];
				const b = this.stateVector[idx1];

				// H matrix application
				this.stateVector[idx0] = a.add(b).multiplyByScalar(INV_SQRT_2);
				this.stateVector[idx1] = a.subtract(b).multiplyByScalar(INV_SQRT_2);
			}
		}
	}

	/**
	 * @brief Measure a specific qubit.
	 *
	 * Physically: Collapses the wave function.
	 * The state becomes irreversibly |0> or |1> based on probability amplitudes.
	 *
	 * @return 0 or 1
	 */
	measure(targetQubit: number): 0 | 1 {
		this.checkQubitIndex(targetQubit);

		// 1. Calculate Probability of measuring |1>
		let probOne = 0.0;
		const size = this.stateVector.length;

		for (let i = 0; i < size; ++i) {
			// Check if the bit at target_qubit position is 1
			if (((i >> targetQubit) & 1) === 1) {
				// Probability is magnitude squared of amplitude: |alpha|^2
				probOne += this.stateVector[i].norm();
			}
		}

		// 2. Perform the random selection (Simulation of nature)
		const roll = Math.random();
		const outcome = roll < probOne ? 1 : 0;

		// 3. Collapse the Wave Function
		// If we measured 1, all states where qubit is 0 become impossible (amplitude 0).
		// We must also re-normalize the vector so total probability is 1.0 again.
		const probabilityOfOutcome = outcome === 1 ? probOne : 1.0 - probOne;
		// Avoid division by zero in the unlikely case of measuring an impossible state
		const normFactor = probabilityOfOutcome > 1e-9 ? 1.0 / Math.sqrt(probabilityOfOutcome) : 1.0;

		for (let i = 0; i < size; ++i) {
			const bitVal = (i >> targetQubit) & 1;
			if (bitVal === outcome) {
				this.stateVector[i] = this.stateVector[i].multiplyByScalar(normFactor);
			} else {
				this.stateVector[i] = new Complex(0, 0);
			}
		}

		return outcome;
	}

	/**
	 * Helper to visualize state by logging to the console.
	 */
	printState(): void {
		console.log('--- System State ---');
		for (let i = 0; i < this.stateVector.length; ++i) {
			const probability = this.stateVector[i].norm();
			// Only print states with non-zero probability
			if (probability > 0.0001) {
				// Represent the state index as a binary string, padded to the number of qubits
				const stateLabel = i.toString(2).padStart(this.numQubits, '0');
				console.log(
					`|${stateLabel}> : ${this.stateVector[i].toString()} (Prob: ${(probability * 100).toFixed(2)}%)`
				);
			}
		}
		console.log('--------------------');
	}

	private checkQubitIndex(q: number): void {
		if (q < 0 || q >= this.numQubits) {
			throw new RangeError('Qubit index out of range');
		}
	}
}

/**
 * @brief Interface: Quantum Source of Entropy
 *
 * Uses a single-qubit quantum system to generate true randomness
 * (simulated) by measuring a superposition state.
 */
export class QuantumEntropySource {
	/**
	 * @brief Generates a random boolean using quantum superposition.
	 *
	 * Algorithm:
	 * 1. Initialize Qubit to |0>
	 * 2. Apply Hadamard Gate -> (|0> + |1>) / sqrt(2) (Perfect 50/50 superposition)
	 * 3. Measure -> Collapses to 0 or 1 with exactly 50% probability.
	 */
	static getBit(): boolean {
		const q = new QuantumRegister(1); // Create a fresh 1-qubit universe
		q.applyHadamard(0); // Enter superposition
		return q.measure(0) === 1; // Collapse and return
	}

	/**
	 * @brief Generates a random byte (0-255).
	 */
	static getByte(): number {
		let result = 0;
		for (let i = 0; i < 8; ++i) {
			if (QuantumEntropySource.getBit()) {
				result |= 1 << i;
			}
		}
		return result;
	}

	/**
	 * @brief Generates a random integer in range [min, max].
	 */
	static getInt(min: number, max: number): number {
		// Simple rejection sampling implementation for clarity
		const range = max - min + 1;
		if (range <= 0) {
			throw new Error('min must be less than or equal to max');
		}

		// The C++ code builds a 31-bit random number, so we will do the same.
		// This avoids issues with the sign bit in 32-bit operations.
		const RAND_MAX = 0x7fffffff; // 2^31 - 1
		const limit = RAND_MAX - (RAND_MAX % range);
		let val: number;

		do {
			val = 0;
			// Generate 31 bits
			for (let i = 0; i < 31; ++i) {
				val = (val << 1) | (QuantumEntropySource.getBit() ? 1 : 0);
			}
		} while (val >= limit);

		return min + (val % range);
	}
}
