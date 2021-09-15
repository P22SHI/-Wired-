import { ChipMetadata } from './ChipBlueprint';
import ChipSpec from './ChipSpec';
import TestCase from './TestCase';

type Problem = ChipSpec | {
	description: string,
	testCases: TestCase[],
};

export interface LevelProps {
	chipMetadata: ChipMetadata;
	problem: Problem;
};

export default class Level implements LevelProps {
	chipMetadata: ChipMetadata;
	problem: Problem;

	constructor(props: LevelProps) {
		this.chipMetadata = props.chipMetadata;
		this.problem = props.problem;
	}
};