import React from 'react';
import Button from 'src/Buttons/Button';
import ButtonText from 'src/Texts/ButtonText';

type Props = {
	chipName: string;
	onSelect: (e: React.MouseEvent, chip: string) => void;
};

export default class ToolkitChip extends React.Component<Props> {
	componentDidMount() {

	}

	componentWillUnmount() {

	}

	render() {
		return (
			<Button onMouseDown={this.onMouseDown}>
				<ButtonText>{this.props.chipName}</ButtonText>
			</Button>
		);
	}

	onMouseDown = (e: React.MouseEvent) => {
		this.props.onSelect(e, this.props.chipName);
		e.stopPropagation();
		e.preventDefault();
	};
};