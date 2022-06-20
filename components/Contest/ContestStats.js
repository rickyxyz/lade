import clsx from "clsx";
import {
	BsFillChatLeftDotsFill,
	BsFillPersonFill,
	BsFillQuestionOctagonFill,
} from "react-icons/bs";
import Stat from "../Generic/Stat";

const ContestStats = ({ questions, participants, comments }) => {
	return (
		<div className="flex flex-row text-gray-700">
			<Stat icon={<BsFillQuestionOctagonFill />} title="Questions" value={questions} />
			<Stat icon={<BsFillPersonFill />} title="Participants" value={participants} />
			<Stat icon={<BsFillChatLeftDotsFill />} title="Comments" value={comments} />
		</div>
	);
};

export default ContestStats;
