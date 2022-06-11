import { useContext, useEffect, useState } from "react";
import { FirebaseContext, postData } from "../../components/firebase";
import Button from "../Generic/Button";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../Redux/setter";
import pushid from "pushid";
import Toggle from "../Generic/Toggle";
import clsx from "clsx";
import { useRouter } from "next/router";
import QuillNoSSRWrapper from "../QuillWrapper";
import Choice from "./Choice";

const Property = ({ name, children }) => {
	return (
		<article className="flex flex-row items-center mt-4 first:mt-0">
			<span className="small-head w-40">
				{name}
			</span>
			<div className="flex flex-row items-center h-10">{children}</div>
		</article>
	);
};

const ProblemEditor = ({
	loggedIn,
	purpose,
	initialProblem = {
		topic: 0,
		subtopic: 0,

		owner: null,
		statement: "",
		choices: ["Correct Answer", "Choice"],
		accept: "Correct Answer",
		type: 0,

		accepted: 0,
		attempted: 0,
		comments: 0,

		visibility: 0,
		discussion: false,
	},
}) => {
	const [problem, setProblem] = useState(initialProblem);
	const { db, _topics, _subtopics } = useContext(FirebaseContext);
	const [loading, setLoading] = useState(true);

	const router = useRouter();

	const properties = [
		{
			name: "topic",
			element: (
				<select
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
					// className=""
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
					value={problem.type}
					onChange={(e) => update({ type: parseInt(e.target.value) })}
				>
					<option value="0">Short Answer</option>
					<option value="1">Multiple Choice</option>
				</select>
			),
		},
		{
			name: "visibility",
			element: (
				<select
					onChange={(e) =>
						update({ visibility: parseInt(e.target.value) })
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
				<Toggle onChange={(value) => update({ discussion: value })} />
			),
		},
	];

	async function update(data) {
		setProblem((old) => ({
			...old,
			...data,
		}));
	}

	async function callback() {
		async function newQuestion() {
			const content =
				document.getElementsByClassName("ql-editor")[0].innerHTML;

			if (content.length < 20) return;

			const id = pushid();

			return await postData(db, `/problem/${id}`, {
				...problem,
				statement: content,
				owner: loggedIn.username,
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

		if(destination)
			router.push(`/problems/${destination}`);
		else
			setLoading(false);
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

	async function editCorrect(name) {
		setProblem((prob) => ({
			...prob,
			accept: name,
		}));
	}

	const canShowEditor =
		purpose === "new" ||
		(purpose === "edit" && loggedIn && loggedIn.username === problem.owner);

	useEffect(() => {
		setLoading(false);
	}, []);

	return (
		canShowEditor ? (
			<>
				<div>
					<h1 className="h2">
						{purpose === "new" ? "Create Problem" : "Edit Problem"}
					</h1>
					<div className="mt-6">
						<Button className="w-20" loading={loading} onClick={() => callback()}>Finish</Button>
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
						value={problem.statement}
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
									value={problem.accept}
									onChange={(e) => {
										editCorrect(e.target.value);
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
										checked={choice === problem.accept}
										onNameChange={editChoice}
										onCheck={editCorrect}
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
										if (problem.choices.length < 6)
											addChoice();
									}}
								>
									Add&nbsp;Choice
								</Button>
							</div>
						),
					]}
				</div>
			</>
		) : (
			<div>
				<p>You don&quot;t have permission.</p>
			</div>
		)
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(ProblemEditor);
