import clsx from "clsx";
import Card from "../Generic/Card";
import Button from "../Generic/Button";
import ProblemStats from "./ContestStats";
import { Interweave } from "interweave";
import LinkButton from "../Generic/LinkButton";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../Redux/setter";
import { FirebaseContext, postData } from "../firebase";
import { useContext, useEffect } from "react";
import Tag from "../Generic/Tag";
import ContestStats from "./ContestStats";
import { getUTCDateWithoutDay } from "../Utility/date";
import ContestHead from "./ContestHead";

const ContestCard = ({ className, contest, purpose, loggedIn }) => {
	const {
		id,
		title,
		topic,
		subtopic,
		owner,
		description,
		metrics,
		problems,
		time,
		comments,
	} = contest;

	const { db } = useContext(FirebaseContext);

	async function deleteContest() {
		await postData(db, `/contest/${id}`, null).then(() => {
			setTimeout(() => {
				if (location) location.reload();
			}, 150);
		});
	}

	return (
		<Card
			className={clsx("relative flex p-4", className)}
			footer={
				<>
					<div className="flex flex-row">
						<LinkButton
							variant="secondary"
							className="mr-4"
							href={`/contests/${id}`}
						>
							View
						</LinkButton>
					</div>
					<ContestStats {...metrics} />
				</>
			}
		>
			<div className="flex flex-col gap-2">
				<ContestHead {...contest} />
				<div className="mt-4">
					<Interweave content={description} />
				</div>
			</div>
			{loggedIn && purpose !== "landing" && loggedIn.username === owner && (
				<div className="absolute top-0 right-8 flex flex-row mt-4">
					<LinkButton
						href={`/contests/edit/${id}`}
						variant="ghost"
						className="mr-4 text-xs"
					>
						Edit
					</LinkButton>
					<Button
						onClick={() => deleteContest()}
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

export default connect(mapStateToProps, mapDispatchToProps)(ContestCard);
