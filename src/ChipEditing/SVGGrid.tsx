import styled from 'styled-components';

type Props = {
	width: number;
	height: number;
	cellSize: number;
};

const Rect = styled.rect`
	fill: #383838;
	stroke: #444;
	stroke-width: 10px;
`;

const GridLine = styled.line`
	stroke: #444;
`;

const SVGGrid = (props: Props) => {
	const columnCount = Math.floor(props.width / props.cellSize);
	const rowCount = Math.floor(props.height / props.cellSize);
	return (
		<g>
			<Rect x={0} y={0} width={props.width} height={props.height} rx={40} />
			{new Array(columnCount - 1).fill('').map((_, i) => (
				<GridLine
					key={`v${i}`}
					x1={(i + 1) * props.cellSize}
					y1={0}
					x2={(i + 1) * props.cellSize}
					y2={props.height}
					strokeWidth={i % 2 ? 5 : 2}
				/>
			))}
			{new Array(rowCount - 1).fill('').map((_, i) => (
				<GridLine
					key={`h${i}`}
					x1={0}
					y1={(i + 1) * props.cellSize}
					x2={props.width}
					y2={(i + 1) * props.cellSize}
					strokeWidth={i % 2 ? 5 : 2}
				/>
			))}
		</g>
	);
};

export default SVGGrid;