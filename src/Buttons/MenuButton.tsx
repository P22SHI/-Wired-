import React, { ComponentProps } from 'react';
import ButtonText from 'src/Texts/ButtonText';
import styled from 'styled-components';
import Button from './Button';

const MenuButtonContainer = styled(Button)`
	flex-direction: column;
	flex-grow: 1;
	flex-shrink: 1;
	flex-basis: 0px;
	overflow: hidden;
	margin: 4px;
`;

const MenuButton = (props: ComponentProps<typeof MenuButtonContainer> & { className?: string }) => (
	<MenuButtonContainer {...props}>
		<ButtonText>{props.children}</ButtonText>
	</MenuButtonContainer>
);

export default MenuButton;