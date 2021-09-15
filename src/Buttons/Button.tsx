import styled from 'styled-components';

const Button = styled.button`
	align-items: center;
	box-sizing: border-box;
	border: 4px ${props => props.onClick ? 'solid' : 'dashed'} #444;
	padding: 8px 16px;
	background-color: #222;
	cursor: pointer;

	&:hover {
		border: 4px ${props => props.onClick ? 'solid' : 'dashed'} #222;
		background-color: #444;
	}

	&:active {
		background-color: #333;
	}

	&:focus {
		outline: none;
	}
`;

export default Button;