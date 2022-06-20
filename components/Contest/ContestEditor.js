import { useContext, useEffect, useState } from "react";
import { FirebaseContext, getData, postData } from "../../components/firebase";
import Button from "../Generic/Button";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../Redux/setter";
import pushid from "pushid";
import Toggle from "../Generic/Toggle";
import clsx from "clsx";
import { useRouter } from "next/router";
import QuillNoSSRWrapper from "../QuillWrapper";
import Property from "../Generic/Property";
import { BsArrowDown, BsArrowUp, BsLink45Deg, BsXLg } from "react-icons/bs";
import { query, ref } from "firebase/database";
import "firebase/database";
import "firebase/compat/database";
import firebase from "firebase/compat/app";
import { genericToast, ToastContext } from "../Generic/Toast";
import { getQuestionType } from "../Utility/questionType";
import Link from "next/link";
import { getDateFormat, getHourMinute, getTimeFormat } from "../Utility/date";

const ContestEditor = ({
	loggedIn,
	purpose,
	initialContest = {
		owner: null,
		title: "New Contest",
		description: "",
		topic: 0,
		subtopic: 0,
		problems: [],
		metrics: {
			participants: 0,
			comments: 0,
			weights: 0,
		},
		setting: {
			visibility: 0,
			discussion: false,
		},
		time: {
			createdAt: null,
			start: null,
			end: null,
			duration: 60,
		},
	},
}) => {
	const [contest, setContest] = useState(initialContest);
	const [tableProblems, setTableProblems] = useState([]);
	const [start, setStart] = useState({
		date: getDateFormat(new Date()),
		time: getTimeFormat(new Date()),
	});
	const [end, setEnd] = useState({
		date: getDateFormat(new Date()),
		time: getTimeFormat(new Date()),
	});
	const [loading, setLoading] = useState(true);

	const { db, _topics, _subtopics } = useContext(FirebaseContext);
	const { addToast } = useContext(ToastContext);

	const router = useRouter();

	/* 
	Input elements that updates the contest state:
	Title, description, topic, subtopic 
	*/
	const details = [
		{
			name: "title",
			element: (
				<input
					id="input-title"
					className="w-full"
					value={contest.title}
					onChange={(e) =>
						update({
							title: e.target.value,
						})
					}
				/>
			),
		},
		{
			name: "description",
			element: (
				<QuillNoSSRWrapper
					id="input-description"
					modules={{
						toolbar: [
							["bold", "italic", "underline", "strike"],
							[{ list: "ordered" }, { list: "bullet" }],
							[{ script: "sub" }, { script: "super" }],
							["link", "formula"],
						],
					}}
					className="quill w-full"
					placeholder="Write the description here..."
					defaultValue={contest.description}
				/>
			),
		},
		{
			name: "topic",
			element: (
				<select
					id="input-topic"
					onChange={(e) =>
						update({
							topic: parseInt(e.target.value),
						})
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
					value={contest.subtopic}
					onChange={(e) =>
						update({
							subtopic: parseInt(e.target.value),
						})
					}
				>
					<option value={null}>None</option>
					{_subtopics[contest.topic] &&
						_subtopics[contest.topic].map((topic, index) => (
							<option key={`subtopic-${topic}`} value={index}>
								{topic}
							</option>
						))}
				</select>
			),
		},
	];

	/* 
		Input elements that updates the contest settings:
		Visibility, duration, discussion.
	*/
	function constructDateTime() {}

	function validateDate(e, variable, action) {
		const _temp = new Date(e.target.value);
		const now = new Date();

		// Ensure start time can't be earlier than today.
		if (now.getTime() > _temp.getTime()) {
			_temp.setTime(now.getTime());
			action({
				...variable,
				time: getTimeFormat(_temp),
				date: getDateFormat(_temp),
			});
		} else {
			action({
				...variable,
				date: getDateFormat(_temp),
			});
		}

		return getDateFormat(_temp);
	}

	function validateTime(e, variable, action) {
		const [hour, minute] = getHourMinute(e.target.value);
		const _temp = new Date(variable.date);
		const now = new Date();

		_temp.setHours(hour);
		_temp.setMinutes(minute);

		// Ensure start time can't be earlier than today.
		if (now.getTime() > _temp.getTime()) {
			_temp.setTime(now.getTime());
		}

		action({
			...variable,
			time: getTimeFormat(_temp),
		});

		return getTimeFormat(_temp);
	}

	useEffect(() => {}, [contest]);

	const settings = [
		{
			name: "visibility",
			element: (
				<select
					id="input-visibility"
					onChange={(e) =>
						update(
							{ visibility: parseInt(e.target.value) },
							"setting"
						)
					}
				>
					<option value="0">Public</option>
					<option value="1">Unlisted</option>
					<option value="2">Private</option>
				</select>
			),
		},
		{
			name: "start",
			element: (
				<div className="flex items-center gap-4">
					<input
						id="input-start"
						className="w-40"
						value={start.date}
						min={getDateFormat(new Date())}
						onChange={(e) => validateDate(e, start, setStart)}
						type="date"
					/>
					<input
						id="input-start-time"
						className="w-40"
						value={start.time}
						min={getTimeFormat(new Date())}
						onChange={(e) => validateTime(e, start, setStart)}
						type="time"
					/>
				</div>
			),
		},
		{
			name: "end",
			element: (
				<div className="flex items-center gap-4">
					<input
						id="input-end"
						className="w-40"
						value={end.date}
						min={getDateFormat(new Date())}
						onChange={(e) => validateDate(e, end, setEnd)}
						type="date"
					/>
					<input
						id="input-end-time"
						className="w-40"
						value={end.time}
						min={getTimeFormat(new Date())}
						onChange={(e) => validateTime(e, end, setEnd)}
						type="time"
					/>
				</div>
			),
		},
		{
			name: "duration",
			element: (
				<div className="flex items-center gap-4">
					<Toggle
						id="input-limited"
						onChange={(value) =>
							update({ limited: value }, "setting")
						}
					/>
					{contest.setting.limited && (
						<div className="flex items-center gap-4">
							<input
								id="input-duration"
								className="w-40"
								type="number"
								value={contest.time.duration}
								onChange={(e) =>
									updateContestDuration(e.target.value)
								}
								disabled={!contest.setting.limited}
							/>
							<span>minutes</span>
						</div>
					)}
				</div>
			),
		},
		{
			name: "discussion",
			element: (
				<Toggle
					id="input-discussion"
					onChange={(value) =>
						update({ discussion: value }, "setting")
					}
				/>
			),
		},
	];

	// Function to overwrite contest state with new data.
	async function update(data, specific) {
		if (specific) {
			setContest((old) => ({
				...old,
				[specific]: {
					...old[specific],
					...data,
				},
			}));
		} else {
			setContest((old) => ({
				...old,
				...data,
			}));
		}
	}

	// Function when user clicks submit.
	async function callback() {
		function convertProblems() {
			let arrayProblems = [];
			tableProblems.forEach((prob) => {
				arrayProblems.push(prob.id2);
			});
			return arrayProblems;
		}

		function convertTime() {
			let _temp = new Date(start.date);
			let [hour, minute] = getHourMinute(start.time);
			_temp.setHours(hour);
			_temp.setMinutes(minute);
			let startProper = _temp.getTime();

			_temp = new Date(end.date);
			[hour, minute] = getHourMinute(end.time);
			_temp.setHours(hour);
			_temp.setMinutes(minute);
			let endProper = _temp.getTime();

			return [startProper, endProper];
		}

		function validation(title, description, startProper, endProper) {
			if (title.length < 8) {
				addToast({
					title: "Oops!",
					desc: "The contest title is too short.",
					variant: "danger",
				});
				return false;
			}

			if (description.length < 20) {
				addToast({
					title: "Oops!",
					desc: "The contest description is too short.",
					variant: "danger",
				});
				return false;
			}

			if (tableProblems.length === 0) {
				addToast({
					title: "Oops!",
					desc: "There should be at least one problem in the contest.",
					variant: "danger",
				});
				return false;
			}

			if (startProper > endProper) {
				addToast({
					title: "Oops!",
					desc: "Start time can't be later than the end time.",
					variant: "danger",
				});
				return false;
			}

			return true;
		}

		async function newContest() {
			const title = document.getElementById("input-title").value;

			const description =
				document.getElementsByClassName("ql-editor")[0].innerHTML;

			const arrayProblems = convertProblems();

			let [startProper, endProper] = convertTime();

			if (!validation(title, description, startProper, endProper)) return;

			const id = pushid();

			return await postData(db, `/contest/${id}`, {
				...contest,
				title: title,
				description: description,
				owner: loggedIn.username,
				problems: arrayProblems,
				metrics: {
					...contest.metrics,
					questions: arrayProblems.length,
				},
				time: {
					...contest.time,
					start: startProper,
					end: endProper,
				},
			})
				.then(() => {
					return id;
				})
				.catch((e) => {
					setLoading(false);
					addToast(genericToast("post-fail"));
				});
		}

		async function editContest() {
			const title = document.getElementById("input-title").value;

			const description =
				document.getElementsByClassName("ql-editor")[0].innerHTML;

			const arrayProblems = convertProblems();

			let [startProper, endProper] = convertTime();

			if (!validation(title, description, startProper, endProper)) return;

			return await postData(db, `/contest/${contest.id}`, {
				...contest,
				test: 123,
				title: title,
				description: description,
				problems: arrayProblems,
				metrics: {
					...contest.metrics,
					questions: arrayProblems.length,
				},
				time: {
					...contest.time,
					start: startProper,
					end: endProper,
				},
			})
				.catch((e) => {
					setLoading(false);
					addToast(genericToast("post-fail"));

					return null;
				})
				.then(() => {
					return contest.id;
				});
		}

		setLoading(true);

		let destination;
		if (purpose === "new") {
			destination = await newContest();
		} else {
			destination = await editContest();
		}

		if (destination) router.push(`/contests/${destination}`);
		else setLoading(false);
	}

	const canShowEditor =
		purpose === "new" ||
		(purpose === "edit" && loggedIn && loggedIn.username === contest.owner);

	// After componenet mount, set loading to false, so user can fully use the page.
	useEffect(() => {
		if (
			contest &&
			loading &&
			_topics &&
			_subtopics &&
			typeof document !== undefined &&
			document.getElementsByClassName("ql-editor")[0] !== undefined
		) {
			setLoading(false);
			if (purpose !== "new") {
				document.getElementsByClassName("ql-editor")[0].innerHTML =
					contest.description;
				setStart({
					date: getDateFormat(new Date(contest.time.start)),
					time: getTimeFormat(new Date(contest.time.start)),
				});
				setEnd({
					date: getDateFormat(new Date(contest.time.end)),
					time: getTimeFormat(new Date(contest.time.end)),
				});

				const _problems = [];
				contest.problems.forEach((prob) => {
					const problemQuery = firebase
						.database()
						.ref("problem")
						.orderByChild("id2")
						.equalTo(prob);

					problemQuery.once("value", (snapshot) => {
						const value = snapshot.val();

						if (value) {
							// This will be only executed once anyways, because
							// each problem has unique id2.
							snapshot.forEach((_problem) => {
								_problem = _problem.val();
								let { topic, subtopic } = _problem;
								_problem.id = Object.keys(value)[0];
								_problem.topic = _topics[topic];
								_problem.subtopic = _subtopics[topic][subtopic];
								_problem.weight = 10;
								_problems.push(_problem);
							});
						}
					});

					setTableProblems(_problems);
				});
			} else {
				update({
					time: {
						// By default, contest start time is the current time.
						createdAt: new Date().getTime(),
						start: new Date().getTime(),
						duration: 60,
					},
				});
			}
		}
	}, [_topics, _subtopics]);

	useEffect(() => {
		// Each time tableProblem updates,
		// update the total score/weight of the contest.
		setContest((_contest) => ({
			..._contest,
			weights: getWeights(),
		}));
	}, [tableProblems]);

	/*
		Some specific helper functions to update specific contest states.
	*/
	function getWeights() {
		let totalWeight = 0;
		tableProblems.forEach(({ weight }) => {
			totalWeight += parseInt(weight);
		});
		return totalWeight;
	}

	function updateContestDuration(duration = 0) {
		if (duration < 0) duration = 0;

		if (duration > 43200) duration = 43200;

		setContest((_contest) => ({
			..._contest,
			time: {
				..._contest.time,
				duration: duration,
			},
		}));
	}

	async function addProblemToContest() {
		const inputId2 = document.getElementById("input-Problem ID");
		const id2 = inputId2.value;

		if (id2.length < 7) return;

		// Check if the problem is already in the contest.
		let abort = false;
		tableProblems.every((_problem) => {
			if (_problem.id2 === id2) {
				abort = true;
				return false;
			}
		});

		if (abort) {
			addToast({
				title: "Oops!",
				desc: "That problem is already in the contest.",
				variant: "danger",
			});
			return;
		}

		inputId2.value = "";

		const problem = firebase
			.database()
			.ref("problem")
			.orderByChild("id2")
			.equalTo(id2);

		problem.once("value", (snapshot) => {
			const value = snapshot.val();

			if (value) {
				// This will be only executed once anyways, because
				// each problem has unique id2.
				snapshot.forEach((_problem) => {
					_problem = _problem.val();
					let { topic, subtopic } = _problem;
					_problem.id = Object.keys(value)[0];
					_problem.topic = _topics[topic];
					_problem.subtopic = _subtopics[topic][subtopic];
					_problem.weight = 10;
					setTableProblems([...tableProblems, _problem]);
				});
			} else {
				addToast({
					title: "Oops!",
					desc: "That problem does not exist.",
					variant: "danger",
				});
			}
		});
	}

	function updateProblemWeight(e, id2) {
		const newValue = e.target.value;

		let _problem;
		for (let i = 0; i < tableProblems.length; i++) {
			if (tableProblems[i].id2 === id2) {
				_problem = tableProblems[i];
				_problem.weight = newValue;

				setTableProblems((_tableProblems) => {
					_tableProblems[i] = _problem;
					return _tableProblems;
				});
				setContest((_contest) => ({
					..._contest,
					weights: getWeights(),
					time: {
						..._contest.time,
					},
				}));
				break;
			}
		}
	}

	function updateProblemIndex(dir, id2) {
		let _problem, temp;
		for (let i = 0; i < tableProblems.length; i++) {
			if (tableProblems[i].id2 === id2) {
				_problem = tableProblems[i];
				setTableProblems((_tableProblems) => {
					temp = _tableProblems[i + dir];
					_tableProblems[i + dir] = _problem;
					_tableProblems[i] = temp;
					return _tableProblems;
				});
				break;
			}
		}
	}

	function deleteProblem(id2) {
		setTableProblems((_tableProblems) =>
			_tableProblems.filter((prob) => prob.id2 !== id2)
		);
	}

	return canShowEditor ? (
		<>
			<div>
				<h1 className="h2">
					{purpose === "new" ? "Create Contest" : "Edit Contest"}
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
				<h2 className="h4">Contest Details</h2>
				<div className="flex flex-col mt-4">
					{details.map(({ name, element, className }) => (
						<Property
							key={`property-${name}`}
							name={name}
							className={className}
						>
							{element}
						</Property>
					))}
				</div>
			</div>
			<div>
				<h2 className="h4">Contest Settings</h2>
				<div className="flex flex-col mt-4">
					{settings.map(({ name, element, className }) => (
						<Property
							key={`property-${name}`}
							name={name}
							className={className}
						>
							{element}
						</Property>
					))}
				</div>
			</div>
			<div>
				<h2 className="h4">Contest Problems</h2>
				<Property name="Problem ID">
					<div className="flex gap-4">
						<input id="input-Problem ID" className="!w-40" />
						<Button onClick={() => addProblemToContest()}>
							Add
						</Button>
					</div>
				</Property>
				<table className="mt-8">
					<thead>
						<tr>
							<th>ID</th>
							<th>Topic</th>
							<th>Subtopic</th>
							<th>Type</th>
							<th>Points</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{tableProblems.length > 0 ? (
							tableProblems.map((prob, index) => (
								<tr key={prob.id2}>
									<td>
										<Link
											href={`/problems/${prob.id}`}
											passHref
										>
											<a
												className="flex items-center gap-2 link"
												target="_blank"
											>
												{prob.id2}
											</a>
										</Link>
									</td>
									<td>{prob.topic}</td>
									<td>{prob.subtopic}</td>
									<td>{getQuestionType(prob.type)}</td>
									<td>
										<input
											className="w-20"
											type="number"
											value={prob.weight}
											onChange={(e) =>
												updateProblemWeight(e, prob.id2)
											}
										/>
									</td>
									<td>
										<div className="flex gap-4">
											<Button
												className="px-2"
												variant="secondary"
												onClick={() =>
													updateProblemIndex(
														-1,
														prob.id2
													)
												}
												disabled={index === 0}
											>
												<BsArrowUp />
											</Button>
											<Button
												className="px-2"
												variant="secondary"
												onClick={() =>
													updateProblemIndex(
														1,
														prob.id2
													)
												}
												disabled={
													index ===
													tableProblems.length - 1
												}
											>
												<BsArrowDown />
											</Button>
											<Button
												className="px-2"
												variant="danger"
												onClick={() =>
													deleteProblem(prob.id2)
												}
											>
												<BsXLg />
											</Button>
										</div>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td className="text-center" colSpan="6">
									There are no problems in the contest.
								</td>
							</tr>
						)}
						{tableProblems.length > 0 && (
							<tr>
								<td className="text-right" colSpan="4">
									Total Points
								</td>
								<td>
									<input
										className="w-20"
										type="number"
										value={contest.weights}
										disabled={true}
									/>
								</td>
								<td></td>
							</tr>
						)}
						{/* <tr>
							<td>LA-M-12</td>
							<td>Linear Algebra</td>
							<td>Matrix</td>
							<td>Matrix</td>
							<td>
								<input className="border-none" type="number" />
							</td>
							<td>
								<div className="flex gap-4">
									<Button
										className="px-2"
										variant="secondary"
									>
										<BsArrowUp />
									</Button>
									<Button
										className="px-2"
										variant="secondary"
									>
										<BsArrowDown />
									</Button>
									<Button className="px-2" variant="danger">
										<BsXLg />
									</Button>
								</div>
							</td>
						</tr> */}
					</tbody>
				</table>
			</div>
		</>
	) : (
		<div>
			<p>You don&quot;t have permission.</p>
		</div>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(ContestEditor);
