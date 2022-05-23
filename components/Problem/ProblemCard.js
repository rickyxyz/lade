import clsx from "clsx";
import Card from "../Generic/Card";
import Button from "../Generic/Button";
import ProblemStats from "./ProblemStats";
import { Interweave } from "interweave";
import LinkButton from "../Generic/LinkButton";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../Redux/setter";
import { FirebaseContext, postData } from "../firebase";
import { useContext } from "react";

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
	loggedIn,
}) => {

	const { db } = useContext(FirebaseContext);

	async function deleteProblem() {
		await postData(db, `/problem/${id}`, null).then(() => {
			setTimeout(() => {
				if(location)
					location.reload();
			}, 150)
		})
	}

	return (
		<Card className={clsx("relative flex p-4", className)}>
			<div className="flex flex-col">
				<h3 className="font-semibold text-xl">{topic}</h3>
				<span className="text-gray-700 text-sm">{subtopic} | Posted by <b>{owner}</b></span>
				<div className="mt-4">
					<Interweave content={statement} />
				</div>
			</div>
			<div className="flex flex-row items-center justify-between mt-4">
				<ProblemStats accepted={accepted} attempted={attempted} comments={comments} />
				<div className="flex flex-row">
					<LinkButton variant="secondary" className="mr-4" href={`/problems/${id}`}>
						Discuss
					</LinkButton>
					<LinkButton variant="primary" href={`/problems/${id}`}>Answer</LinkButton>
				</div>
			</div>
			{loggedIn && loggedIn.username === owner && (
					<div className="absolute top-0 right-8 flex flex-row mt-6">
						<LinkButton href={`/problems/edit/${id}`} variant="ghost" className="mr-4 text-xs">Edit</LinkButton>
						<Button onClick={() => deleteProblem()} className="text-xs" variant="ghost-danger">Delete</Button>
					</div>
				)}
		</Card>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(ProblemCard);
