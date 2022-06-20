import clsx from "clsx";
import {
	BsCheckCircleFill,
	BsFillXCircleFill,
	BsFillChatLeftDotsFill,
} from "react-icons/bs";
import Stat from "../Generic/Stat";

const ProblemStats = ({ accepted, attempted, comments }) => {
	return (
		<div className="flex flex-row text-gray-700">
			<Stat icon={<BsCheckCircleFill />} title="Correct Answers" value={accepted} className="text-green-600" />
			<Stat icon={<BsFillXCircleFill />} title="Wrong Answers" value={attempted} className="text-red-600" />
			<Stat icon={<BsFillChatLeftDotsFill />} title="Comments" value={comments} />
		</div>
	);
};

export default ProblemStats;
