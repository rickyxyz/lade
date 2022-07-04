import { useContext, useEffect, useState } from "react";
import {
	FirebaseContext,
	getData,
	postData,
	turnProblemsObjectToArray,
} from "../../components/firebase";
import Frame from "../../components/Generic/Frame";
import "react-quill/dist/quill.snow.css";
import "firebase/database";
import "firebase/compat/database";
import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import clsx from "clsx";
import { CircleLoad } from "../../components/Generic/Skeleton";
import { ToastContext } from "../../components/Generic/Toast";
import Stat from "../../components/Profile/Stat";
import {
	getExperienceToNextLevel,
	getLevelFromExperience,
} from "../../components/Profile/experience";
import ProblemCard from "../../components/Problem/ProblemCard";

const User = ({ id }) => {
	const { db, fd, _topics, _subtopics } = useContext(FirebaseContext);
	const [user, setUser] = useState(null);
	const [ref, setRef] = useState(null);
	const [problems, setProblems] = useState([]);
	const [comments, setComments] = useState([]);

	// Indicate whether comments & user answers have been fetched or not.
	const [init, setInit] = useState(false);

	// Indicate the situation of the fetching process. -1 means fail whereas 1 means success.
	const [fetch, setFetch] = useState(0);
	const [problemFetch, setProblemFetch] = useState(0);

	// Contexts to invoke toasts.
	const { addToast } = useContext(ToastContext);

	const auth = getAuth();
	let uid = auth.currentUser ? auth.currentUser.uid : null;

	function filterAttemptedProblems(_answers, _problems) {
		console.log(_answers);
		console.log(_problems);
		return _problems.filter((problem) => problem.id in _answers);
	}

	async function getUserAndProblemData() {
		if (!id) return;

		const userRef = firebase.database().ref(`user/${id}`);
		userRef.on("value", (snapshot) => {
			const _user = snapshot.val();
			if (
				(user && _user && _user.experience !== user.experience) ||
				fetch === 0
			) {
				setUser(_user);
				setFetch(1);
			}
		});

		const answersObject = await getData(db, `answer/${id}`);

		await getData(db, "problem").then((_objects) => {
			const arrayObjects = turnProblemsObjectToArray(
				_objects,
				_topics,
				_subtopics
			);
			setProblems(filterAttemptedProblems(answersObject, arrayObjects));
			setProblemFetch(1);
		});

		setRef(userRef);
	}

	useEffect(() => {
		if (db && _topics && _subtopics && fetch === 0) {
			getUserAndProblemData();
		}
	}, [db, _topics, _subtopics]);

	useEffect(() => {
		return () => {
			if (ref) ref.off();
		};
	}, []);

	return (
		<Frame
			title={fetch === 1 ? `${user.username}'s Profile` : `Loading...`}
		>
			{fetch === 1 && (
				//If data fetch is successful.
				<>
					<div className="flex flex-col gap-4">
						<h1 className="h2">{user.username}&apos;s Profile</h1>
						<div className="w-fit grid grid-cols-3 gap-2 mt-6">
							<Stat
								title="Level"
								value={getLevelFromExperience(user.experience)}
							/>
							<Stat title="Experience" value={user.experience} />
							<Stat
								title="To Next Level"
								value={getExperienceToNextLevel(
									user.experience
								)}
							/>
						</div>
					</div>
					<div>
						<h2 className="h4 !mb-0">
							Recently Attempted Problems
						</h2>
						{problemFetch === 1 &&
							problems.length === 0 &&
							"This user has not solved any problems yet."}
						{problemFetch === -1 &&
							"We couldn&apos;t get the data. Please try again later."}
					</div>
					{problemFetch === 0 && (
						<div className="flex flex-row items-center justify-center">
							<CircleLoad />
						</div>
					)}
					{problemFetch === 1 &&
						problems.map((problem) => (
							<ProblemCard
								key={problem.id}
								problem={problem}
								className={clsx(
									"relative",
									"!rounded-none border-b-2 transition-all"
								)}
							/>
						))}
				</>
			)}
			{fetch === 0 && (
				//If data fetch is not yet finished.
				<div className="flex flex-row items-center justify-center">
					<CircleLoad />
				</div>
			)}
			{fetch === -1 && (
				//If data fetch fails.
				<div>
					<p className="h1 mb-4">Oops!</p>
					<p>
						We couldn&apos;t get the data. Please try again later.
					</p>
				</div>
			)}
		</Frame>
	);
};

export async function getServerSideProps({ params }) {
	const { id } = params;

	return { props: { id } };
}

export default User;
