import { useContext, useEffect, useState } from "react";
import { FirebaseContext } from "../components/firebase";
import ProblemCard from "../components/Problem/ProblemCard";
import { getData } from "../components/firebase";
import { connect } from "react-redux";
import {
	mapDispatchToProps,
	mapStateToProps,
} from "../components/Redux/setter";
import Frame from "../components/Generic/Frame";
import { ProblemCardSK } from "../components/Generic/Skeleton";

const Problems = ({ problems, setProblems }) => {
	// const [ problems, setProblems ] = useState([]);
	const { db, _topics, _subtopics } = useContext(FirebaseContext);

	// Indicate the situation of the fetching process. -1 means fail whereas 1 means success.
	const [fetch, setFetch] = useState(0);

	async function getProblems() {
		await getData(db, `/problem`)
			.then((_problems) => {
				const tempProblems = [];

				console.log(_problems);

				for (let [id, _problem] of Object.entries(_problems)) {
					let { topic, subtopic } = _problem;
					_problem.id = id;
					_problem.topic = _topics[topic];
					_problem.subtopic = _subtopics[topic][subtopic];
					tempProblems.unshift(_problem);
				}

				setProblems(tempProblems);
				setFetch(1);
			})
			.catch((e) => {
				setFetch(-1);
			});
	}

	useEffect(() => {
		if (db && _topics && _subtopics) getProblems();
	}, [db, _topics, _subtopics]);

	useEffect(() => {
		console.log(problems);
	}, [problems]);

	return (
		<Frame>
			<div>
				<h1 className="h2">Problems</h1>
			</div>
			{fetch === 1 ? (
				problems.map((card, index) => (
					<ProblemCard
						key={card.id}
						{...card}
						className="p-8 !rounded-none border-b-2 transition-all"
					/>
				))
			) : (
				<>
					<ProblemCardSK />
					<ProblemCardSK />
					<ProblemCardSK />
				</>
			)}
		</Frame>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Problems);
