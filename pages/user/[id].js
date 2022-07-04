import { useContext, useEffect, useState } from "react";
import { FirebaseContext, getData, postData } from "../../components/firebase";
import Frame from "../../components/Generic/Frame";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { Interweave } from "interweave";
import CommentEntry from "../../components/Comment/CommentEntry";
import CommentEditor from "../../components/Comment/CommentEditor";
import Choice from "../../components/Problem/Choice";
import Button from "../../components/Generic/Button";
import { BsCheckCircleFill } from "react-icons/bs";
import "firebase/database";
import "firebase/compat/database";
import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import clsx from "clsx";
import { CircleLoad } from "../../components/Generic/Skeleton";
import { genericToast, ToastContext } from "../../components/Generic/Toast";
import pushid from "pushid";
import Tag from "../../components/Generic/Tag";
import { properifyMatrix } from "../../components/Utility/matrix";
import ProblemHead from "../../components/Problem/ProblemHead";
import ProblemAnswer from "../../components/Problem/ProblemAnswer";
import { compareAnswers } from "../../components/Problem/compareAnswers";
import Stat from "../../components/Profile/Stat";
import { getExperienceToNextLevel, getLevelFromExperience, getProgressToNextLevel } from "../../components/Profile/experience";
import Property from "../../components/Generic/Property";
import Bar from "../../components/Generic/Bar";

const User = ({ id }) => {
	const { db, fd, _topics, _subtopics } = useContext(FirebaseContext);
	const [user, setUser] = useState(null);
	const [ref, setRef] = useState(null);
	const [comments, setComments] = useState([]);

	// Indicate whether comments & user answers have been fetched or not.
	const [init, setInit] = useState(false);

	// Indicate the situation of the fetching process. -1 means fail whereas 1 means success.
	const [fetch, setFetch] = useState(0);

	// Contexts to invoke toasts.
	const { addToast } = useContext(ToastContext);

	const auth = getAuth();
	let uid = auth.currentUser ? auth.currentUser.uid : null;

	async function getUserData() {
		if(!id)
			return;

		const userRef = firebase.database().ref(`user/${id}`);
		userRef.on("value", (snapshot) => {
			const _user = snapshot.val();
			if((user && _user && _user.experience !== user.experience) || fetch === 0) {
				setUser(_user);
				setFetch(1);
			}
		});
		setRef(userRef);
	}

	useEffect(() => {
		if (db && _topics && _subtopics && fetch === 0) {
			getUserData();
		}
	}, [db, _topics, _subtopics]);
	
	useEffect(() => {
		return () => {
			if(ref)
				ref.off();
		};
	}, []);

	return (
		<Frame title={fetch === 1 ? `${user.username}'s Profile` : `Loading...`}>
			{fetch === 1 && (
				//If data fetch is successful.
				<>
					<div className="flex flex-col gap-4">
						<h1 className="h2">{ user.username }</h1>
					</div>
					<div>
						<h2 className="h4">User Statistics</h2>
						<Bar color="blue" className="!w-full" percentage={getProgressToNextLevel(user.experience)} />
						<div className="w-fit grid grid-cols-3 gap-2 mt-6">
							<Stat title="Level" value={getLevelFromExperience(user.experience)} />
							<Stat title="Experience" value={user.experience} />
							<Stat title="To Next Level" value={getExperienceToNextLevel(user.experience)} />
						</div>
					</div>
					<div>
						<h2 className="h4">Upvoted Problems</h2>
					</div>
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
