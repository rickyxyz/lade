import Frame from "../../components/Generic/Frame";
import ProblemEditor from "../../components/Problem/ProblemEditor";

const Problems = () => {
	return (
		<Frame page="New Problem">
			<ProblemEditor purpose="new" />
		</Frame>
	);
};

export default Problems;
