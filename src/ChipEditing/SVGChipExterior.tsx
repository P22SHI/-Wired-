import { GridPoint } from 'src/Models/ChipBlueprint';
import Colors from 'src/Styles/Colors';
import styled from 'styled-components';

type SVGChipExteriorProps = {
	cellSize: number;
	gridPos: GridPoint;
	inCount: number;
	outCount: number;
	name: string;
};

const ChipRect = styled.rect`
	fill: ${Colors.ChipBackground};
	stroke: ${Colors.ChipBorder};
	stroke-width: 8px;
`;

const Label = styled.text`
	fill: ${Colors.ChipLabel};
	stroke-width: 0;
	text-anchor: middle;
	font-size: 40px;
	font-weight: 900;
`;

const chipExteriorWidth = 4; // TODO: refactor this

const SVGChipExterior = (props: SVGChipExteriorProps) => {
	const width = chipExteriorWidth;
	 // TODO: store this or calculate it somewhere else
	const height = Math.max(props.inCount, props.outCount) * 2;
	return (
		<>
			<ChipRect
				rx={8}
				x={props.gridPos.c * props.cellSize}
				y={props.gridPos.r * props.cellSize}
				width={width * props.cellSize}
				height={height * props.cellSize}
			/>
			<Label
				x={(props.gridPos.c + width / 2) * props.cellSize}
				y={(props.gridPos.r + height / 2) * props.cellSize}
				dy='.35em'
			>
				{props.name}
			</Label>
		</>
	);
}

export default SVGChipExterior;