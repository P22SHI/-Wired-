import Colors from 'src/Styles/Colors';
import styled from 'styled-components';

type Props = {
	isOn: boolean;
	x: number;
	y: number;
	onMouseDown: (e: React.MouseEvent) => void;
};

const Bit = styled.rect<{ isOn: boolean }>`
	fill: ${props => props.isOn ? Colors.BitOn : Colors.BitOff};
	stroke: ${Colors.DefaultBorder};
	stroke-width: 4px;
	cursor: pointer;

	&:hover {
		fill: ${props => props.isOn ? Colors.BitOnHover : Colors.BitOffHover};
	}
`;

const SVGBit = (props: Props) => (
	<Bit
		rx={16}
		isOn={props.isOn}
		x={props.x}
		y={props.y}
		width={100}
		height={50}
		onMouseDown={props.onMouseDown}
		onContextMenu={e => e.preventDefault()}
	/>
);

export default SVGBit;