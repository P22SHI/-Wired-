import { FlexColumn, FlexRow } from 'src/Containers/FlexContainers';
import { BoldText } from 'src/Texts/Text';
import MenuButton from 'src/Buttons/MenuButton';
import MenuTitle from 'src/Texts/MenuTitle';
import React from 'react';
import MenuContainer from 'src/Containers/MenuContainer';
import { LevelProps } from 'src/Models/Level';
import Stage from 'src/Models/Stage';

type Props = {
	onSelectLevel: (levelProps: LevelProps) => void;
	onClickBack: () => void;
	stages: Stage[];
};

const LevelSelectMenu = (props: Props) => (
	<MenuContainer>
		<FlexColumn center width={800}>
			<MenuTitle>WIRED</MenuTitle>
			{props.stages.map((s, i) => (
				<React.Fragment key={i}>
					<BoldText>Stage {i} - {s.name}</BoldText>
					<FlexRow>
						{s.levels.map((level, j) => 
							<MenuButton key={j} onClick={() => props.onSelectLevel(level)}>{level.chipMetadata.name}</MenuButton>
						)}
					</FlexRow>
				</React.Fragment>
			))}
			<FlexRow>
				<MenuButton onClick={props.onClickBack}>Back</MenuButton>
			</FlexRow>
		</FlexColumn>
	</MenuContainer>
);

export default LevelSelectMenu;