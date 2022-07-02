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
import Tag from "../Generic/Tag";
import ProblemHead from "./ProblemHead";

const ProblemCard = ({ className, problem, loggedIn, purpose }) => {
	const { id, id2, topic, subtopic, owner, statement, metrics } = problem;
	const { db } = useContext(FirebaseContext);

	async function deleteProblem() {
		await postData(db, `/problem/${id}`, null).then(() => {
			setTimeout(() => {
				if (location) location.reload();
			}, 150);
		});
	}

	return (
		<Card
			className={clsx(className, "relative")}
			footer={
				<>
					<LinkButton
						variant="secondary"
						className="px-4 py-2 text-sm"
						href={`/problems/${id}`}
					>
						View
					</LinkButton>
					<ProblemStats {...metrics} />
				</>
			}
		>
			<div className="flex flex-col gap-2">
				<ProblemHead {...problem} />
				<div className="mt-4">
					<Interweave content={statement} />
				</div>
			</div>
			{loggedIn && purpose !== "landing" && loggedIn.username === owner && (
				<div className="absolute top-0 right-8 flex flex-row mt-4">
					<LinkButton
						href={`/problems/edit/${id}`}
						variant="ghost"
						className="mr-4 text-xs"
					>
						Edit
					</LinkButton>
					<Button
						onClick={() => deleteProblem()}
						className="text-xs"
						variant="ghost-danger"
					>
						Delete
					</Button>
				</div>
			)}
		</Card>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(ProblemCard);
