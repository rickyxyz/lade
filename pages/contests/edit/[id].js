import { useContext, useEffect, useState } from "react";
import { FirebaseContext, getData } from "../../../components/firebase";
import Frame from "../../../components/Generic/Frame";
import "react-quill/dist/quill.snow.css";
import ProblemEditor from "../../../components/Problem/ProblemEditor";
import ContestEditor from "../../../components/Contest/ContestEditor";

const Contests = ({ id }) => {
	const { db } = useContext(FirebaseContext);
	const [contest, setContest] = useState(null);

	async function getContestData() {
		await getData(db, `/contest/${id}`)
			.then((_contest) => {
				_contest.id = id;
				setContest(_contest);
			})
			.catch((e) => {});
	}

	useEffect(() => {
		if (db && !contest) getContestData();
	}, [db]);

	return (
		<Frame contest={contest}>
			{contest ? (
				<ContestEditor purpose="edit" initialContest={contest} />
			) : (
				<div>The contest is not found.</div>
			)}
		</Frame>
	);
};

export async function getServerSideProps({ params }) {
	const { id } = params;

	return { props: { id } };
}

export default Contests;
