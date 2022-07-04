import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
	FirebaseContext,
	getData,
	setProblemsFromSnapshot,
	turnProblemsObjectToArray,
} from "../firebase";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../Redux/setter";
import Frame from "./Frame";
import { ProblemCardSK } from "./Skeleton";
import { genericToast, ToastContext } from "./Toast";

import "firebase/database";
import "firebase/compat/database";
import firebase from "firebase/compat/app";
import clsx from "clsx";
import Button from "./Button";
import { GoChevronDown, GoChevronUp, GoDash } from "react-icons/go";
import FrameHead from "./FrameHead";

const objectsPerPage = 3;

const Criteria = ({ children, thisCrit, criteria, onClick }) => {
	const [state, setState] = useState(null);

	useEffect(() => {
		if (Math.abs(criteria) !== thisCrit) {
			setState(<GoDash />);
			return;
		}

		if (criteria === thisCrit) {
			setState(<GoChevronUp />);
		} else {
			setState(<GoChevronDown />);
		}
	}, [criteria]);

	return (
		<Button
			className={clsx("flex flex-row justify-between py-1 gap-4")}
			variant={Math.abs(criteria) === thisCrit ? "primary" : "ghost"}
			onClick={onClick}
		>
			<span>{state}</span>
			<span>{children}</span>
		</Button>
	);
};

// List of all criterias
const crits = [
	{
		id: 1,
		type: "Time",
	},
	{
		id: 2,
		type: "Accepted",
	},
	{
		id: 3,
		type: "Attempted",
	},
	{
		id: 4,
		type: "Comments",
	},
];

const ViewTemplate = ({
	loggedIn,
	title,
	crits,
	dataPath,
	objects,
	setObjects,
	component,
	purpose,
}) => {
	const [displayObjects, setDisplayObjects] = useState([]);
	const { db, _topics, _subtopics } = useContext(FirebaseContext);
	const [lastPage, setLastPage] = useState(null);
	const [move, setMove] = useState(0);
	const [page, setPage] = useState(0);
	const [criteria, setCriteria] = useState(-1);
	const [fetch, setFetch] = useState(0);
	// 1 -> time
	// 2 -> accepted
	// 3 -> attempted
	// 4 -> comments
	// + -> ascending
	// - -> descending

	// Contexts to invoke toasts.
	const { addToast } = useContext(ToastContext);

	function limitObjects(_objects) {
		const lastIdxCalculated = objectsPerPage * (page + 1),
			lastIdxReal = _objects.length;
		const lastIdx = Math.min(lastIdxCalculated, lastIdxReal);
		
		const objectsInPage = Array.prototype.slice.call(
			_objects.filter((object, idx) => {

				if(!object.setting)
					return false;

				if(object.setting.visibility === 0)
					return true;

				if(object.setting.visibility >= 1 && object.owner === loggedIn.username)
					return true;
			
				return false;
			}),
			page * objectsPerPage,
			lastIdx
		);

		if(objectsInPage.length < objectsPerPage || lastIdxCalculated === lastIdxReal) {
			setLastPage(page);
		}

		return objectsInPage;
	}

	function parseCriteria(_criteria) {
		return [
			crits
				.filter(({ id }) => id === Math.abs(_criteria))[0]
				.type.toLowerCase(),
			Math.sign(_criteria),
		];
	}

	const sortedObjects = useMemo(() => {
		let [_criteria, sign] = parseCriteria(criteria);

		const _objects = [...objects];

		if(_criteria === "time") {
			return _objects.sort(
				(a, b) => (b.time["createdAt"] - a.time["createdAt"]) * sign
			);
		}

		return _objects.sort(
			(a, b) => (b.metrics[_criteria] - a.metrics[_criteria]) * sign
		);
	}, [objects, criteria]);

	async function sortObjects() {
		setObjects((sortedObjects));
	}

	useEffect(() => {
		setPage(0);
		sortObjects(criteria);
	}, [criteria]);

	useEffect(() => {
		setDisplayObjects(limitObjects(objects));
	}, [page]);

	useEffect(() => {
		setDisplayObjects(limitObjects(objects));
	}, [objects]);

	async function getObjects() {
		await getData(db, dataPath)
			.then((_objects) => {
				const arrayObjects = turnProblemsObjectToArray(
					_objects,
					_topics,
					_subtopics
				);
				setObjects((arrayObjects));
				setDisplayObjects(limitObjects(arrayObjects));
				setFetch(1);
			})
			.catch((e) => {
				addToast(genericToast("get-fail"));
				setFetch(-1);
			});
	}

	/*
		Clicking one criteria button repeatedly will rotate between two modes:
		-> ascending
		-> descending

		If user clicks 
	*/
	function newCriteria(_criteria) {
		// The user is already using this criteria to sort, but wants
		// to switch between ascending and descending.
		setMove(0);
		setLastPage(null);
		if (Math.abs(_criteria) === Math.abs(criteria)) {
			setCriteria((prevCrit) => prevCrit * -1);
		} else {
			setCriteria(_criteria);
		}
	}

	async function switchPage(direction) {
		if (direction > 0) {
			setPage((prevPage) => prevPage + 1);
		} else {
			if (page > 0) setPage((prevPage) => prevPage - 1);
		}
	}

	useEffect(() => {
		if (db && _topics && _subtopics) getObjects();
	}, [db, _topics, _subtopics]);

	return (
		<Frame uid={loggedIn.id} page={title}>
			<FrameHead>
				<h1 className="h2">{title}</h1>
				<article className="flex mt-4 gap-8">
					<section>
						<ul className="pagination flex">
							<li>
								<button
									className="w-24"
									onClick={() => switchPage(-1)}
									disabled={page === 0}
								>
									Previous
								</button>
							</li>
							<li>
								<div>Page: {page + 1}</div>
							</li>
							<li>
								<button
									className="w-24"
									onClick={() => switchPage(1)}
									disabled={page === lastPage}
								>
									Next
								</button>
							</li>
						</ul>
					</section>
					<section className="flex items-center">
						<span className="small-head w-32">Sort By</span>
						<div className="flex gap-4 w-full">
							{crits.map(({ id, type }) => (
								<Criteria
									key={`criteria-${type}`}
									thisCrit={id}
									criteria={criteria}
									onClick={() => newCriteria(id)}
								>
									{type}
								</Criteria>
							))}
							{/* <button className="border-2 border-gray-400 p-2 rounded-full text-gray-400" onClick={()=>sortProblems("upvote")}>upvote</button>
							<button className="border-2 border-gray-400 p-2 rounded-full text-gray-400" onClick={()=>sortProblems("downvote")}>downvote</button> */}
						</div>
					</section>
				</article>
			</FrameHead>
			{fetch === 1 ? (
				displayObjects.map((card, index) => component(card))
			) : (
				<>
					<ProblemCardSK className="relative top-44" />
					<ProblemCardSK className="relative top-44" />
					<ProblemCardSK className="relative top-44" />
				</>
			)}
		</Frame>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewTemplate);
