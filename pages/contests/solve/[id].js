import { useContext, useEffect, useState } from "react";
import {
	FirebaseContext,
	getData,
	postData,
	turnProblemsObjectToArray,
} from "../../../components/firebase";
import Frame from "../../../components/Generic/Frame";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { Interweave } from "interweave";
import CommentEntry from "../../../components/Comment/CommentEntry";
import CommentEditor from "../../../components/Comment/CommentEditor";
import Button from "../../../components/Generic/Button";
import { BsCheckCircleFill } from "react-icons/bs";
import "firebase/database";
import "firebase/compat/database";
import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import clsx from "clsx";
import { CircleLoad } from "../../../components/Generic/Skeleton";
import { genericToast, ToastContext } from "../../../components/Generic/Toast";
import pushid from "pushid";
import Tag from "../../../components/Generic/Tag";
import { properifyMatrix } from "../../../components/Utility/matrix";
import ContestHead from "../../../components/Contest/ContestHead";
import ContestStats from "../../../components/Contest/ContestStats";
import ProblemCard from "../../../components/Problem/ProblemCard";
import {
	mapDispatchToProps,
	mapStateToProps,
} from "../../../components/Redux/setter";
import { connect } from "formik";
import ProblemAnswer from "../../../components/Problem/ProblemAnswer";
import FrameHead from "../../../components/Generic/FrameHead";
import Bar from "../../../components/Generic/Bar";
import { getTimeDifference } from "../../../components/Utility/date";

const CooldownWarning = ({ time }) => (
	<span>
		You must wait <b>{time}</b> before you can reanswer this question!
	</span>
);

const SolveContest = ({ id }) => {
	const { db, fd, _topics, _subtopics } = useContext(FirebaseContext);
	const [contest, setContest] = useState(null);
	const [answers, setAnswers] = useState([]);
	const [session, setSession] = useState({});

	// Indicate whether comments & user answers have been fetched or not.
	const [init, setInit] = useState(false);

	// Indicate the situation of the fetching process. -1 means fail whereas 1 means success.
	const [fetch, setFetch] = useState(0);

	// Contexts to invoke toasts.
	const { addToast } = useContext(ToastContext);

	const auth = getAuth();
	let uid = auth.currentUser ? auth.currentUser.uid : null;

	async function getProblemData(problemIds) {
		const _problems = [];

		let allProblems = [];
		allProblems = await getData(db, `/problem`).then((_objects) =>
			turnProblemsObjectToArray(_objects, _topics, _subtopics)
		);
		problemIds.forEach((problemId) => {
			_problems.push(
				allProblems.filter((prob) => prob.id2 === problemId)[0]
			);
		});

		console.log(_problems);

		return _problems;
	}

	async function getContestData() {
		await getData(db, `/contest/${id}`)
			.then(async (_contest) => {
				let { topic, subtopic } = _contest;
				_contest.id = id;
				_contest.topic = _topics[topic];
				_contest.subtopic = _subtopics[topic][subtopic];
				_contest.problems = await getProblemData(_contest.problems);

				setContest(_contest);
				setFetch(1);
			})
			.then(() => {})
			.catch((e) => {
				setFetch(-1);
			});
	}

	async function setNthAnswer(n, answer) {
		const answersArray = answers.slice(0, answers.length);
		answersArray[n] = answer.answer;
		setAnswers(answersArray);
	}

	async function initiateSession(now) {
		await postData(db, `answer/${uid}/${id}`, {
			start: now,
		});
	}

	async function getExistingSession() {
		const _session = await getData(db, `answer/${uid}/${id}`);
	}

	useEffect(() => {
		function adjustValue(value) {
			if(value < 0) value = 0;
			if(value >= 100) value = 100;
			if(isNaN(value)) value = 0;
			return value;
		}

		let interval, _start, _end;

		if(contest && !session.start && !session.end) {
			const now = Date.now();

			initiateSession(now);

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
				_end = now + contest.time.duration * 60 * 1000;

				if(now <= contest.time.end)
					interval = setInterval(() => {
						const _now = Date.now();

						let percentage = Math.ceil(
							((_now - now) * 10000) /
								(contest.time.duration * 60 * 1000)
						) / 100;

						console.log(percentage);

						setSession((prevSession) => ({
							...prevSession,
							remaining: getTimeDifference(
								session.start + contest.time.duration * 60 * 1000,
								_now
							),
							percentage: adjustValue(percentage),
						}));
					}, 100);
			} else {
				/*
					Duration-less time contests:
					-> Start time is the contest start time.
					-> End time is the contest end time.
				*/
				_start = contest.time.start;
				_end = contest.time.end;

				if(now <= contest.time.end)
					interval = setInterval(() => {
						const _now = Date.now();
	
						let percentage = Math.ceil(
							((_now - contest.time.start) * 10000) /
								(contest.time.end - contest.time.start)
						) / 100;

						console.log(percentage);

						setSession((prevSession) => ({
							...prevSession,
							remaining: getTimeDifference(contest.time.end, _now),
							percentage: adjustValue(percentage),						
						}));
					}, 100);
			}

			setSession(prevSession => ({
				...prevSession,
				start: _start,
				end: _end,
				remaining: (now <= contest.time.end) ? prevSession.remaining : "-",
				percentage: (now <= contest.time.end) ? 100 : prevSession.percentage
			}));
		}

		return () => {
			if(interval)
				clearInterval(interval);
		};
	}, [contest]);

	useEffect(() => {
		if (db && _topics && _subtopics && !contest) {
			getContestData();
		}
	}, [db, _topics, _subtopics]);

	useEffect(() => {
		console.log("💎");
		console.log(answers);
	}, [answers]);

	useEffect(() => {
		if (!init && contest && auth.currentUser) {
			// getUserAnswer();
			setInit(true);
		}
	});
	
	return (
		<Frame contest={contest}>
			{fetch === 1 && (
				//If data fetch is successful.
				<>
					<FrameHead height="tall">
						<h1 className="h2">{contest.title}</h1>
						<Bar className="mt-4" percentage={session.percentage} color={session.remaining === "-" ? "red" : "green"} />
						<section className="flex bar justify-between mt-4">
							<span>
								<b>Start: </b>
								<time>{new Date(session.start).toLocaleString()}</time>
							</span>
							<span>
								<b>Remaining: </b>
								<span>
									{session.remaining}
								</span>
							</span>
							<span>
								<b>End: </b>
								<time>{new Date(session.end).toLocaleString()}</time>
							</span>
						</section>
						<Button className="mt-4">OK</Button>
					</FrameHead>
					{contest.problems &&
						contest.problems.map((problem, index) => {
							return (
								<div className="relative top-64" key={index}>
									<h2 className="h4">Question {index + 1}</h2>
									<Interweave content={problem.statement} />
									<ProblemAnswer
										problem={problem}
										state={answers[index]}
										setState={(ans) =>
											setNthAnswer(index, ans)
										}
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
