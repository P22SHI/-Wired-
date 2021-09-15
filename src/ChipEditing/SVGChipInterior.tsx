import React from 'react';
import { DisplayChip, InPortWithPositionProps, InternalChipWithPosition, OutPortWithPositionProps } from 'src/Models/Chip';
import SVGChipExterior from './SVGChipExterior';
import SVGGrid from './SVGGrid';
import { SVGInPort, SVGInPortProps, SVGOutPort, SVGOutPortProps } from './SVGPort';
import SVGWire from './SVGWire';

type SVGChipInteriorProps = {
	chipInterior: DisplayChip['interior'];
	cellSize: number;
	onInPortMouseDown: SVGInPortProps['onMouseDown'];
	onInPortMouseUp: SVGInPortProps['onMouseUp'];
	onOutPortMouseDown: SVGOutPortProps['onMouseDown'];
	onOutPortMouseUp: SVGOutPortProps['onMouseUp'];
};

class SVGChipInterior extends React.Component<SVGChipInteriorProps>{
	render() {
		return (
			<>
				{/* GRID */}
				<SVGGrid
					width={this.props.chipInterior.dimensions.c * this.props.cellSize}
					height={this.props.chipInterior.dimensions.r * this.props.cellSize}
					cellSize={this.props.cellSize}
				/>
				{/* INTERNAL CHIPS */}
				{this.props.chipInterior.internalChips.map((ic: InternalChipWithPosition, i) => (
					<SVGChipExterior
						key={i}
						cellSize={this.props.cellSize}
						gridPos={ic.exterior.position}
						inCount={ic.exterior.inPorts.length}
						outCount={ic.exterior.outPorts.length}
						name={ic.exterior.name}
					/>
				))}
				{/* PORTS */}
				{this.props.chipInterior.entryPorts.map(this.mapOutPortToSVGOutPort)}
				{this.props.chipInterior.exitPorts.map(this.mapInPortToSVGInPort)}
				{this.props.chipInterior.internalChips.map((ic: InternalChipWithPosition, i) => (
					<React.Fragment key={i}>
						{ic.exterior.inPorts.map(this.mapInPortToSVGInPort)}
						{ic.exterior.outPorts.map(this.mapOutPortToSVGOutPort)}
					</React.Fragment>
				))}
				{/* WIRES */}
				{this.props.chipInterior.exitPorts.map(this.mapInPortToSVGWire)}
				{this.props.chipInterior.internalChips.map((ic: InternalChipWithPosition, i) => (
					<React.Fragment key={i}>
						{ic.exterior.inPorts.map(this.mapInPortToSVGWire)}
					</React.Fragment>
				))}
			</>
		)
	}

	mapInPortToSVGInPort = (p: InPortWithPositionProps, i: number) => (
		<SVGInPort
			key={i}
			inPort={p}
			isOn={!!p.wire?.getValue()}
			x={p.position.c * this.props.cellSize}
			y={p.position.r * this.props.cellSize}
			onMouseDown={this.props.onInPortMouseDown}
			onMouseUp={this.props.onInPortMouseUp}
		/>
	);

	mapOutPortToSVGOutPort = (p: OutPortWithPositionProps, i: number) => (
		<SVGOutPort
			key={i}
			outPort={p}
			isOn={p.getValue()}
			x={p.position.c * this.props.cellSize}
			y={p.position.r * this.props.cellSize}
			onMouseDown={this.props.onOutPortMouseDown}
			onMouseUp={this.props.onOutPortMouseUp}
		/>
	);

	mapInPortToSVGWire = (p: InPortWithPositionProps, i: number) => p.wire && (
		<SVGWire
			key={i}
			isOn={p.wire.getValue()}
			start={{
				x: p.wire.outPort.position.c * this.props.cellSize,
				y: p.wire.outPort.position.r * this.props.cellSize,
			}}
			end={{
				x: p.position.c * this.props.cellSize,
				y: p.position.r * this.props.cellSize,
			}}
		/>
	);
};

export default SVGChipInterior;