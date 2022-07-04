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
import { setExperience } from "../../components/Profile/experience";

const CooldownWarning = ({ time }) => (
	<span>
		You must wait <b>{time}</b> before you can reanswer this question!
	</span>
);

const Problems = ({ id }) => {
	const { db, fd, _topics, _subtopics } = useContext(FirebaseContext);
	const [problem, setProblem] = useState(null);
	const [comments, setComments] = useState([]);
	const [state, setState] = useState({
		answer: {
			string: "",
			choice: "",
			matrix: {
				rows: 3,
				columns: 3,
				matrix: [
					[null, null, null],
					[null, null, null],
					[null, null, null],
				],
			},
		}, // Save user's answers.
		loading: true, // Controls the button's loading state, to prevent users fromm spamming the button.
		correct: false, // Determines if the user's answers is correct or not.
		lastAnswered: null, // The time the user last answered, to calculate the cooldown.
		// Saves the warnig text. Later, used to show remaining cooldown time.
		warning:
			"After you click submit, your answer will be immediately checked.",
	});

	// Indicate whether comments & user answers have been fetched or not.
	const [init, setInit] = useState(false);

	// Indicate the situation of the fetching process. -1 means fail whereas 1 means success.
	const [fetch, setFetch] = useState(0);

	// Contexts to invoke toasts.
	const { addToast } = useContext(ToastContext);

	const auth = getAuth();
	let uid = auth.currentUser ? auth.currentUser.uid : null;

	async function getProblemData() {
		await getData(db, `/problem/${id}`)
			.then((_problem) => {
				let { topic, subtopic } = _problem;
				_problem.id = id;
				_problem.topic = _topics[topic];
				_problem.subtopic = _subtopics[topic][subtopic];
				setProblem(_problem);
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

	function checkCooldownForWarning(
		now,
		problem,
		lastAnswered,
		callback = () => {}
	) {
		let cooldown;
		switch (problem.type) {
			case 0:
				cooldown = 10 * 1000;
				break;
			case 1:
				cooldown = 60 * 10 * 1000;
				break;
			case 2:
				cooldown = 30 * 10 * 1000 * 0;
				break;
		}

		const timeElapsed = now - lastAnswered;

		if (lastAnswered && timeElapsed <= cooldown) {
			const timeWait = (cooldown - timeElapsed) / 1000;
			const minuteWait = Math.floor(timeWait / 60);
			const secondWait = parseInt(timeWait - minuteWait * 60);
			let timeShow = `${minuteWait}m ${secondWait}s`;
			if (minuteWait === 0) timeShow = `${secondWait}s`;

			callback(timeShow);
			return true;
		}

		return false;
	}

	/*
		This function is executed when user opens the problem page,
		to check whether if they already answered this problem or not.
	*/
	async function getUserAnswer() {
		// If no one is logged in, stop checking.
		if (!uid) return;

		await getData(db, `/answer/${uid}/${id}`)
			.then((_answer) => {
				if (_answer) {
					let correct = compareAnswers(
						problem.type,
						_answer.answer,
						problem.accept
					);
					// If answer exists, then check if it is correct or not.
					// correct = _answer.answer === problem.accept;
					let warning = { warning: null };

					const now = new Date();
					const la = new Date(_answer.lastAnswered);

					// If it is not correct, show a warning.
					if (!correct)
						checkCooldownForWarning(
							now,
							problem,
							la,
							(timeShow) => {
								warning.warning = (
									<CooldownWarning time={timeShow} />
								);
							}
						);

					// Update the state to reflect the user's answers.
					setState({
						...state,
						...warning,
						answer: _answer.answer,
						correct: correct,
						loading: false,
						lastAnswered: la,
					});
				} else {
					setState({
						...state,
						loading: false,
					});
				}
			})
			.catch((e) => {
				addToast(genericToast("get-fail"));
				console.log(e);
			});
	}

	/*
		This function is executed when user submits their answer.
	*/
	async function submitAnswer() {
		const now = new Date();

		// Check if they have cooldown. If so, warn them and stop checking.
		if (
			checkCooldownForWarning(
				now,
				problem,
				state.lastAnswered,
				(timeShow) =>
					setState({
						...state,
						warning: <CooldownWarning time={timeShow} />,
					})
			)
		)
			return;

		// Otherwise, make the button disabled to prevent spamming, and continue checking.
		setState({ ...state, loading: true });

		// Create a small delay.
		setTimeout(async () => {
			try {
				// Check if the answer is the same as the correct answer.
				if (
					compareAnswers(problem.type, state.answer, problem.accept)
				) {
					// If so, notify the user.
					addToast({
						title: "Great work!",
						desc: "Your answer is correct.",
						variant: "success",
					});

					// Increment the accepted counter of the problem.
					firebase
						.database()
						.ref(`/problem/${id}/metrics`)
						.child("accepted")
						.set(firebase.database.ServerValue.increment(1));

					// Adapt to users that signed up before experience was added.
					await getData(db, `/user/${uid}`).then((_userData) => {
						if(!_userData.experience) {
							setExperience(uid, 0);
						}
					});

                    // Add experience on correct answer
					
					setExperience(uid, firebase.database.ServerValue.increment(10));

				} else {
					// If it is not correct, notify the user.
					addToast({
						title: "Too bad...",
						desc: "Your answer is incorrect.",
						variant: "danger",
					});

					// Increment the attempted counter of the problem.
					firebase
						.database()
						.ref(`/problem/${id}/metrics`)
						.child("attempted")
						.set(firebase.database.ServerValue.increment(1));
				}

				// Afterwards, save the user's answer. Note that this only
				// saves the last answer of the user.
				postData(db, `/answer/${uid}/${id}`, {
					answer: state.answer,
					lastAnswered: now.getTime(),
				});
			} catch (e) {
				console.log(e);
				addToast(genericToast("post-fail"));
				setState({
					...state,
					loading: false,
					warning: null,
					lastAnswered: now,
				});
			}

			// Update the state reflecting the user's latest answer to this problem.
			setState({
				...state,
				correct: compareAnswers(
					problem.type,
					state.answer,
					problem.accept
				),
				loading: false,
				warning: null,
				lastAnswered: now,
			});
		}, 1000);
	}

	useEffect(() => {
		if (db && _topics && _subtopics && !problem) {
			getProblemData();
		}
	}, [db, _topics, _subtopics]);

	useEffect(() => {
		if (!init && problem && auth.currentUser) {
			getCommentData();
			getUserAnswer();
			setInit(true);
		}
	});

	//  Helper function to save proper matrix.
	function setMatrix() {
		const matrix = properifyMatrix();

		setState({
			...state,
			answer: {
				matrix: matrix,
			},
		});
	}

	return (
		<Frame problem={problem}>
			{fetch === 1 && (
				//If data fetch is successful.
				<>
					<div className="flex flex-col gap-4">
						<ProblemHead {...problem} important/>
					</div>
					<div>
						<h2 className="h4">Problem Statement</h2>
						<Interweave content={problem.statement} />
						<ProblemAnswer problem={problem} state={state} setState={setState} />
						<div className="mt-8">
							<p className="text-red-500">{state.warning}</p>
							{state.correct ? (
								<Button
									variant="success"
									className={clsx("mt-4")}
								>
									<BsCheckCircleFill className="mr-2" />
									Correct
								</Button>
							) : (
								<Button
									loading={state.loading}
									onClick={() => submitAnswer()}
									className={clsx("w-20 mt-4")}
								>
									Submit
								</Button>
							)}
						</div>
					</div>
					<div>
						<h2 className="h4">Discussion</h2>
						<CommentEditor
							problemId={problem.id}
							discussion={problem.discussion}
						/>
						{comments.map((comment) => (
							// pass the problem id down to UpvoteDownvote.js
							<CommentEntry
								key={comment.id}
								comment={comment}
								problemId={problem.id}
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

export default Problems;
