import { FlexColumn, FlexRow } from 'src/Containers/FlexContainers';
import MenuButton from 'src/Buttons/MenuButton';
import MenuTitle from 'src/Texts/MenuTitle';
import React from 'react';
import MenuContainer from 'src/Containers/MenuContainer';

type Props = {
	onClickLevelSelect: () => void;
	onClickSandbox: () => void;
	onClickCredits: () => void;
	onClickOptions: () => void;
};

const MainMenu = (props: Props) => (
	<MenuContainer>
		<FlexColumn center width={800}>
			<MenuTitle>WIRED</MenuTitle>
			<FlexRow>
				<MenuButton onClick={props.onClickLevelSelect}>Level Select</MenuButton>
			</FlexRow>
			<FlexRow>
				<MenuButton onClick={props.onClickSandbox}>Sandbox</MenuButton>
			</FlexRow>
			<FlexRow>
				<MenuButton onClick={props.onClickCredits}>Credits</MenuButton>
				<MenuButton onClick={props.onClickOptions}>Options</MenuButton>
			</FlexRow>
		</FlexColumn>
	</MenuContainer>
);

export default MainMenu;