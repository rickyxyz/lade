import clsx from "clsx";
import Card from "../Card";
import Button from "../Generic/Button";
import {
	BsCheckCircleFill,
	BsFillXCircleFill,
	BsFillChatLeftDotsFill,
} from "react-icons/bs";

const Column = ({ className, icon, value }) => {
	return (
		<div className={clsx("flex flex-row items-center mr-4", className)}>
			{icon}
			<span className="ml-2">{value}</span>
		</div>
	);
};

const ProblemStats = ({ accepted, attempted, comments }) => {
	return (
		<div className="flex flex-row">
			<Column icon={<BsCheckCircleFill />} value={accepted} className="text-green-600" />
			<Column icon={<BsFillXCircleFill />} value={attempted} className="text-red-600" />
			<Column icon={<BsFillChatLeftDotsFill />} value={comments} />
		</div>
	);
};

export default ProblemStats;
