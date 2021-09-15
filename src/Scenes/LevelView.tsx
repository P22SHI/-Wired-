import React from 'react';
import MenuButton from 'src/Buttons/MenuButton';
import ChipEditView, { ChipPlacementInfo } from 'src/ChipEditing/ChipEditView';
import ChipSpecView from 'src/ChipEditing/ChipSpecView';
import SVGChipExterior from 'src/ChipEditing/SVGChipExterior';
import Toolkit from 'src/ChipEditing/Toolkit';
import { FlexColumn, FlexRow, GrowingFlexColumn, GrowingFlexRow } from 'src/Containers/FlexContainers';
import { DisplayChip } from 'src/Models/Chip';
import ChipFactory from 'src/Models/ChipFactory';
import Level from 'src/Models/Level';
import Colors from 'src/Styles/Colors';
import { BoldText, Paragraph } from 'src/Texts/Text';
import styled from 'styled-components';

type Props = {
	level: Level;
	onClickBack: () => void;
};

type State = {
	displayChip: DisplayChip;
	chipPlacementInfo: ChipPlacementInfo | null;
};

const LevelViewContainer = styled(GrowingFlexColumn)`
	background-color: ${Colors.DefaultBackground};
`;

const TopBar = styled(FlexRow)`
	background-color: ${Colors.DarkBackground};
	border-bottom: 4px solid ${Colors.DefaultBorder};
`;

const SideBar = styled(FlexColumn)`
	background-color: ${Colors.DarkBackground};
	border-right: 4px solid ${Colors.DefaultBorder};
	padding: 12px;
`;

const TitleText = styled(BoldText)`
	font-size: 96px;
	margin: 8px 24px;
`;

const TopBarButton = styled(MenuButton)`
	flex-basis: auto;
	flex-grow: 0;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Divider = styled.div`
	background-color: ${Colors.DefaultBorder};
	height: 4px;
	margin: 16px 0px;
`;

const SVGOverlay = styled.svg`
	position: fixed;
	pointer-events: none;
	width: 100%;
	height: 100%;
`;

export default class LevelView extends React.Component<Props, State> {
	state: State = {
		displayChip: ChipFactory.createEmptyDisplayChip(this.props.level.chipMetadata),
		chipPlacementInfo: null,
	};

	render() {
		return (
			<LevelViewContainer onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp}>
				<TopBar>
					<TitleText>{this.props.level.chipMetadata.name}</TitleText>
					<GrowingFlexRow/>
					<TopBarButton onClick={this.onClickHelp}>HELP</TopBarButton>
					<TopBarButton onClick={this.onClickTest}>TEST</TopBarButton>
					<TopBarButton onClick={this.props.onClickBack}>BACK</TopBarButton>
				</TopBar>
				<GrowingFlexRow>
					<SideBar>
						{'description' in this.props.level.problem
							? false
							: <>
								<Paragraph>Design a circuit to match the following spec.</Paragraph>
								<FlexRow height={8}/>
								<ChipSpecView chipSpec={this.props.level.problem} />
							</>}
						<Divider />
						<Toolkit onSelect={this.onSelectChipFromToolkit} />
					</SideBar>
					<ChipEditView
						displayChip={this.state.displayChip}
						chipPlacementInfo={this.state.chipPlacementInfo}
						onModifyDisplayChip={this.onModifyDisplayChip}
					/>
				</GrowingFlexRow>
				{this.state.chipPlacementInfo && (
					<SVGOverlay {...this.state.chipPlacementInfo.domPosition}>
						<SVGChipExterior
							cellSize={50}
							gridPos={{
								c: this.state.chipPlacementInfo.domPosition.x / 50,
								r: this.state.chipPlacementInfo.domPosition.y / 50,
							}}
							{...this.state.chipPlacementInfo.metadata}
						/>
					</SVGOverlay>
				)}
			</LevelViewContainer>
		);
	}

	onModifyDisplayChip = () => this.forceUpdate();

	onClickHelp = (_: React.MouseEvent) => {
		// TODO: open help overlay
	};

	onClickTest = (_: React.MouseEvent) => {
		const chip = this.state.displayChip;
		if ('description' in this.props.level.problem) {
			// TODO: handle description problem
		} else {
			const spec = this.props.level.problem;
			const rowResults = new Array(spec.getRowCount()).fill(true);
			spec.rows.forEach((r, rowIdx) => {
				for (let i = 0; i < spec.inCount; i++) {
					chip.inputValues[i] = r[i];
				}
				const outputs = chip.getOutputs();
				for (let i = 0; i < spec.outCount; i++) {
					if (outputs[i] !== r[i + spec.inCount]) {
						rowResults[rowIdx] = false;
						break;
					}
				}
			});
			chip.inputValues = new Array(spec.inCount).fill(false);
			const success = rowResults.reduce((prev, current) => prev && current, true);
			// TODO: show results in overlay instead of alert
			alert(rowResults.reduce((
				prev, current, i) => `${prev}\n    row ${i}: ${current ? 'passed' : 'failed'}`,
				`Test Results: ${success ? 'passed' : 'failed'}`
			));
			console.log(rowResults);
		}
		this.forceUpdate();
	};

	onMouseUp = (_: React.MouseEvent) => {
		if (this.state.chipPlacementInfo) {
			this.setState({ chipPlacementInfo: null });
		}
	};

	onMouseMove = (e: React.MouseEvent) => {
		if (!this.state.chipPlacementInfo) return;
		if (e.buttons === 0) {
			// just in case we missed a mouseUp event
			this.setState({ chipPlacementInfo: null });
			return;
		}
		// it's bad style to mutate state directly, but this is done for
		// performance reasons, since onMouseMove is called very frequently
		const chipPlacementInfo = this.state.chipPlacementInfo;
		chipPlacementInfo.domPosition.x = e.pageX;
		chipPlacementInfo.domPosition.y = e.pageY;
		this.setState({ chipPlacementInfo });
	};

	onSelectChipFromToolkit = (e: React.MouseEvent, chipName: string) => {
		this.setState({
			chipPlacementInfo: {
				metadata: ChipFactory.getMetadata(chipName),
				domPosition: { x: e.pageX, y: e.pageY },
			},
		});
	};
};