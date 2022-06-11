import { useContext, useEffect, useState } from "react";

import {
	FirebaseContext,
	setProblemsFromSnapshot,
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
	const { db, _topics, _subtopics } = useContext(FirebaseContext);
	const [newRef, setNewRef] = useState(null);
	const [topRef, setTopRef] = useState(null);
	const [newProblems, setNewProblems] = useState([]);
	const [topProblems, setTopProblems] = useState([]);

	async function getProblems() {
		try {
			// Get the 3 newest problems.
			const _newRef = firebase.database().ref("problem").limitToLast(3);
			_newRef.on("value", (snapshot) =>
				setProblemsFromSnapshot(
					snapshot,
					snapshot.length !== newProblems.length,
					setNewProblems,
					_topics,
					_subtopics
				)
			);
			setNewRef(_newRef);

			// Get the 3 top problems (most solved).
			const _topRef = firebase
				.database()
				.ref("problem")
				.orderByChild("accepted")
				.limitToLast(3);
			_topRef.on("value", (snapshot) =>
				setProblemsFromSnapshot(
					snapshot,
					snapshot.length !== topProblems.length,
					setTopProblems,
					_topics,
					_subtopics
				)
			);
			setTopRef(_topRef);
		} catch (e) {
			console.log(e);
		}
	}

	useEffect(() => {
		if (db && _topics && _subtopics) getProblems();
	}, [db, _topics, _subtopics]);

	return (
		<>
			<Meta />
			<main className="flex flex-col w-full h-screen mt-12">
				<Landing />
				<ShapeDivider />
				<section
					className={clsx(
						"flex flex-col lg:flex-row justify-center",
						"px-8 py-8 z-20 gap-14 bg-gray-200"
					)}
				>
					<Folder
						title="New Questions"
						cards={newProblems}
						loading={newProblems.length === 0}
					/>
					<Folder
						title="Top Questions"
						cards={topProblems}
						loading={topProblems.length === 0}
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
