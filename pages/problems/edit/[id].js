import { useContext, useEffect, useState } from "react";
import { FirebaseContext, getData } from "../../../components/firebase";
import Frame from "../../../components/Generic/Frame";
import "react-quill/dist/quill.snow.css";
import ProblemEditor from "../../../components/Problem/ProblemEditor";

const Problems = ({ id }) => {
	const { db, _topics, _subtopics } = useContext(FirebaseContext);
	const [problem, setProblem] = useState(null);

	async function getProblemData() {
		await getData(db, `/problem/${id}`)
			.then((_problem) => {
				_problem.id = id;
				setProblem(_problem);
			})
			.catch((e) => {});
	}

	useEffect(() => {
		if (db && _topics && _subtopics && !problem) getProblemData();
	}, [db, _topics, _subtopics]);

	return (
		<Frame>
			{problem ? (
				<ProblemEditor purpose="edit" initialProblem={problem} />
			) : (
				<div>The problem is not found.</div>
			)}
		</Frame>
	);
};

export async function getServerSideProps({ params }) {
	const { id } = params;

	return { props: { id } };
}

export default Problems;
