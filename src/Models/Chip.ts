import ChipBlueprint, { GridPoint } from './ChipBlueprint';
import ChipFactory from './ChipFactory';

//==============================================================================
// Structural Info
//==============================================================================

type WireProps = {
	inPort: InPortProps;
	outPort: OutPortProps;
	sever: () => void;
	getValue: () => boolean;
};

type InPortProps = {
	wire: WireProps | null;
};

type OutPortProps = {
	cache?: boolean | undefined;
	wires: WireProps[];
	getValue: () => boolean;
};

type WithExterior = {
	exterior: {
		name: string;
		inPorts: InPortProps[];
		outPorts: OutPortProps[];
	};
};

type WithInterior = {
	interior: {
		entryPorts: OutPortProps[];
		exitPorts: InPortProps[];
		internalChips: ChipProps[];
	};
};

type BaseChipProps = WithExterior & {
	isDerived: false;
};

type DerivedChipProps = WithExterior & WithInterior & {
	isDerived: true;
};

type ChipProps = BaseChipProps | DerivedChipProps;

//==============================================================================
// Positional Info
//==============================================================================

type WithPosition = {
	position: GridPoint;
};

export type InPortWithPositionProps = Omit<InPortProps, 'wire'> & WithPosition & {
	wire: WireWithPositionProps | null;
};

export type OutPortWithPositionProps = Omit<OutPortProps, 'wire'> & WithPosition & {
	wires: WireWithPositionProps[];
};

type WireWithPositionProps = Omit<WireProps, 'inPort' | 'outPort'> & {
	inPort: InPortWithPositionProps;
	outPort: OutPortWithPositionProps;
};

export type InternalChipWithPosition = Omit<ChipProps, 'exterior'> & {
	exterior: Omit<ChipProps['exterior'], 'inPorts' | 'outPorts'> & WithPosition & {
		inPorts: InPortWithPositionProps[];
		outPorts: OutPortWithPositionProps[];
	};
};

type DisplayChipProps = {
	inputValues: boolean[];
	interior: {
		dimensions: GridPoint;
		entryPorts: OutPortWithPositionProps[];
		exitPorts: InPortWithPositionProps[];
		internalChips: InternalChipWithPosition[];
	};
};

//==============================================================================
// Classes
//==============================================================================

// TODO: implement OutPort cache

class Wire implements WireProps {
	inPort: InPortProps;
	outPort: OutPortProps;

	constructor(inPort: InPortProps, outPort: OutPortProps) {
		this.inPort = inPort;
		this.outPort = outPort;
		inPort.wire?.sever();
		inPort.wire = this;
		outPort.wires.push(this);
	}

	sever = () => {
		this.inPort.wire = null;
		this.outPort.wires = this.outPort.wires.filter(w => w !== this);
	};

	getValue = () => this.outPort.getValue();
}

export class WireWithPosition extends Wire implements WireWithPositionProps {
	inPort: InPortWithPositionProps;
	outPort: OutPortWithPositionProps;

	constructor(inPort: InPortWithPositionProps, outPort: OutPortWithPositionProps) {
		super(inPort, outPort);
		this.inPort = inPort;
		this.outPort = outPort;
	}
}

export class NotGate implements BaseChipProps {
	isDerived: false = false;
	exterior: BaseChipProps['exterior'];

	constructor() {
		this.exterior = {
			name: 'NOT',
			inPorts: [{ wire: null }],
			outPorts: [{
				wires: [],
				getValue: () =>  !this.exterior.inPorts[0].wire?.getValue(),
			}],
		};
	}
};

export class NotGateWithPosition extends NotGate implements BaseChipProps, InternalChipWithPosition {
	exterior: InternalChipWithPosition['exterior'];

	constructor() {
		super();
		this.exterior = {
			name: 'NOT',
			position: { c: NaN, r: NaN },
			inPorts: [{
				wire: null,
				position: { c: NaN, r: NaN },
			}],
			outPorts: [{
				wires: [],
				position: { c: NaN, r: NaN },
				getValue: () =>  !this.exterior.inPorts[0].wire?.getValue(),
			}],
		};
	}
};

export class AndGate implements BaseChipProps {
	isDerived: false = false;
	exterior: BaseChipProps['exterior'];

	constructor() {
		this.exterior = {
			name: 'AND',
			inPorts: [{ wire: null }, { wire: null }],
			outPorts: [{
				wires: [],
				getValue: () => !!(
					this.exterior.inPorts[0].wire?.getValue() &&
					this.exterior.inPorts[1].wire?.getValue()
				),
			}],
		};
	}
};

export class AndGateWithPosition extends AndGate implements BaseChipProps, InternalChipWithPosition {
	exterior: InternalChipWithPosition['exterior'];

	constructor() {
		super();
		this.exterior = {
			name: 'AND',
			position: { c: NaN, r: NaN },
			inPorts: [{
				wire: null,
				position: { c: NaN, r: NaN },
			}, {
				wire: null,
				position: { c: NaN, r: NaN },
			}],
			outPorts: [{
				wires: [],
				position: { c: NaN, r: NaN },
				getValue: () => !!(
					this.exterior.inPorts[0].wire?.getValue() &&
					this.exterior.inPorts[1].wire?.getValue()
				),
			}],
		};
	}
};

export class DerivedChip implements DerivedChipProps {
	isDerived: true = true;
	exterior: DerivedChipProps['exterior'];
	interior: DerivedChipProps['interior'];

	constructor(bp: ChipBlueprint) {
		this.exterior = {
			name: bp.metadata.name,
			inPorts: Array.from(
				{ length: bp.metadata.inCount },
				() => ({ wire: null }),
			),
			outPorts: Array.from(
				{ length: bp.metadata.outCount },
				(_, i) => ({
					wires: [],
					getValue: () => !!this.interior.exitPorts[i].wire?.getValue(),
				}),
			),
		};
		this.interior = {
			entryPorts: Array.from(
				{ length: bp.metadata.inCount },
				(_, i) => ({
					wires: [],
					getValue: () => !!this.exterior.inPorts[i].wire?.getValue(),
				}),
			),
			exitPorts: Array.from(
				{ length: bp.metadata.outCount },
				() => ({ wire: null }),
			),
			internalChips: bp.internalChips.map(ic => ChipFactory.createChipNode(ic.name)),
		};
		const allInPorts = [...this.interior.exitPorts];
		const allOutPorts = [...this.interior.entryPorts];
		this.interior.internalChips.forEach(ic => {
			allInPorts.push(...ic.exterior.inPorts);
			allOutPorts.push(...ic.exterior.outPorts);
		});
		bp.wires.forEach(w => new Wire(allInPorts[w.inId], allOutPorts[w.outId]));
	}
};

export class DerivedChipWithPosition extends DerivedChip implements DerivedChipProps, InternalChipWithPosition {
	exterior: InternalChipWithPosition['exterior'];

	constructor(bp: ChipBlueprint) {
		super(bp);
		const superExterior = (this as DerivedChip).exterior;
		this.exterior = {
			name: superExterior.name,
			position: { c: NaN, r: NaN },
			inPorts: superExterior.inPorts.map(ip => ({ ...ip, wire: null, position: { c: NaN, r: NaN } })),
			outPorts: superExterior.outPorts.map(op => ({ ...op, wires: [], position: { c: NaN, r: NaN } })),
		};
	}
};

export type ChipNode = NotGate | AndGate | DerivedChip;
export type ChipNodeWithPosition = NotGateWithPosition | AndGateWithPosition | DerivedChipWithPosition;

export class DisplayChip implements DisplayChipProps {
	isDerived: true = true;
	inputValues: boolean[];
	interior: DisplayChipProps['interior'];

	constructor(bp: ChipBlueprint) {
		this.inputValues = Array.from({ length: bp.metadata.inCount }, () => false);
		this.interior = {
			dimensions: { ...bp.metadata.internalDimensions },
			entryPorts: Array.from(
				{ length: bp.metadata.inCount },
				(_, i) => ({
					wires: [],
					getValue: () => this.inputValues[i],
					position: {
						c: 1,
						r: 1 + i * 2,
					},
				}),
			),
			exitPorts: Array.from(
				{ length: bp.metadata.outCount },
				(_, i) => ({
					wire: null,
					position: {
						c: bp.metadata.internalDimensions.c - 1,
						r: 1 + i * 2,
					},
				}),
			),
			internalChips: bp.internalChips.map(ic => {
				const chipNode = ChipFactory.createChipNodeWithPosition(ic.name);
				this.placeChipNode(chipNode, ic.position);
				return chipNode;
			}),
		};
		const allInPorts = [...this.interior.exitPorts];
		const allOutPorts = [...this.interior.entryPorts];
		this.interior.internalChips.forEach((ic: InternalChipWithPosition) => {
			allInPorts.push(...ic.exterior.inPorts);
			allOutPorts.push(...ic.exterior.outPorts);
		});
		bp.wires.forEach(w => new WireWithPosition(allInPorts[w.inId], allOutPorts[w.outId]));
		console.log('from blueprint: ', bp);
		console.log('created display chip: ', this);
	}

	flipInput = (i: number) => {
		this.inputValues[i] = !this.inputValues[i];
	};

	getOutputs = () => this.interior.exitPorts.map(ip => !!ip.wire?.getValue());

	addChipNode = (name: string, position: GridPoint) => {
		const chipNode = ChipFactory.createChipNodeWithPosition(name);
		this.placeChipNode(chipNode, position);
		this.interior.internalChips.push(chipNode);
		console.log(`added new internal chip at ${position}`);
	};

	private placeChipNode = (chipNode: InternalChipWithPosition, position: GridPoint) => {
		const chipExteriorWidth = 4; // TODO: refactor this
		chipNode.exterior.position = { ...position };
		chipNode.exterior.inPorts.forEach((ip: InPortWithPositionProps, i) => {
			ip.position = {
				c: position.c,
				r: position.r + i * 2 + 1,
			};
		});
		chipNode.exterior.outPorts.forEach((op: OutPortWithPositionProps, i) => {
			op.position = {
				c: position.c + chipExteriorWidth,
				r: position.r + i * 2 + 1,
			};
		});
	};
};