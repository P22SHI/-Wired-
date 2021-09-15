import styled from 'styled-components';

type Props = {
	center?: boolean;
	width?: number;
	height?: number;
};

export const FlexRow = styled.div<Props>`
	box-sizing: border-box;
	display: flex;
	flex-direction: row;
	flex-shrink: 1;
	flex-basis: 0px;
	justify-content: ${props => props.center ? 'center' : 'flex-start'};
	min-width: ${props => typeof props.width == 'number' ? `${props.width}px` : 'unset'};
	max-width: ${props => typeof props.width == 'number' ? `${props.width}px` : 'unset'};
	min-height: ${props => typeof props.height == 'number' ? `${props.height}px` : 'unset'};
	max-height: ${props => typeof props.height == 'number' ? `${props.height}px` : 'unset'};
`;

export const GrowingFlexRow = styled(FlexRow)`
	flex-grow: 1;
`;

export const FlexColumn = styled(FlexRow)`
	flex-direction: column;
`;

export const GrowingFlexColumn = styled(FlexColumn)`
	flex-grow: 1;
`;