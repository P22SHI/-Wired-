import { InPortWithPositionProps, OutPortWithPositionProps } from 'src/Models/Chip';
import Colors from 'src/Styles/Colors';
import styled from 'styled-components';

type SVGPortProps = {
	isOn: boolean;
	x: number;
	y: number;
	onMouseDown: (e: React.MouseEvent) => void;
	onMouseUp: (e: React.MouseEvent) => void;
};

const strokeWidth = 4;
const radius = 30;

const Port = styled.circle<{ isOn: boolean }>`
	fill: ${props => props.isOn ? Colors.PortOn : Colors.PortOff};
	stroke: ${Colors.DefaultBorder};
	stroke-width: ${strokeWidth};
	cursor: pointer;

	&:hover {
		fill: ${props => props.isOn ? Colors.PortOnHover : Colors.PortOffHover};
	}
`;

const SVGPort = (props: SVGPortProps) => (
	<Port
		isOn={props.isOn}
		cx={props.x}
		cy={props.y}
		r={radius - strokeWidth}
		onMouseDown={props.onMouseDown}
		onMouseUp={props.onMouseUp}
		onContextMenu={e => e.preventDefault()}
	/>
);

export type SVGInPortProps = Omit<SVGPortProps, 'onMouseDown' | 'onMouseUp'> & {
	inPort: InPortWithPositionProps;
	onMouseDown: (e: React.MouseEvent, inPort: InPortWithPositionProps) => void;
	onMouseUp: (e: React.MouseEvent, inPort: InPortWithPositionProps) => void;
};

export const SVGInPort = (props: SVGInPortProps) => (
	<SVGPort
		{...props}
		onMouseDown={e => props.onMouseDown(e, props.inPort)}
		onMouseUp={e => props.onMouseUp(e, props.inPort)}
	/>
);

export type SVGOutPortProps = Omit<SVGPortProps, 'onMouseDown' | 'onMouseUp'> & {
	outPort: OutPortWithPositionProps;
	onMouseDown: (e: React.MouseEvent, outPort: OutPortWithPositionProps) => void;
	onMouseUp: (e: React.MouseEvent, outPort: OutPortWithPositionProps) => void;
};

export const SVGOutPort = (props: SVGOutPortProps) => (
	<SVGPort
		{...props}
		onMouseDown={e => props.onMouseDown(e, props.outPort)}
		onMouseUp={e => props.onMouseUp(e, props.outPort)}
	/>
);
