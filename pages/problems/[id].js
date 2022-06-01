import { useContext, useEffect, useState } from "react";
import { FirebaseContext, getData } from "../../components/firebase";
import Frame from "../../components/Generic/Frame";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { Interweave } from "interweave";
import CommentEntry from "../../components/Comment/CommentEntry";
import CommentEditor from "../../components/Comment/CommentEditor";
import Choice from "../../components/Problem/Choice";
import Button from "../../components/Generic/Button";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
	ssr: false,
	loading: () => <></>,
});

const Problems = ({ id }) => {
	const { db, _topics, _subtopics } = useContext(FirebaseContext);
	const [problem, setProblem] = useState(null);
	const [comments, setComments] = useState([]);
	const [state, setState] = useState({
		answer: null,
		loading: false,
		lastAnswered: null,
		warning:
			"After you click submit, your answer will be immediately checked.",
	});

	const [init, setInit] = useState(false);

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
		setInit(true);
	}

	async function submitAnswer() {
		const now = new Date();

		let cooldown = 10 * 1000; // 10 seconds
		if (problem.type === 1) cooldown = 60 * 10 * 1000; // 600 seconds

		const timeElapsed = now - state.lastAnswered;

		// Make the user wait if cooldown is still active.
		if (state.lastAnswered && timeElapsed <= cooldown) {
			const timeWait = (cooldown - timeElapsed) / 1000;
			const minuteWait = Math.floor(timeWait / 60);
			const secondWait = parseInt(timeWait - minuteWait * 60);
			let timeShow = `${minuteWait}m ${secondWait}s`;
			if (minuteWait === 0) timeShow = `${secondWait}s`;

			setState({
				...state,
				warning: (
					<span>
						You must wait <b>{timeShow}</b> before you can reanswer
						this question!
					</span>
				),
			});
			return;
		}

		setState({ ...state, loading: true });
		setTimeout(() => {
			if(state.answer === problem.accept) {
				alert("Correct Answer!!!");
			} else {
				alert("Wrong Answer!");
			}
			setState({
				...state,
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
		if (!init) getCommentData();
	});

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
									<input key="short-answer" onChange={(e) => setState({
										...state,
										answer: e.target.value,
									})} />
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
							<Button
								loading={state.loading}
								onClick={submitAnswer}
								className="w-20 mt-4"
							>
								Submit
							</Button>
						</div>
					</div>
					<div>
					<h2 className="h4">Discussion</h2>
						<CommentEditor problemId={problem.id} />
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
