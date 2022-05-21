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
	statement,
	accepted,
	attempted,
	comments,
}) => {
	return (
		<Card className={clsx("p-4 flex", className)}>
			<div className="flex flex-col">
				<h2 className="font-semibold text-xl">{topic}</h2>
				<span className="text-sm">{subtopic}</span>
				<p className="mt-4">{statement}</p>
			</div>
			<div className="flex flex-row items-center justify-between mt-4">
				<ProblemStats accepted={accepted} attempted={attempted} comments={comments} />
				<div>
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
