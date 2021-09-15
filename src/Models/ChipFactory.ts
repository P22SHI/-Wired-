import { AndGate, AndGateWithPosition, ChipNode, ChipNodeWithPosition, DerivedChip, DerivedChipWithPosition, DisplayChip, NotGate, NotGateWithPosition } from './Chip';
import ChipBlueprint, { ChipMetadata } from './ChipBlueprint';

enum BuiltinChips {
	Not = 'NOT',
	And = 'AND',
};

export default class ChipFactory {
	private static chipBlueprintRegistry: Map<string, ChipBlueprint> = new Map();
	private static reservedNames: string[] = Object.values(BuiltinChips);
	
	static addBlueprint = (name: string, bp: ChipBlueprint) => {
		if (ChipFactory.reservedNames.includes(name) || ChipFactory.chipBlueprintRegistry.has(name)) {
			throw new Error(`cannot add blueprint "${name}", name is already taken`);
		}
		ChipFactory.chipBlueprintRegistry.set(name, bp);
	};

	static updateBlueprint = (name: string, bp: ChipBlueprint) => {
		if (ChipFactory.reservedNames.includes(name)) {
			throw new Error(`cannot update blueprint "${name}", this is a built-in chip`);
		}
		ChipFactory.chipBlueprintRegistry.set(name, bp);
	};

	static getBlueprint = (name: string) => {
		const bp = ChipFactory.chipBlueprintRegistry.get(name);
		if (!bp) {
			throw new Error(`could not find blueprint "${name}"`);
		}
		return bp;
	};

	static getMetadata = (name: string): ChipMetadata => {
		switch (name) {
			case BuiltinChips.Not:
				return {
					internalDimensions: { c: 0, r: 0 },
					name: BuiltinChips.Not,
					inCount: 1,
					outCount: 1,
				};
			case BuiltinChips.And:
				return {
					internalDimensions: { c: 0, r: 0 },
					name: BuiltinChips.And,
					inCount: 2,
					outCount: 1,
				};
			default:
				return ChipFactory.getBlueprint(name).metadata;
		}
	};

	static createEmptyBlueprint = (metadata: ChipMetadata): ChipBlueprint => ({
		metadata,
		internalChips: [],
		wires: [],
	});
	
	static createEmptyDisplayChip = (metadata: ChipMetadata): DisplayChip =>
		new DisplayChip(ChipFactory.createEmptyBlueprint(metadata));

	static createChipNode = (name: string): ChipNode => {
		switch (name) {
			case BuiltinChips.Not:
				return new NotGate();
			case BuiltinChips.And:
				return new AndGate();
			default:
				const bp = ChipFactory.chipBlueprintRegistry.get(name);
				if (!bp) {
					throw new Error(`could not find chip blueprint "${name}"`);
				}
				return new DerivedChip(bp);
		}
	};

	static createChipNodeWithPosition = (name: string): ChipNodeWithPosition => {
		switch (name) {
			case BuiltinChips.Not:
				return new NotGateWithPosition();
			case BuiltinChips.And:
				return new AndGateWithPosition();
			default:
				const bp = ChipFactory.chipBlueprintRegistry.get(name);
				if (!bp) {
					throw new Error(`could not find chip blueprint "${name}"`);
				}
				return new DerivedChipWithPosition(bp);
		}
	};

	static loadDisplayChip = (name: string): DisplayChip | null => {
		const bp = ChipFactory.getBlueprint(name);
		if (!bp) return null;
		return new DisplayChip(bp);
	}

	static getNames = () => ChipFactory.reservedNames.concat(
		Array.from(ChipFactory.chipBlueprintRegistry.keys())
	);
};