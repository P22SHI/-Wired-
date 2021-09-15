import Colors from 'src/Styles/Colors';
import styled from 'styled-components';
import { GrowingFlexRow } from './FlexContainers';

const MenuContainer = styled(GrowingFlexRow)`
	background-color: ${Colors.DefaultBackground};
	justify-content: center;
`;

export default MenuContainer;