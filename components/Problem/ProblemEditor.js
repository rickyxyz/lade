import { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { mapDispatchToProps, mapStateToProps } from "../Redux/setter";
import pushid from "pushid";

import clsx from "clsx";
import Toggle from "../Generic/Toggle";
import Choice from "./Choice";
import Button from "../Generic/Button";
import Property from "../Generic/Property";
import { ToastContext } from "../Generic/Toast";
import QuillNoSSRWrapper from "../QuillWrapper";

import {
	FirebaseContext,
	getData,
	getId2,
	postData,
} from "../../components/firebase";
import "firebase/database";
import "firebase/compat/database";
import firebase from "firebase/compat/app";
import { properifyMatrix } from "../Utility/matrix";

const ProblemEditor = ({
	loggedIn,
	purpose,
	initialProblem = {
		topic: 0,
		subtopic: 0,

		owner: null,
		statement: "",
		choices: ["Correct Answer", "Choice"],
		accept: {
			string: "Correct Answer",
			choice: "Correct Answer",
			matrix: {
				rows: 3,
				columns: 3,
				matrix: [
					[null, null, null],
					[null, null, null],
					[null, null, null],
				],
			},
		},
		type: 0,
		metrics: {
			accepted: 0,
			attempted: 0,
			comments: 0,
		},
		setting: {
			visibility: 0,
			discussion: false,
		}
	},
}) => {
	const [problem, setProblem] = useState(initialProblem);
	const { db, _topics, _subtopics } = useContext(FirebaseContext);
	const [loading, setLoading] = useState(true);

	const router = useRouter();
	const { addToast } = useContext(ToastContext);

	const properties = [
		{
			name: "topic",
			element: (
				<select
					id="input-topic"
					onChange={(e) =>
						update({ topic: parseInt(e.target.value) })
					}
				>
					{_topics.map((topic, index) => (
						<option key={`topic-${topic}`} value={index}>
							{topic}
						</option>
					))}
				</select>
			),
		},
		{
			name: "subtopic",
			element: (
				<select
					id="input-subtopic"
					value={problem.subtopic}
					onChange={(e) =>
						update({ subtopic: parseInt(e.target.value) })
					}
				>
					{_subtopics[problem.topic] &&
						_subtopics[problem.topic].map((topic, index) => (
							<option key={`subtopic-${topic}`} value={index}>
								{topic}
							</option>
						))}
				</select>
			),
		},
		{
			name: "type",
			element: (
				<select
					id="input-type"
					value={problem.type}
					onChange={(e) => update({ type: parseInt(e.target.value) })}
				>
					<option value="0">Short Answer</option>
					<option value="1">Multiple Choice</option>
					<option value="2">Matrix</option>
				</select>
			),
		},
		{
			name: "visibility",
			element: (
				<select
					id="input-visibility"
					onChange={(e) =>
						update({ visibility: parseInt(e.target.value) }, "setting")
					}
				>
					<option value="0">Public</option>
					<option value="1">Unlisted</option>
					<option value="2">Private</option>
				</select>
			),
		},
		{
			name: "discussion",
			element: (
				<Toggle
					id="input-discussion"
					onChange={(value) => update({ discussion: value }, "setting")}
				/>
			),
		},
	];

	async function update(data, specific=null) {
		if (specific) {
			setProblem((old) => ({
				...old,
				[specific]: {
					...old[specific],
					...data,
				},
			}));
		} else {
			setProblem((old) => ({
				...old,
				...data,
			}));
		}
	}

	async function callback() {
		async function newQuestion() {
			const content =
				document.getElementsByClassName("ql-editor")[0].innerHTML;

			if (content.length < 20) {
				addToast({
					title: "Oops!",
					desc: "The problem is too short!",
					variant: "danger",
				});
				return;
			}

			const id = pushid();

			let topicWord = _topics[problem.topic],
				subTopicWord = _subtopics[problem.topic][problem.subtopic];

			await firebase
				.database()
				.ref(`/metrics`)
				.child(`problems`)
				.set(firebase.database.ServerValue.increment(1));

			const problemCount = await getData(db, "/metrics/problems");

			return await postData(db, `/problem/${id}`, {
				...problem,
				statement: content,
				owner: loggedIn.username,
				id2: getId2(topicWord, subTopicWord, problemCount),
			})
				.then(() => {
					return id;
				})
				.catch((e) => {
					setLoading(false);
					console.log(e);
				});
		}

		async function editQuestion() {
			const content =
				document.getElementsByClassName("ql-editor")[0].innerHTML;

			if (content.length < 20) return;

			await postData(db, `/problem/${problem.id}`, problem).catch((e) => {
				setLoading(false);
				console.log(e);
			});
		}

		setLoading(true);

		let destination;
		if (purpose === "new") {
			destination = await newQuestion();
		} else {
			await editQuestion();
			destination = problem.id;
		}

		if (destination) router.push(`/problems/${destination}`);
		else setLoading(false);
	}

	async function addChoice() {
		setProblem((prob) => {
			const newChoices = prob.choices;

			return {
				...prob,
				choices: [...newChoices, "Choice"],
			};
		});
	}

	async function editChoice(name, index) {
		setProblem((prob) => {
			const newChoices = prob.choices;

			if (newChoices[index] === problem.accept) editCorrect(name);

			newChoices[index] = name;

			return {
				...prob,
				choices: newChoices,
			};
		});
	}

	async function deleteChoice(name, index) {
		setProblem((prob) => ({
			...prob,
			choices: prob.choices.filter((choice, idx) => index !== idx),
		}));
	}

	async function editCorrect(object) {
		setProblem((prob) => ({
			...prob,
			accept: {
				...prob.accept,
				...object,
			},
		}));
	}

	async function editMatrix() {
		let matrix = properifyMatrix();

		editCorrect({
			matrix: matrix,
		});
	}

	const canShowEditor =
		purpose === "new" ||
		(purpose === "edit" && loggedIn && loggedIn.username === problem.owner);

	useEffect(() => {
		setLoading(false);

		if (
			purpose !== "new" &&
			typeof document !== undefined &&
			document.getElementsByClassName("ql-editor")[0] !== undefined
		) {
			document.getElementsByClassName("ql-editor")[0].innerHTML =
				problem.statement;
		}
	}, []);

	return canShowEditor ? (
		<>
			<div>
				<h1 className="h2">
					{purpose === "new" ? "Create Problem" : "Edit Problem"}
				</h1>
				<div className="mt-6">
					<Button
						className="w-20"
						loading={loading}
						onClick={() => callback()}
					>
						Finish
					</Button>
				</div>
			</div>
			<div>
				<h2 className="h4">Problem Settings</h2>
				<div className="flex flex-col">
					{properties.map(({ name, element }) => (
						<Property key={`property-${name}`} name={name}>
							{element}
						</Property>
					))}
				</div>
			</div>
			<div>
				<h2 className="h4">Problem Statement</h2>
				<QuillNoSSRWrapper
					modules={{
						toolbar: [
							["bold", "italic", "underline", "strike"],
							[{ list: "ordered" }, { list: "bullet" }],
							[{ script: "sub" }, { script: "super" }],
							["link", "formula"],
						],
					}}
					className="quill"
					placeholder="Write the question here..."
					onBlur={() => {
						const newStatement =
							document.getElementsByClassName("ql-editor")[0]
								.innerHTML;

						setProblem((prob) => ({
							...prob,
							statement: newStatement,
						}));
					}}
				/>
			</div>
			<div>
				<h2 className="h4">Problem Answer</h2>
				{[
					problem.type === 0 && (
						<div key="short-answer">
							<input
								type="text"
								placeholder="Type the correct answer here..."
								value={problem.accept.string}
								onChange={(e) => {
									editCorrect({
										string: e.target.value,
									});
								}}
							/>
						</div>
					),
					problem.type === 1 && (
						<div
							key="multiple-choice"
							className="flex flex-col h-auto"
						>
							{problem.choices.map((choice, index) => (
								<Choice
									key={`choice-${index}`}
									name={choice}
									index={index}
									checked={choice === problem.accept.choice}
									onNameChange={editChoice}
									onCheck={(name, index) => {
										editCorrect({ choice: choice });
									}}
									onDelete={deleteChoice}
									removable={index > 1}
								/>
							))}
							<Button
								className={clsx(
									"mt-4 w-min",
									problem.choices.length >= 6 && "hidden"
								)}
								onClick={() => {
									if (problem.choices.length < 6) addChoice();
								}}
							>
								Add&nbsp;Choice
							</Button>
						</div>
					),
					problem.type === 2 && (
						<div key="matrix" className="flex flex-col h-auto">
							<div className="flex flex-col gap-2">
								{[0, 1, 2].map((row) => (
									<div
										className="flex flex-row gap-2"
										key={`row-${row}`}
									>
										{[0, 1, 2].map((col) => (
											<div
												className="flex w-16"
												key={`cell-${row}-${col}`}
											>
												<input
													id={`cell-${row}-${col}`}
													className="!w-16"
													type="text"
													defaultValue={
														problem.accept.matrix
															.rows > row &&
														problem.accept.matrix
															.columns > col
															? problem.accept
																	.matrix
																	.matrix[
																	row
															  ][col]
															: ""
													}
													onChange={() =>
														editMatrix()
													}
												/>
											</div>
										))}
									</div>
								))}
							</div>
						</div>
					),
				]}
			</div>
		</>
	) : (
		<div>
			<p>You don&quot;t have permission.</p>
		</div>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(ProblemEditor);
