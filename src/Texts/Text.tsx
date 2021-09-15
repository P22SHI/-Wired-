import styled from 'styled-components';
import Colors from 'src/Styles/Colors';

export const Text = styled.span`
	display: inline-block;
	box-sizing: border-box;
	overflow: hidden;
	text-overflow: ellipsis;
	text-align: center;
	font-size: 16px;
	color: ${Colors.Text};
	font-family: Consolas;
	letter-spacing: .1ch;
	user-select: none;
`;

export const Paragraph = styled(Text)`
	text-align: left;
`;

export const BoldText = styled(Text)`
	font-weight: 900;
`;