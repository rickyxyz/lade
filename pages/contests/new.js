import ContestEditor from "../../components/Contest/ContestEditor";
import Frame from "../../components/Generic/Frame";
import ProblemEditor from "../../components/Problem/ProblemEditor";

const Problems = () => {
	return (
		<Frame page="New Contest">
			<ContestEditor purpose="new" />
		</Frame>
	);
};

export default Problems;
