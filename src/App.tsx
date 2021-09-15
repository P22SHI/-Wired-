import React from 'react';
import MainMenu from 'src/Scenes/MainMenu';
import styled from 'styled-components';
import { FlexColumn } from './Containers/FlexContainers';
import Level from './Models/Level';
import LevelSelectMenu from './Scenes/LevelSelectMenu';
import LevelView from './Scenes/LevelView';
import LogicGatesStage from './Stages/LogicGatesStage';
import Colors from './Styles/Colors';

const stages = [LogicGatesStage];

enum Scene {
	Credits = 'Credits',
	Level = 'Level',
	LevelSelectMenu = 'Level Select Menu',
	MainMenu = 'Main Menu',
	OptionsMenu = 'Options Menu',
	Sandbox = 'Sandbox',
};

type State = {
	currentScene: Scene;
	currentLevel: Level | null;
};

const initialState: State = {
	currentScene: Scene.MainMenu,
	currentLevel: null,
};

const AppContainer = styled(FlexColumn)`
	position: fixed;
	width: auto;
	height: auto;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background-color: ${Colors.DefaultBackground};
`;

class App extends React.Component<{}, State> {
	state = initialState;

	render() {
		return (
			<AppContainer>
				{this.renderScene()}
			</AppContainer>
		);
	}

	renderScene() {
		switch (this.state.currentScene) {
			case Scene.Level:
				if (!this.state.currentLevel) {
					throw new Error('failed to load level');
				}
				return <LevelView
					level={this.state.currentLevel}
					onClickBack={() => this.setState({ currentScene: Scene.LevelSelectMenu, currentLevel: null })}
				/>;
			case Scene.LevelSelectMenu:
				return <LevelSelectMenu
					onSelectLevel={levelProps => this.setState({ currentScene: Scene.Level, currentLevel: new Level(levelProps) })}
					onClickBack={() => this.setState({ currentScene: Scene.MainMenu })}
					stages={stages}
				/>;
			case Scene.MainMenu: 
				return <MainMenu
					onClickLevelSelect={() => this.setState({ currentScene: Scene.LevelSelectMenu })}
					onClickSandbox={() => this.setState({ currentScene: Scene.Sandbox })}
					onClickCredits={() => this.setState({ currentScene: Scene.Credits })}
					onClickOptions={() => this.setState({ currentScene: Scene.OptionsMenu })}
				/>;
			case Scene.OptionsMenu:
				// TODO
				return false;
			case Scene.Sandbox:
				// TODO
				return false;
		}
	}
}

export default App;
