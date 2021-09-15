import Colors from 'src/Styles/Colors';
import styled from 'styled-components';

export type Props = {
	isOn: boolean;
	start: { x: number, y: number },
	end: { x: number, y: number },
};

const Wire = styled.line<{ isOn: boolean }>`
	pointer-events: none;
	stroke: ${props => props.isOn ? Colors.WireOn : Colors.WireOff};
	stroke-width: 15px;
	stroke-linecap: round;
`;

const SVGWire = (props: Props) => (
	<Wire
		isOn={props.isOn}
		x1={props.start.x}
		y1={props.start.y}
		x2={props.end.x}
		y2={props.end.y}
	/>
);

export default SVGWire;