import clsx from "clsx";
import Card from "../Generic/Card";
import Button from "../Generic/Button";
import { BsCheckCircleFill } from "react-icons/bs";
import ProblemStats from "./ProblemStats";

const ProblemCard = ({
	className,
	id,
	topic,
	subtopic,
	owner,
	statement,
	accepted,
	attempted,
	comments,
}) => {
	return (
		<Card className={clsx("flex p-4", className)}>
			<div className="flex flex-col">
				<h3 className="font-semibold text-xl">{topic}</h3>
				<span className="text-gray-700 text-sm">{subtopic} | Posted by <b>{owner}</b></span>
				<p className="mt-4">{statement}</p>
			</div>
			<div className="flex flex-row items-center justify-between mt-4">
				<ProblemStats accepted={accepted} attempted={attempted} comments={comments} />
				<div className="flex flex-row">
					<Button variant="ghost" className="mr-4">
						Discuss
					</Button>
					<Button>Answer</Button>
				</div>
			</div>
		</Card>
	);
};

export default ProblemCard;