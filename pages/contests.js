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
import ContestCard from "../components/Contest/ContestCard";

const Contests = ({ contests, setContests }) => {
	const { db, _topics, _subtopics } = useContext(FirebaseContext);

	return (
		<ViewTemplate 
			title="Contests"
			crits={
				[{
					id: 1,
					type: "Time"
				}, {
					id: 2,
					type: "Comments"
				}, {
					id: 3,
					type: "Questions"
				}]
			}
			dataPath="/contest"
			objects={contests}
			setObjects={setContests}
			component={(contest) => (
				<ContestCard
					key={contest.id}
					contest={contest}
					className={clsx(
						"relative p-8",
						"!rounded-none border-b-2 transition-all",
						"top-44"
					)}
				/>
			)}
		/>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Contests);
