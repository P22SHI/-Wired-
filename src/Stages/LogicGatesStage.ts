import ChipSpec from 'src/Models/ChipSpec';
import Stage from 'src/Models/Stage';

const LogicGatesStage: Stage = {
	name: 'Logic Gates',
	levels: [{
		chipMetadata: {
			name: 'NAND',
			internalDimensions: { c: 40, r: 20 },
			inCount: 2,
			outCount: 1,
		},
		problem: new ChipSpec({
			inCount: 2,
			outCount: 1,
			rows: [
				[false, false, true],
				[false, true, true],
				[true, false, true],
				[true, true, false],
			],
		}),
	}, {
		chipMetadata: {
			name: 'OR',
			internalDimensions: { c: 40, r: 20 },
			inCount: 2,
			outCount: 1,
		},
		problem: new ChipSpec({
			inCount: 2,
			outCount: 1,
			rows: [
				[false, false, false],
				[false, true, true],
				[true, false, true],
				[true, true, true],
			],
		}),
	}, {
		chipMetadata: {
			name: 'NOR',
			internalDimensions: { c: 40, r: 20 },
			inCount: 2,
			outCount: 1,
		},
		problem: new ChipSpec({
			inCount: 2,
			outCount: 1,
			rows: [
				[false, false, true],
				[false, true, false],
				[true, false, false],
				[true, true, false],
			],
		}),
	}, {
		chipMetadata: {
			name: 'XOR',
			internalDimensions: { c: 40, r: 20 },
			inCount: 2,
			outCount: 1,
		},
		problem: new ChipSpec({
			inCount: 2,
			outCount: 1,
			rows: [
				[false, false, false],
				[false, true, true],
				[true, false, true],
				[true, true, false],
			],
		}),
	}, {
		chipMetadata: {
			name: 'XNOR',
			internalDimensions: { c: 40, r: 20 },
			inCount: 2,
			outCount: 1,
		},
		problem: new ChipSpec({
			inCount: 2,
			outCount: 1,
			rows: [
				[false, false, true],
				[false, true, false],
				[true, false, false],
				[true, true, true],
			],
		}),
	}],
};

export default LogicGatesStage;