import { useContext, useEffect, useState } from "react";
import {
	FirebaseContext,
	getData,
	postData,
	turnProblemsObjectToArray,
} from "../../../components/firebase";
import "firebase/database";
import "firebase/compat/database";
import firebase from 'firebase/compat/app';
import { Interweave } from "interweave";
import "react-quill/dist/quill.snow.css";
import { getAuth } from "firebase/auth";
import ProblemAnswer from "../../../components/Problem/ProblemAnswer";
import FrameHead from "../../../components/Generic/FrameHead";
import Bar from "../../../components/Generic/Bar";
import { ModalContext } from "../../../components/Generic/Modal";
import Frame from "../../../components/Generic/Frame";
import Button from "../../../components/Generic/Button";
import { CircleLoad } from "../../../components/Generic/Skeleton";
import { ToastContext } from "../../../components/Generic/Toast";
import { getTimeDifference } from "../../../components/Utility/date";
import { compareAnswers } from "../../../components/Problem/compareAnswers";
import clsx from "clsx";
import { setExperience } from "../../../components/Profile/experience";
import { useRouter } from "next/router";

const SolveContest = ({ id }) => {
	const [ogContest, setOgContest] = useState(null);
	const [contest, setContest] = useState(null);
	const [answers, setAnswers] = useState([]); // The answers in the "answer sheet".
	const [session, setSession] = useState({}); // Bsaically like the metadata for "answer sheet".
	const [intv, setIntv] = useState(null); // Interval
	const [disabled, setDisabled] = useState(true); // Prevent submit button being used after contest ends.
	const [loading, setLoading] = useState(false); // Prevent submit button spamming.
	const [init, setInit] = useState(false); // Ensure that initiate session is only run once after db and contest exist.
	const [fetch, setFetch] = useState(0); // Indicate fetching process. -1 means fail; 1 means success.

	const { db, _topics, _subtopics, uid, topicGet } = useContext(FirebaseContext);
	const { addToast } = useContext(ToastContext);
	const { setModal } = useContext(ModalContext);

	const router = useRouter();

	// Only once if contest doesn't exist, get the contest data.
	useEffect(() => {
		if (db && topicGet && !contest) {
			getContestData();
		}
	}, [db, topicGet]);

	// Only once after db and contest exist, initiate the session.
	useEffect(() => {
		if (db && contest && !init) {
			initiateSession();
			setInit(true);
		}
	}, [db, contest]);

	// If the time is out, then set the interface to view only.
	function handleTimeRunOut() {
		if (session.percentage >= 100) {
			setSession((prevSession) => ({
				...prevSession,
				viewOnly: true,
			}));

			clearInterval(intv);

			// Force submit answers once time h as run out.
			submitAnswers(Date.now(), true);
		}
	}

	// Upon unmount, clear interval.
	useEffect(() => {
		return () => {
			if (intv) clearInterval(intv);
		};
	}, []);

	async function getContestData() {
		await getData(db, `/contest/${id}`)
			.then(async (_contest) => { 
				let { topic, subtopic } = _contest;
				_contest.id = id;
				_contest.problems = await getProblemData(_contest.problems);
				setContest(_contest);
				setFetch(1);
			})
			.catch((e) => {
				console.log(e);
				setFetch(-1);
			});
	}

	async function initiateSession() {
		// Get existing session.
		const _session = await getData(db, `answer/${uid}/${id}`);
		
		// If there is none, create a new one.
		// Otherwise, use existing data (start/end time).
		if (!_session) {
			await postData(db, `answer/${uid}/${id}`, {
				start: Date.now(),
			});
		} else {
			setAnswers(_session.answers ?? []);
			setSession((prevSession) => ({
				...prevSession,
				start: _session.start,
				end: _session.start + contest.time.duration * 60 * 1000,
			}));
		}

		function adjustValue(value) {
			if (value < 0) value = 0;
			if (value >= 100) value = 100;
			if (isNaN(value)) value = 0;
			return value;
		}

		let interval, _start, _end;

		console.log(_session);

		const now = Date.now();
		if (
			contest.time &&
			now < contest.time.end &&
			(!_session || (_session && !_session.submittedAt))
		) {
			/*
				Generally, users can take the contest anytime they like,
				as long as the contest end time hasn't passed yet.

				If it is a duration-less contest, the user can return
				anytime they like to th econtest page.

				Otherwise, the user can only spend a limited amount of time
				to do the contest.
			*/
			if (contest.setting.limited) {
				/*
					Limited time contests:
					-> Start time is the user initiates the test session.
					-> End time is start time plus the duration of the test.
				*/
				_start = now;
				_end = _start + contest.time.duration * 60 * 1000;

				if (now <= contest.time.end)
					setIntv(
						setInterval(() => {
							const _now = Date.now();

							let __start = _start;
							if (_session && _session.start)
								__start = _session.start;

							let percentage =
								Math.ceil(
									((_now - __start) * 10000) /
										(contest.time.duration * 60 * 1000)
								) / 100;

							setSession((prevSession) => ({
								...prevSession,
								remaining: getTimeDifference(
									__start + contest.time.duration * 60 * 1000,
									_now
								),
								percentage: adjustValue(percentage),
							}));

							if(percentage >= 100)
								handleTimeRunOut();
						}, 100)
					);
			} else {
				/*
					Duration-less time contests:
					-> Start time is the contest start time.
					-> End time is the contest end time.
				*/
				_start = contest.time.start;
				_end = contest.time.end;

				if (now <= contest.time.end)
					setIntv(
						setInterval(() => {
							const _now = Date.now();

							let percentage =
								Math.ceil(
									((_now - contest.time.start) * 10000) /
										(contest.time.end - contest.time.start)
								) / 100;

							setSession((prevSession) => ({
								...prevSession,
								remaining: getTimeDifference(
									contest.time.end,
									_now
								),
								percentage: adjustValue(percentage),
							}));

							if(percentage >= 100)
								handleTimeRunOut();
						}, 100)
					);
			}

			let newSession = {
				remaining: now <= contest.time.end ? session.remaining : "-",
				percentage: now <= contest.time.end ? 100 : session.percentage,
			};

			if (!_session) {
				newSession = {
					...newSession,
					start: _start,
					end: _end,
				};
			}

			setDisabled(false);
			setSession((prevSession) => ({
				...prevSession,
				...newSession,
			}));
		} else {
			setSession((prevSession) => ({
				...prevSession,
				viewOnly: true,
				remaining: "-",
				percentage: 100,
				score: _session.score,
			}));
		}
	}

	async function getProblemData(contestProblems) {
		// _problems are temporary arrays to store the final problem objects.
		const _problems = [];

		// Get all problems from the database.
		// TODO: definitely not the smartest choice, must think of a better solution.
		let allProblems = [];
		allProblems = await getData(db, `/problem`)
			.then((_objects) =>
				turnProblemsObjectToArray(_objects, _topics, _subtopics)
			)
			.catch((e) => console.log(e));

		// Finally, filter our problems that are actually in the contest.
		contestProblems.forEach((problem) => {
			let temp = allProblems.filter(
				(prob) => prob.id2 === problem.id2
			)[0];
			temp.weight = problem.weight;
			_problems.push(temp);
		});

		return _problems;
	}

	async function setNthAnswer(n, answer) {
		const answersArray = answers.slice(0, answers.length);
		answersArray[n] = answer.answer;
		setAnswers(answersArray);
	}

	async function submitAnswers(now, ignoreTime = false) {
		setLoading(true);

		// Calculate score
		let score = 0;
		contest.problems.forEach((prob, idx) => {
			if (
				answers[idx] &&
				compareAnswers(prob.type, answers[idx], prob.accept)
			)
				score += prob.weight;
		});

		if (now >= session.end && !ignoreTime) {
			addToast({
				title: "Oops!",
				desc: "The time has run out.",
				variant: "danger",
			});
			return;
		}

		await postData(db, `answer/${uid}/${id}`, {
			start: session.start,
			submittedAt: now,
			score: score,
			answers: answers,
		}).then(async () => {
			firebase
			.database()
			.ref(`/contest/${id}/metrics`)
			.child("participants")
			.set(firebase.database.ServerValue.increment(1));

			// Adapt to users that signed up before experience was added.
			await getData(db, `/user/${uid}`).then((_userData) => {
				if(!_userData.experience) {
					setExperience(uid, 0);
				}
			});

			// Add experience on completing a contest.
			setExperience(uid, firebase.database.ServerValue.increment(Math.ceil(100 * (score / contest.weights))));

			const participants = contest.participants ? [...contest.participants] : [];

			if(!participants.includes(uid))
				participants = [...participants, uid];

			return await postData(db, `contest/${id}`, {
				...contest,
				participants: participants,
			})
		}).catch(e => { console.log(e) });

		setLoading(false);
	}

	function confirmAnswers() {
		const now = Date.now();

		async function clickConfirm() {
			await submitAnswers(now).then(() => {
				setModal(null);
				router.push("/contests");
				setTimeout(() => {
					router.push(`/contests/${id}`);
				}, 100);
			});
		}

		setModal(
			<div className="w-96 flex flex-col">
				<h2 className="h3">Confirmation</h2>
				<p className="mt-4">
					Click confirm to submit your answers. You will be able to
					see the results immediately.
				</p>
				<Button
					onClick={() => clickConfirm()}
					className="mt-4"
					loading={loading}
				>
					Submit
				</Button>
			</div>
		);
	}

	return (
		<Frame contest={contest}>
			{fetch === 1 && (
				//If data fetch is successful.
				<>
					<FrameHead height="tall">
						<h1 className="h2">{contest.title}</h1>
						<Bar
							className="mt-4"
							percentage={session.percentage}
							color={session.remaining === "-" ? "red" : "green"}
						/>
						<section className="flex bar justify-between mt-4">
							<span>
								<b>Start: </b>
								<time>
									{new Date(session.start).toLocaleString()}
								</time>
							</span>
							<span>
								<b>Remaining: </b>
								<span>{session.remaining}</span>
							</span>
							<span>
								<b>End: </b>
								<time>
									{new Date(session.end).toLocaleString()}
								</time>
							</span>
						</section>
						<div className="flex mt-4">
							<Button
								onClick={() => confirmAnswers()}
								disabled={disabled}
							>
								Submit
							</Button>
							<div
								className={clsx(
									session.viewOnly
										? "flex items-center ml-4"
										: "hidden"
								)}
							>
								<span>
									<b>Score: </b>
									{`${session.score} / ${contest.weights}`}
								</span>
							</div>
						</div>
					</FrameHead>
					{contest.problems &&
						contest.problems.map((problem, index) => {
							return (
								<div
									className={clsx(
										"relative top-60 transition-colors",
										session.viewOnly &&
											compareAnswers(
												problem.type,
												answers[index],
												problem.accept
											) &&
											"bg-green-50",
										session.viewOnly &&
											!compareAnswers(
												problem.type,
												answers[index],
												problem.accept
											) &&
											"bg-red-50"
									)}
									key={`question-${index + 1}`}
								>
									<h2 className="h4">Question {index + 1}</h2>
									<Interweave content={problem.statement} />
									<ProblemAnswer
										id={problem.id2}
										problem={problem}
										state={{
											answer: answers[index],
										}}
										setState={(ans) =>
											setNthAnswer(index, ans)
										}
										disabled={session.viewOnly}
									/>
								</div>
							);
						})}
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

export default SolveContest;
