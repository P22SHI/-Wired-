import React from 'react';
import { DisplayChip, InPortWithPositionProps, OutPortWithPositionProps, WireWithPosition } from 'src/Models/Chip';
import { ChipMetadata } from 'src/Models/ChipBlueprint';
import Colors from 'src/Styles/Colors';
import { NonNullableFields } from 'src/Utils/TsUtils';
import styled from 'styled-components';
import SVGBit from './SVGBit';
import SVGChipInterior from './SVGChipInterior';
import SVGWire from './SVGWire';

export type ChipPlacementInfo = {
	metadata: ChipMetadata;
	domPosition: { x: number, y: number };
};

type Props = {
	displayChip: DisplayChip;
	chipPlacementInfo: ChipPlacementInfo | null;
	onModifyDisplayChip: () => void;
};

type State = {
	isPanning: boolean;
	perspective: {
		cx: number;
		cy: number;
		zoom: number;
	} | null;
	ghostWireInfo: {
		inPort: InPortWithPositionProps | null;
		outPort: OutPortWithPositionProps | null;
	} | null;
};

const Container = styled.div`
	flex-grow: 1;
	position: relative;
	width: auto;
	height: auto;
	left: 0px;
	right: 0px;
	top: 0px;
	bottom: 0px;
	background-color: ${Colors.DefaultBackground};
`;

const Svg = styled.svg<{ isPanning: boolean }>`
	position: absolute;
	width: auto;
	height: auto;
	left: 0px;
	right: 0px;
	top: 0px;
	bottom: 0px;
	cursor: ${props => props.isPanning ? 'grabbing' : 'unset'};
`;

export default class ChipEditView extends React.Component<Props, State> {
	zoomFactor: number = Math.pow(2, 1/12);
	cellSize: number = 50;
	baseViewRect: {
		left: number;
		right: number;
		top: number,
		bottom: number,
	} = {
		left: -this.cellSize * 3,
		right: this.cellSize * 41,
		top: -this.cellSize,
		bottom: this.cellSize * 21,
	};
	ref: SVGSVGElement | null = null; 
	mousePos: { x: number, y: number } = { x: 0, y: 0 };
	state: State = {
		isPanning: false,
		perspective: null,
		ghostWireInfo: null,
	};

	componentDidMount() {
		this.resetView();
		window.addEventListener('resize', this.onResize);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.onResize);
	}

	render() {
		return (
			<Container>
				<Svg
					ref={this.onGetRef}
					viewBox={this.getViewBoxString()}
					onMouseDown={this.onMouseDown}
					onMouseMove={this.onMouseMove}
					onMouseUp={this.onMouseUp}
					onMouseLeave={this.onMouseLeave}
					onWheel={this.onWheel}
					onScroll={this.cancelEvent}
					isPanning={this.state.isPanning}
					preserveAspectRatio='none'
				>
					<SVGChipInterior
						chipInterior={this.props.displayChip.interior}
						cellSize={this.cellSize}
						onInPortMouseDown={this.onInPortMouseDown}
						onInPortMouseUp={this.onInPortMouseUp}
						onOutPortMouseDown={this.onOutPortMouseDown}
						onOutPortMouseUp={this.onOutPortMouseUp}
					/>
					{this.props.displayChip.inputValues.map((v, i) => (
						<SVGBit
							key={i}
							isOn={v}
							x={-2.5 * this.cellSize}
							y={(i * 2 + .5) * this.cellSize}
							onMouseDown={() => this.onBitMouseDown(i)} />
					))}
					{this.state.ghostWireInfo && (
						<SVGWire
							isOn={false}
							start={this.state.ghostWireInfo.outPort ? {
								x: this.state.ghostWireInfo.outPort.position.c * this.cellSize,
								y: this.state.ghostWireInfo.outPort.position.r * this.cellSize,
							} : {
								x: this.mousePos.x,
								y: this.mousePos.y,
							}}
							end={this.state.ghostWireInfo.inPort ? {
								x: this.state.ghostWireInfo.inPort.position.c * this.cellSize,
								y: this.state.ghostWireInfo.inPort.position.r * this.cellSize,
							} : {
								x: this.mousePos.x,
								y: this.mousePos.y,
							}}
						/>
					)}
				</Svg>
			</Container>
		);
	}

	onBitMouseDown = (i: number) => {
		this.props.displayChip.flipInput(i);
		this.props.onModifyDisplayChip();
	};

	onInPortMouseDown = (e: React.MouseEvent, inPort: InPortWithPositionProps) => {
		switch (e.button) {
			case 0: // left click
				this.cancelEvent(e);
				this.setState({
					ghostWireInfo: {
						outPort: null,
						...this.state.ghostWireInfo,
						inPort,
					},
				})
				break;
			case 2: // right click
				if (inPort.wire) {
					inPort.wire.sever();
					this.forceUpdate()
				}
				break;
		}
	};

	onInPortMouseUp = (e: React.MouseEvent, inPort: InPortWithPositionProps) => {
		if (e.button !== 0) return;
		this.cancelEvent(e);
		const outPort = this.state.ghostWireInfo?.outPort;
		if (outPort) {
			this.completeGhostWire({ inPort, outPort });
		} else {
			this.setState({ ghostWireInfo: null });
		}
	};

	onOutPortMouseDown = (e: React.MouseEvent, outPort: OutPortWithPositionProps) => {
		if (e.button !== 0) return;
		this.cancelEvent(e);
		this.setState({
			ghostWireInfo: {
				inPort: null,
				...this.state.ghostWireInfo,
				outPort,
			},
		});
	};

	onOutPortMouseUp = (e: React.MouseEvent, outPort: OutPortWithPositionProps) => {
		if (e.button !== 0) return;
		this.cancelEvent(e);
		const inPort = this.state.ghostWireInfo?.inPort;
		if (inPort) {
			this.completeGhostWire({ inPort, outPort });
		} else {
			this.setState({ ghostWireInfo: null });
		}
	};

	completeGhostWire = (gw: NonNullableFields<State['ghostWireInfo']>) => {
		new WireWithPosition(gw.inPort, gw.outPort);
		this.setState({ ghostWireInfo: null });
	};

	screenToWorldPos = (screenPos: Pick<DOMPoint, 'x' | 'y'>) => {
		if (!this.ref) {
			throw new Error('cannot convert point, svg container is not mounted');
		}
		const svgPoint = this.ref.createSVGPoint();
		svgPoint.x = screenPos.x;
		svgPoint.y = screenPos.y;
		const ctm = this.ref.getScreenCTM();
		if (!ctm) {
			throw new Error('failed to get CTM');
		}
		return svgPoint.matrixTransform(ctm.inverse());
	};

	onGetRef = (ref: SVGSVGElement | null) => {
		this.ref = ref;
		this.resetView();
	};

	getParentRect = () => {
		if (!this.ref || !this.ref.parentElement) return null;
		return {
			x: this.ref.parentElement.clientLeft,
			y: this.ref.parentElement.clientTop,
			width: this.ref.parentElement.clientWidth,
			height: this.ref.parentElement.clientHeight,
		};
	};

	getViewBox = () => {
		if (!this.ref || !this.state.perspective) return undefined;
		const realSize = this.getParentRect()!;
		const realAspect = realSize.width / realSize.height;
		const baseWidth = this.baseViewRect.right - this.baseViewRect.left;
		const baseHeight = this.baseViewRect.bottom - this.baseViewRect.top;
		const baseAspect = baseWidth / baseHeight;
		let width: number, height: number;
		if (baseAspect < realAspect) {
			height = baseHeight / this.state.perspective.zoom;
			width = height * realAspect;
		} else {
			width = baseWidth / this.state.perspective.zoom;
			height = width / realAspect;
		}
		const x = this.state.perspective.cx - width / 2;
		const y = this.state.perspective.cy - height / 2;
		return { x, y, width, height };
	};
	
	getViewBoxString = () => {
		const vb = this.getViewBox();
		return vb && `${vb.x} ${vb.y} ${vb.width} ${vb.height}`;
	};

	onMouseDown = (e: React.MouseEvent) => {
		if (e.button !== 0) return;
		this.cancelEvent(e);
		this.setState({ isPanning: true });
	};

	onMouseMove = (e: React.MouseEvent) => {
		if (!this.ref || !this.state.perspective) return;
		this.mousePos = this.screenToWorldPos({
			x: e.pageX,
			y: e.pageY,
		});
		if (this.state.isPanning) {
			const { clientWidth } = this.ref;
			const perspective = { ...this.state.perspective };
			const viewBox = this.getViewBox()!;
			const apparentZoom = perspective.zoom * clientWidth / viewBox.width;
			perspective.cx -= e.movementX / apparentZoom;
			perspective.cy -= e.movementY / apparentZoom;
			this.setState({ perspective });
		} else if (this.state.ghostWireInfo) {
			this.forceUpdate();
		}
	};

	onMouseUp = (e: React.MouseEvent) => {
		if (e.button !== 0) return;
		if (this.state.isPanning) {
			this.setState({ isPanning: false });
		} else if (this.state.ghostWireInfo) {
			this.setState({ ghostWireInfo: null });
		} else if (this.props.chipPlacementInfo) {
			const worldPos = this.screenToWorldPos(this.props.chipPlacementInfo.domPosition);
			this.props.displayChip.addChipNode(
				this.props.chipPlacementInfo.metadata.name, {
					c: Math.round(worldPos.x / this.cellSize),
					r: Math.round(worldPos.y / this.cellSize),
				},
			);
			this.props.onModifyDisplayChip();
		}
	};

	onMouseLeave = (e: React.MouseEvent) => {
		this.cancelEvent(e);
		if (this.state.isPanning || this.state.ghostWireInfo) {
			this.setState({ isPanning: false, ghostWireInfo: null });
		}
	};

	onWheel = (e: React.WheelEvent) => {
		if (!this.state.perspective) return;
		e.stopPropagation();
		const zoom = this.state.perspective.zoom * Math.pow(this.zoomFactor, -e.deltaY / 100);
		this.setState({ perspective: { ...this.state.perspective, zoom }});
	};

	resetView = () => {
		if (!this.ref) {
			this.setState({ perspective: null });
			return;
		}
		this.setState({
			perspective: {
				cx: (this.baseViewRect.left + this.baseViewRect.right) / 2,
				cy: (this.baseViewRect.top + this.baseViewRect.bottom) / 2,
				zoom: 1,
			},
		});
	};

	cancelEvent = (e: React.UIEvent) => {
		e.stopPropagation();
		e.preventDefault();
	};

	onResize = () => {
		this.forceUpdate();
	};
};