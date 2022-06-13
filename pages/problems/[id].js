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

const CooldownWarning = ({ time }) => (
	<span>
		You must wait <b>{time}</b> before you can reanswer
		this question!
	</span>
);

const Problems = ({ id }) => {
	const { db, fd, _topics, _subtopics } = useContext(FirebaseContext);
	const [problem, setProblem] = useState(null);
	const [comments, setComments] = useState([]);
	const [state, setState] = useState({
		answer: "",
		loading: true,
		correct: false,
		lastAnswered: null,
		warning:
			"After you click submit, your answer will be immediately checked.",
	});

	const [init, setInit] = useState(false);

	const auth = getAuth();
	let uid =  auth.currentUser ? auth.currentUser.uid : null;

	async function getProblemData() {
		await getData(db, `/problem/${id}`)
			.then((_problem) => {
				let { topic, subtopic } = _problem;
				_problem.id = id;
				_problem.topic = _topics[topic];
				_problem.subtopic = _subtopics[topic][subtopic];
				setProblem(_problem);
			})
			.catch((e) => {});
	}

	async function getCommentData() {
		await getData(db, `/comment/${id}`)
			.then((_comments) => {
				const tempComments = [];
				for (let [id, _comment] of Object.entries(_comments)) {
					_comment.id = id;
					tempComments.unshift(_comment);
				}
				setComments(tempComments);
			})
			.catch((e) => {});
	}

	function checkCooldownForWarning(now, problem, lastAnswered, callback=()=>{}) {
		let cooldown = 10 * 1000; // 10 seconds
		if (problem.type === 1) cooldown = 60 * 10 * 1000; // 600 seconds

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

	async function getUserAnswer() {
		await getData(db, `/answer/${uid}/${id}`)
			.then((_answer) => {
				if (_answer) {
					const correct = _answer.answer === problem.accept;
					let warning = { warning: null };

					const now = new Date();
					const la = new Date(_answer.lastAnswered);

					checkCooldownForWarning(now, problem, la, (timeShow) => {
						warning.warning = <CooldownWarning time={timeShow} />
					});

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
			.catch((e) => { console.log(e) });
	}

	async function submitAnswer() {
		const now = new Date();

		if(checkCooldownForWarning(now, problem, state.lastAnswered, (timeShow) => setState({
			...state,
			warning: <CooldownWarning time={timeShow} />,
		})))
			return;

		setState({ ...state, loading: true });
		setTimeout(() => {
			console.log(now);
			try {
				if (state.answer === problem.accept) {
					alert("Correct Answer!!!");
					firebase
						.database()
						.ref(`/problem/${id}/`)
						.child("accepted")
						.set(firebase.database.ServerValue.increment(1));

                    // add experience on correct answer
                    firebase.database().ref(`/user/${uid}/`).child("experience").set(firebase.database.ServerValue.increment(10));
                    // fetch user data to check level up condition
                    getData(db, `/user/${uid}`).then((_userData)=>{
                        if(_userData.experience >= _userData.level * 100 || true){
                            firebase.database().ref(`/user/${uid}/`).child("experience").set(_userData.experience%(_userData.level*100));
                            firebase.database().ref(`/user/${uid}/`).child("level").set(firebase.database.ServerValue.increment(1));
                        }
                    });
				} else {
					alert("Wrong Answer!");
					firebase
						.database()
						.ref(`/problem/${id}/`)
						.child("attempted")
						.set(firebase.database.ServerValue.increment(1));
				}
				postData(db, `/answer/${uid}/${id}`, {
					answer: state.answer,
					lastAnswered: now.getTime(),
				});
			} catch (e) {
				console.log(e);
				setState({
					...state,
					loading: false,
					warning: null,
					lastAnswered: now,
				});
			}

			setState({
				...state,
				correct: state.answer === problem.accept,
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
		if (!init && problem) {
			getCommentData();
			getUserAnswer();
			setInit(true);
		}
	});

	useEffect(() => {
		console.log(state.correct);
	}, [ state ]);

	return (
		<Frame>
			{problem ? (
				<>
					<div>
						<h1 className="h2">{problem.topic}</h1>
						<p className="mt-4">{problem.subtopic}</p>
					</div>
					<div>
						<h2 className="h4">Problem Statement</h2>
						<Interweave content={problem.statement} />
						<div className="mt-8">
							{[
								problem.type === 0 && (
									<input
										key="short-answer"
										value={state.answer}
										onChange={(e) =>
											setState({
												...state,
												answer: e.target.value,
											})
										}
										disabled={state.correct}
									/>
								),
								problem.type === 1 && (
									<div>
										{problem.choices.map(
											(choice, index) => (
												<Choice
													key={`choice-${index}`}
													name={choice}
													index={index}
													removable={false}
													checked={
														state.answer === choice
													}
													onCheck={(name, index) =>
														setState({
															...state,
															answer: name,
														})
													}
													disabled={state.correct}
													triggerWhenInputIsClicked
													readOnly
												/>
											)
										)}
									</div>
								),
							]}
						</div>
						<div className="mt-8">
							<p className="text-red-500">{state.warning}</p>
							{state.correct ? (
								<Button
									variant="success"
									className={clsx("mt-4")}
								>
									<BsCheckCircleFill className="mr-2"/>
									Correct
								</Button>
							) : (
								<Button
									loading={state.loading}
									onClick={submitAnswer}
									className={clsx("w-20 mt-4")}
								>
									Submit
								</Button>
							)}
						</div>
					</div>
					<div>
						<h2 className="h4">Discussion</h2>
						<CommentEditor problemId={problem.id} discussion={problem.discussion} />
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
