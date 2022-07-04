import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FirebaseContext, getData } from "../../components/firebase";
import { getAuth } from "firebase/auth";
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

const Contests = ({ id }) => {
	const { db, fd, _topics, _subtopics } = useContext(FirebaseContext);
	const [contest, setContest] = useState(null);
	const [comments, setComments] = useState([]);
	const [participants, setParticipants] = useState([]);
	const [warning, setWarning] = useState({ message: "" });
	const [disabled, setDisabled] = useState(false);
	const [status, setStatus] = useState(false); // Indicates whether the user has ever done this quest.
	const [init, setInit] = useState(false); // Ensure that getComment is run only once after contest exists.
	const [fetch, setFetch] = useState(0); // Indicate fetching process. -1 means fail; 1 means success.
	const [fetchParticipants, setFetchParticipants] = useState(0);
	const { addToast } = useContext(ToastContext);
	const router = useRouter();

	const auth = getAuth();
	const uid = auth.currentUser ? auth.currentUser.uid : null;

	// Only once if contest doesn't exist, get the contest data.
	useEffect(() => {
		if (db && _topics && _subtopics && !contest) {
			getContestData();
		}
	}, [db, _topics, _subtopics]);

	// Only once after contest exists, get comment data.
	useEffect(() => {
		if (!init && contest && auth.currentUser) {
			getCommentData();
			setInit(true);
		}
	});

	useEffect(() => {
		if (fetchParticipants === 0 && contest) {
			getContestParticipants()
				.then(() => setFetchParticipants(1))
				.catch((e) => {
					console.log(e);
					setFetchParticipants(-1);
				});
		}
	}, [contest]);

	// Get contest details and existing user's answers on the contest.
	async function getContestData() {
		await getData(db, `/contest/${id}`)
			.then(async (_contest) => {
				// [1] Assign topics and subtopics to contest.
				let { topic, subtopic } = _contest;
				_contest.id = id;
				_contest.topic = _topics[topic];
				_contest.subtopic = _subtopics[topic][subtopic];

				return _contest;
			})
			.then(async (_contest) => {
				// [2] Get user's existing answer.
				const existingAnswer = await getData(
					db,
					`/answer/${uid}/${id}`
				);
				const now = new Date().getTime();

				if (existingAnswer && now < _contest.time.end) {
					if (existingAnswer.submittedAt) {
						setStatus(2);
						setWarning({
							message: (
								<>
									You already submitted your answers. You
									cannot participate in it anymore.
								</>
							),
						});
					} else if (
						now >=
						existingAnswer.start +
							_contest.time.duration * 60 * 1000
					) {
						setStatus(2);
						setWarning({
							message: (
								<>
									You have already{" "}
									<b>exceeded the duration of the contest</b>.
									You cannot participate in it anymore.
								</>
							),
						});
					} else {
						setStatus(1);
						setWarning({
							message: (
								<>
									You have an existing session. You still have{" "}
									<b>
										<DynamicTime
											time={
												existingAnswer.start +
												_contest.time.duration *
													60 *
													1000
											}
										/>
									</b>
									.
								</>
							),
						});
					}
				} else {
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
					} else if (_contest.setting.limited) {
						setWarning({
							message: (
								<>
									This is a <b>limited time contest</b>. Upon
									starting, you have{" "}
									<b>{_contest.time.duration} minutes</b> to
									submit your answers.
								</>
							),
						});
					} else {
						setWarning({
							message: (
								<>
									This is an <b>unlimited time contest</b>.
									Upon starting, you can submit your answers
									whenever you like,{" "}
									<b>
										as long as the contest has not ended yet
									</b>
									.
								</>
							),
						});
					}
				}

				setContest(_contest);
				setFetch(1);
			})
			.catch((e) => {
				setFetch(-1);
			});
	}

	// Get all participants of the contest for the top participants table.
	async function getContestParticipants() {
		console.log(contest.participants);
		const _participants = []; // Temporary variable that will be set to state.

		if (!contest.participants) return;

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

	// Get all comments.
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

	// Redirect to solve contest page.
	function participate() {
		router.push(`/contests/solve/${id}`);
	}

	return (
		<Frame contest={contest}>
			{fetch === 1 && (
				//If data fetch is successful.
				<>
					<ContestHead
						{...contest}
						addon={<ContestStats {...contest.metrics} />}
						important
					/>
					<div>
						<h2 className="h4">Contest Details</h2>
						<Interweave content={contest.description} />
						<div className="mt-16 text-red-600">
							{warning.message}
						</div>
						<div className="mt-4">
							<Button
								variant={clsx(
									status === 1 ? "warning" : "primary"
								)}
								onClick={() => participate()}
								disabled={disabled}
							>
								{status === 1
									? "Continue"
									: status === 2
									? "View Results"
									: "Participate"}
							</Button>
						</div>
					</div>
					<div>
						<h2 className="h4">Top Participants</h2>
						<table className="mt-8">
							<thead>
								<tr>
									<th>No.</th>
									<th>Username</th>
									<th>Score</th>
									<th>Completion Time</th>
								</tr>
							</thead>
							<tbody>
								{fetchParticipants === 1 &&
									(participants.length > 0 ? (
										participants.map(
											(participant, index) => (
												<tr
													key={participant.username}
													className={clsx(
														participant.id ===
															uid &&
															"bg-yellow-100"
													)}
												>
													<td>{index + 1}</td>
													<td>
														<Link
															href={`/user/${participant.id}`}
															passHref
														>
															<a className="link">
																{
																	participant.username
																}
															</a>
														</Link>
													</td>
													<td>{participant.score}</td>
													<td>
														{new Date(
															participant.submittedAt
														).toLocaleString()}
													</td>
												</tr>
											)
										)
									) : (
										<tr>
											<td
												className="text-center"
												colSpan="4"
											>
												No one has done this contest
												yet.
											</td>
										</tr>
									))}
								{fetchParticipants === 0 && (
									<tr>
										<td className="text-center" colSpan="4">
											<CircleLoad />
										</td>
									</tr>
								)}
								{fetchParticipants === -1 && (
									<tr>
										<td className="text-center" colSpan="4">
											We couldn&apos;t get the data.
											Please try again later.
										</td>
									</tr>
								)}
							</tbody>
						</table>
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
