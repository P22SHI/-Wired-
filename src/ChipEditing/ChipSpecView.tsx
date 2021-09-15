import React from 'react';
import { FlexColumn, FlexRow } from 'src/Containers/FlexContainers';
import ChipSpec from 'src/Models/ChipSpec';
import Colors from 'src/Styles/Colors';
import { BoldText } from 'src/Texts/Text';
import styled from 'styled-components';

type Props = {
	chipSpec: ChipSpec;
};

const Container = styled(FlexColumn)`
	width: 320px;
	border: 2px solid ${Colors.DefaultBorder};
`;

const TableCell = styled(BoldText)`
	padding: 10px 0px;
	flex-grow: 1;
	flex-basis: 0px;
	white-space: nowrap;
	border: 2px solid ${Colors.DefaultBorder};
`;

const HeaderCell = styled(TableCell)`
	background-color: #444;
`;

const DataCell = styled(TableCell)<{ isOn: boolean }>`
	background-color: ${props => props.isOn ? '#c11' : '#222'};
	font-size: 20px;
`;

const ChipSpecView = (props: Props) => (
	<Container>
		<FlexRow>
			{new Array(props.chipSpec.inCount).fill('').map((_, i) => (
				<HeaderCell key={`i${i}`}>Input {i}</HeaderCell>
			))}
			{new Array(props.chipSpec.outCount).fill('').map((_, i, a) => (
				<HeaderCell key={`o${i}`}>Output{a.length > 1 ? ` ${i}` : ''}</HeaderCell>
			))}
		</FlexRow>
		{props.chipSpec.rows.map((r, i) => (
			<FlexRow key={i}>
				{r.map((v, j) => (
					<DataCell key={j} isOn={v}>{v ? 'ON' : 'OFF'}</DataCell>
				))}
			</FlexRow>
		))}
	</Container>
);

export default ChipSpecView;