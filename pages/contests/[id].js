import { useContext, useEffect, useState } from "react";
import { FirebaseContext, getData, postData } from "../../components/firebase";
import Frame from "../../components/Generic/Frame";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { Interweave } from "interweave";
import CommentEntry from "../../components/Comment/CommentEntry";
import CommentEditor from "../../components/Comment/CommentEditor";
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
import ContestHead from "../../components/Contest/ContestHead";
import ContestStats from "../../components/Contest/ContestStats";
import LinkButton from "../../components/Generic/LinkButton";
import { getTimeDifference } from "../../components/Utility/date";
import { useRouter } from "next/router";

const CooldownWarning = ({ time }) => (
	<span>
		You must wait <b>{time}</b> before you can reanswer this question!
	</span>
);

const Contests = ({ id }) => {
	const { db, fd, _topics, _subtopics } = useContext(FirebaseContext);
	const [contest, setContest] = useState(null);
	const [comments, setComments] = useState([]);
	const [disabled, setDisabled] = useState(true);
	const [warning, setWarning] = useState({
		message: "",
	});
	const router = useRouter();

	// Indicate whether comments & user answers have been fetched or not.
	const [init, setInit] = useState(false);

	// Indicate the situation of the fetching process. -1 means fail whereas 1 means success.
	const [fetch, setFetch] = useState(0);

	// Contexts to invoke toasts.
	const { addToast } = useContext(ToastContext);

	const auth = getAuth();
	let uid = auth.currentUser ? auth.currentUser.uid : null;

	async function getContestData() {
		await getData(db, `/contest/${id}`)
			.then((_contest) => {
				let { topic, subtopic } = _contest;
				_contest.id = id;
				_contest.topic = _topics[topic];
				_contest.subtopic = _subtopics[topic][subtopic];
				
				const now = new Date().getTime();
				if(now >= _contest.time.end) {
					setWarning({
						message: <>This contest has <b>ended</b>. You cannot participate in it anymore.</>,
					});
				} else if(_contest.setting.limited) {
					setDisabled(false);
					setWarning({
						message: <>This is a <b>limited time contest</b>. Upon starting, you have <b>{_contest.time.duration} minutes</b> to submit your answers.</>,
					});
				} else {
					setDisabled(false);
					setWarning({
						message: <>This is an <b>unlimited time contest</b>. Upon starting, you can submit your answers whenever you like, <b>as long as the contest has not ended yet</b>.</>,
					});
				}
				
				setContest(_contest);
				setFetch(1);
			})
			.catch((e) => {
				setFetch(-1);
			});
	}

	async function getCommentData() {
		await getData(db, `/comment/${id}`)
			.then((_comments) => {
				if (!_comments) return;
				const tempComments = [];
				for (let [id, _comment] of Object.entries(_comments)) {
					_comment.id = id;
					tempComments.unshift(_comment);
				}
				setComments(tempComments);
			})
			.catch((e) => {
				addToast(genericToast("get-fail"));
			});
	}

	function participate() {
		router.push(`/contests/solve/${id}`);
	}

	useEffect(() => {
		if (db && _topics && _subtopics && !contest) {
			getContestData();
		}
	}, [db, _topics, _subtopics]);

	useEffect(() => {
		if (!init && contest && auth.currentUser) {
			getCommentData();
			setInit(true);
		}
	});

	return (
		<Frame contest={contest}>
			{fetch === 1 && (
				//If data fetch is successful.
				<>
					<ContestHead {...contest} addon={(<ContestStats {...contest.metrics} />)} important/>
					<div>
						<h2 className="h4">Contest Details</h2>
						<Interweave content={contest.description} />
						<div className="mt-16 text-red-600">
							{warning.message}
						</div>
						<div className="mt-4">
							<Button variant="primary" onClick={() => participate()} disabled={disabled}>
								Participate
							</Button>
						</div>
					</div>
					<div>
						<h2 className="h4">Discussion</h2>
						<CommentEditor
							problemId={contest.id}
							discussion={contest.discussion}
						/>
						{comments.map((comment) => (
							// pass the contest id down to UpvoteDownvote.js
							<CommentEntry
								key={comment.id}
								comment={comment}
								problemId={contest.id}
							/>
						))}
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

export default Contests;
