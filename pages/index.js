import { useContext, useEffect, useState } from "react";

import {
	FirebaseContext,
	setProblemsFromSnapshot,
	turnProblemsObjectToArray,
} from "../components/firebase";
import "firebase/database";
import "firebase/compat/database";
import firebase from "firebase/compat/app";

import Landing from "../components/Landing/Landing";
import ShapeDivider from "../components/Generic/ShapeDivider";
import Folder from "../components/Landing/Folder";
import clsx from "clsx";
import Meta from "../components/Generic/Meta";

const Home = () => {
	const { db, _topics, _subtopics, topicGet } = useContext(FirebaseContext);
	const [problems, setProblems] = useState([]);
	const [newProblems, setNewProblems] = useState([]);
	const [topProblems, setTopProblems] = useState([]);
	const [fetch, setFetch] = useState(0);

	async function getProblems() {
		try {
			const _newRef = firebase
				.database()
				.ref("problem")
				.orderByChild("setting/visibility")
				.equalTo(0)
			
			_newRef.once("value", (snapshot) =>
				setProblemsFromSnapshot(
					snapshot,
					snapshot.length !== newProblems.length,
					setProblems,
					_topics,
					_subtopics
				)
			);

			setFetch(1);
		} catch (e) {
			console.log(e);
			setFetch(-1);
		}
	}

	function assortProblems() {
		// Sort based on time, then get only three.
		let _problems1 = [...problems].sort((a, b) => -1*(a.time.createdAt - b.time.createdAt))
		_problems1 = _problems1.slice(0, Math.min(3, _problems1.length));

		// Sort based on problem activity, then get only three.
		let _problems2 = [...problems].sort((a, b) => (problemActivity(b.metrics) - problemActivity(a.metrics)));
		_problems2 = _problems2.slice(0, Math.min(3, _problems2.length));

		setNewProblems(_problems1);
		setTopProblems(_problems2);
		
		setFetch(2);
	}

	function problemActivity(problem) {
		const result = problem.accepted + problem.attempted + problem.comments;
		console.log(result);
		return problem.accepted + problem.attempted + problem.comments;
	}

	useEffect(() => {
		if(fetch === 1) {
			assortProblems();
		}
	}, [ problems ]);

	useEffect(() => {
		if (db && _topics && _subtopics && topicGet && fetch === 0) getProblems();
	}, [db, _topics, _subtopics, topicGet]);

	return (
		<>
			<Meta />
			<main className={clsx("flex flex-col w-full mt-12")}>
				<Landing />
				<ShapeDivider />
				<section
					className={clsx(
						"featured-questions",
						"flex flex-col lg:flex-row justify-center",
						"px-8 py-8 z-20 gap-14 bg-gray-200"
					)}
				>
					<Folder
						title="New Questions"
						cards={newProblems}
						loading={1 >= fetch && fetch >= 0}
					/>
					<Folder
						title="Top Questions"
						cards={topProblems}
						loading={1 >= fetch && fetch >= 0}
					/>
				</section>
				{/* <Sidebar />
                <content className="flex-grow">

                </content> */}
			</main>
		</>
	);
};

export default Home;
