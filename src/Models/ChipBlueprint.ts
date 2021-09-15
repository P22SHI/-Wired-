export type GridPoint = {
	c: number;
	r: number;
};

export type ChipMetadata = {
	name: string;
	internalDimensions: GridPoint;
	inCount: number;
	outCount: number;
};

type InternalChipMetadata = {
	name: string;
	position: GridPoint;
};

type Hookup = {
	inId: number;
	outId: number;
};

// instructions to store and recreate a Chip
type ChipBlueprint = {
	metadata: ChipMetadata;
	internalChips: InternalChipMetadata[];
	wires: Hookup[];
};

export default ChipBlueprint;