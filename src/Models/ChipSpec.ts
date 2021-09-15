interface ChipSpecProps {
	inCount: number;
	outCount: number;
	rows: boolean[][];
};

export default class ChipSpec implements ChipSpecProps {
	inCount: number;
	outCount: number;
	rows: boolean[][];

	constructor(props: ChipSpecProps) {
		this.inCount = props.inCount;
		this.outCount = props.outCount;
		if (props.rows.length !== this.getRowCount()) {
			throw new Error(
				`cannot create ChipSet with ${props.inCount} inputs and ${props.rows.length} rows, must have ${this.getRowCount()} rows`
			);
		}
		this.rows = [];
		props.rows.forEach((row, idx) => {
			if (row.length !== this.getColumnCount()) {
				throw new Error(`row ${idx} has ${row.length} values, should have ${this.getColumnCount()}`);
			}
			this.rows.push([...row]);
		});
	}

	getRowCount = () => {
		return 1 << this.inCount;
	}

	getColumnCount = () => {
		return this.inCount + this.outCount;
	}
}