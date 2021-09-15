import React from 'react';
import { FlexRow } from 'src/Containers/FlexContainers';
import ChipFactory from 'src/Models/ChipFactory';
import styled from 'styled-components';
import ToolkitChip from './ToolkitChip';

type Props = {
	onSelect: (e: React.MouseEvent, chip: string) => void;
};

const ToolkitContainer = styled(FlexRow)`
	justify-content: space-around;
	flex-wrap: wrap;
`;

const Toolkit = (props: Props) => (
	<ToolkitContainer>
		{ChipFactory.getNames().map(n => (
			<ToolkitChip key={n} chipName={n} onSelect={props.onSelect}>{n}</ToolkitChip>
		))}
	</ToolkitContainer>
);

export default Toolkit;