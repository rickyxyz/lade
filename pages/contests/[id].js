import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
	assignIdAndTopic,
	FirebaseContext,
	getData,
} from "../../components/firebase";
import "react-quill/dist/quill.snow.css";
import { Interweave } from "interweave";
import Button from "../../components/Generic/Button";
import { CircleLoad } from "../../components/Generic/Skeleton";
import DynamicTime from "../../components/Generic/Time";
import { genericToast, ToastContext } from "../../components/Generic/Toast";
import Frame from "../../components/Generic/Frame";
import CommentEntry from "../../components/Comment/CommentEntry";
import CommentEditor from "../../components/Comment/CommentEditor";
import ContestHead from "../../components/Contest/ContestHead";
import ContestStats from "../../components/Contest/ContestStats";
import clsx from "clsx";
import { getTimeDifference } from "../../components/Utility/date";
import Link from "next/link";
import ContestDetails from "../../components/Contest/ContestDetails";
import ContestTopParticipants from "../../components/Contest/ContestTopParticipants";

const Contests = ({ id }) => {
	const [contest, setContest] = useState(null);
	const [comments, setComments] = useState([]);
	const [participants, setParticipants] = useState([]);

	const [warning, setWarning] = useState({ message: "" });
	const [status, setStatus] = useState(false); // Has the user ever done this quest? etc.
	const [fetch, setFetch] = useState({
		contest: 0,
		participants: 0,
		comments: 0,
	}); // Indicate fetching process. -1 means fail; 1 means success.
	const [disabled, setDisabled] = useState(false); // For the "Participate" button.

	const { addToast } = useContext(ToastContext);
	const { db, fd, _topics, _subtopics, uid, topicGet } =
		useContext(FirebaseContext);

	// Only once if contest doesn't exist, get the contest data.
	useEffect(() => {
		if (db && topicGet && !contest) {
			getContestData();
		}
	}, [db, topicGet]);

	// Promise Chain: Get contest details and existing user's answers on the contest.
	async function getContestData() {
		await getData(db, `/contest/${id}`)
			.catch((e) => {
				setFetch((prevFetch) => ({
					...prevFetch,
					contest: -1,
				}));
			})
			.then(async (_contest) => {
				// [1] Assign topics and subtopics to contest.
				return assignIdAndTopic(_contest, id, _topics, _subtopics);
			})
			.then(async (_contest) => {
				// [2] Get user's existing answer, then set status depending on some conditions.
				const result = await getAnswersAndSetStatus(_contest)
					.then(() => {
						return 1;
					})
					.catch((e) => {
						return -1;
					});
				setFetch((prevFetch) => ({
					...prevFetch,
					contest: result,
				}));
			})
			.then(async () => {
				// [3] Get comments of the current contest.
				const result = await getCommentData()
					.then(() => {
						return 1;
					})
					.catch((e) => {
						return -1;
					});
				setFetch((prevFetch) => ({
					...prevFetch,
					comments: result,
				}));
			})
			.then(async () => {
				// [4] Get participants of the current contest.
				const result = await getContestParticipants()
					.then(() => {
						return 1;
					})
					.catch((e) => {
						return -1;
					});
				setFetch((prevFetch) => ({
					...prevFetch,
					participants: result,
				}));
			});
	}

	// Helper function for getContestData
	async function getAnswersAndSetStatus(_contest) {
		// [1] Fetch answer.
		const existingAnswer = await getData(db, `/answer/${uid}/${id}`);
		const now = new Date().getTime();

		// [2] Assign status depending on user's answers.
		if (existingAnswer && now < _contest.time.end) {
			if (existingAnswer.submittedAt) {
				// Case #1: User has submitted their answer, and contest is still ongoing.
				setStatus(2);
				setWarning({
					message: (
						<>
							You already submitted your answers. You cannot
							participate in it anymore.
						</>
					),
				});
			} else if (
				now >=
				existingAnswer.start + _contest.time.duration * 60 * 1000
			) {
				// Case #2: User has NOT submitted their answer (but did start), but contest is already over.
				setStatus(2);
				setWarning({
					message: (
						<>
							You have already{" "}
							<b>exceeded the duration of the contest</b>. You
							cannot participate in it anymore.
						</>
					),
				});
			} else {
				// Case #3: Otherwise, user still can work on the contest.
				setStatus(1);
				setWarning({
					message: (
						<>
							You have an existing session. You still have{" "}
							<b>
								<DynamicTime
									time={
										existingAnswer.start +
										_contest.time.duration * 60 * 1000
									}
								/>
							</b>
							.
						</>
					),
				});
			}
		} else {
			// Case #4: User has NOT started this contest, and the contest is already over.
			if (now >= _contest.time.end) {
				setDisabled(true);
				setWarning({
					message: (
						<>
							This contest has <b>ended</b>. You cannot
							participate in it anymore.
						</>
					),
				});

				// Case #5: User has NOT started this contest, and the contest (limited) is still ongoing.
			} else if (_contest.setting.limited) {
				setWarning({
					message: (
						<>
							This is a <b>limited time contest</b>. Upon
							starting, you have{" "}
							<b>{_contest.time.duration} minutes</b> to submit
							your answers.
						</>
					),
				});

				// Case #5: User has NOT started this contest, and the contest (unlimited) is still ongoing.
			} else {
				setWarning({
					message: (
						<>
							This is an <b>unlimited time contest</b>. Upon
							starting, you can submit your answers whenever you
							like,{" "}
							<b>as long as the contest has not ended yet</b>.
						</>
					),
				});
			}
		}

		setContest(_contest);
	}

	// Helper function for getContestData
	async function getContestParticipants() {
		const _participants = []; // Temporary variable that will be set to state.

		if (
			!contest.participants ||
			Object.keys(contest.participants).length === 0
		)
			return;

		for (const participantId of contest.participants) {
			const _participant = await getData(
				db,
				`/answer/${participantId}/${id}`
			);
			const _user = await getData(db, `/user/${participantId}`);
			_participant.username = _user.username;
			_participant.id = participantId;
			delete _participant.answers;
			_participants.push(_participant);
		}

		_participants.sort((a, b) => {
			if (b.score === a.score) {
				return a.submittedAt - b.submittedAt;
			}
			return b.score - a.score;
		});

		setParticipants(_participants);
	}

	// Helper function for getContestData
	async function getCommentData() {
		await getData(db, `/comment/${id}`).then((_comments) => {
			if (!_comments) return;
			const tempComments = [];
			for (let [id, _comment] of Object.entries(_comments)) {
				_comment.id = id;
				tempComments.unshift(_comment);
			}
			setComments(tempComments);
		});
	}

	return (
		<Frame contest={contest}>
			{fetch.contest === 1 && (
				//If data fetch is successful.
				<>
					<ContestHead
						{...contest}
						addon={<ContestStats {...contest.metrics} />}
						important
					/>
					<ContestDetails
						contest={contest}
						warning={warning}
						status={status}
						disabled={disabled}
					/>
					<ContestTopParticipants
						participants={participants}
						fetchParticipants={fetch.participants}
						uid={uid}
					/>
					<div>
						<h2 className="h4">Discussion</h2>
						<CommentEditor
							problemId={contest.id}
							discussion={contest.setting.discussion}
						/>
						{fetch.comments === 1 &&
							comments.map((comment) => (
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
			{fetch.contest === 0 && (
				//If data fetch is not yet finished.
				<div className="flex flex-row items-center justify-center">
					<CircleLoad />
				</div>
			)}
			{fetch.contest === -1 && (
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
