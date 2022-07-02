import { useContext, useEffect, useState } from "react";
import {
	FirebaseContext,
	setProblemsFromSnapshot,
	turnProblemsObjectToArray,
} from "../components/firebase";
import ProblemCard from "../components/Problem/ProblemCard";
import { getData } from "../components/firebase";
import { connect } from "react-redux";
import {
	mapDispatchToProps,
	mapStateToProps,
} from "../components/Redux/setter";
import Frame from "../components/Generic/Frame";
import { ProblemCardSK } from "../components/Generic/Skeleton";
import { genericToast, ToastContext } from "../components/Generic/Toast";

import "firebase/database";
import "firebase/compat/database";
import firebase from "firebase/compat/app";
import clsx from "clsx";
import Button from "../components/Generic/Button";
import { GoChevronDown, GoChevronUp, GoDash } from "react-icons/go";
import ViewTemplate from "../components/Generic/ViewTemplate";

const problemsPerPage = 5;

const Criteria = ({ children, thisCrit, criteria, onClick }) => {

	const [state, setState] = useState(null);

	useEffect(() => {
		if(Math.abs(criteria) !== thisCrit) {
			setState(<GoDash />);
			return;
		}
	
		if(criteria === thisCrit) {
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
			<span>
				{state}
			</span>
			<span>
				{children}
			</span>
		</Button>
	);
};

// List of all criterias
const crits = [{
	id: 1,
	type: "Time"
}, {
	id: 2,
	type: "Accepted"
}, {
	id: 3,
	type: "Attempted"
}, {
	id: 4,
	type: "Comments"
}];

const Problems = ({ problems, setProblems }) => {
	const { db, _topics, _subtopics } = useContext(FirebaseContext);

	return (
		<ViewTemplate 
			purpose="problem"
			title="Problems"
			crits={
				[{
					id: 1,
					type: "Time"
				}, {
					id: 2,
					type: "Accepted"
				}, {
					id: 3,
					type: "Attempted"
				}, {
					id: 4,
					type: "Comments"
				}]
			}
			dataPath="/problem"
			objects={problems}
			setObjects={setProblems}
			component={(problem) => (
				<ProblemCard
					key={problem.id}
					problem={problem}
					className={clsx(
						"relative top-44",
						"!rounded-none border-b-2 transition-all",
					)}
				/>
			)}
		/>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Problems);
