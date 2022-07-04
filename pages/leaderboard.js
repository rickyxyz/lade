import { useContext, useEffect, useState } from "react";
import {
	FirebaseContext,
} from "../components/firebase";
import { connect } from "react-redux";
import {
	mapDispatchToProps,
	mapStateToProps,
} from "../components/Redux/setter";
import Frame from "../components/Generic/Frame";
import { CircleLoad } from "../components/Generic/Skeleton";

import "firebase/database";
import "firebase/compat/database";
import firebase from "firebase/compat/app";
import clsx from "clsx";
import Button from "../components/Generic/Button";
import { GoChevronDown, GoChevronUp, GoDash } from "react-icons/go";
import { getLevelFromExperience } from "../components/Profile/experience";
import Link from "next/link";

const problemsPerPage = 5;

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

const Problems = ({ loggedIn, }) => {
	const { db, _topics, _subtopics } = useContext(FirebaseContext);

	const [users, setUsers] = useState([]);
	const [fetch, setFetch] = useState(0);
	const [ref, setRef] = useState(false);

	async function getUsersData() {
		try {
			const _topRef = firebase
				.database()
				.ref("user")
				.orderByChild("experience");

			_topRef.once("value", (snapshot) => {
				const value = snapshot.val();
				let _users = [];

				Object.entries(value).forEach((entry) => {
					_users.push({
						id: entry[0],
						...entry[1],
					});
				});

				_users = _users.filter((user) => user.experience);

				_users.sort((a, b) => {
					return b.experience - a.experience;
				});

				setUsers(_users);
				setRef(_topRef);
				setFetch(1);
			});
		} catch (e) {
			console.log(e);
			setFetch(-1);
		}
	}

	useEffect(() => {
		if (!ref) {
			getUsersData();
		}
	}, []);

	return (
		<Frame title="Leaderboard">
			<div>
				<h1 className="h2">Leaderboard</h1>
				<table className="mt-8">
					<thead>
						<tr>
							<th>No.</th>
							<th>Username</th>
							<th>Level</th>
							<th>Experience</th>
						</tr>
					</thead>
					<tbody>
						{fetch === 1 &&
							(users.length > 0 ? (
								users.map((participant, index) => (
									<tr key={participant.username} className={clsx( participant.id === loggedIn.id && "bg-yellow-100" )}>
										<td>{index + 1}</td>
										<td>
											<Link
												href={`/user/${participant.id}`}
												passHref
											>
												<a className="link">
													{participant.username}
												</a>
											</Link>
										</td>
										<td>
											{getLevelFromExperience(
												participant.experience
											)}
										</td>
										<td>{participant.experience}</td>
									</tr>
								))
							) : (
								<tr>
									<td className="text-center" colSpan="4">
										No one is in the leaderboard.
									</td>
								</tr>
							))}
						{fetch === 0 && (
							<tr>
								<td className="text-center" colSpan="4">
									<CircleLoad />
								</td>
							</tr>
						)}
						{fetch === -1 && (
							<tr>
								<td className="text-center" colSpan="4">
									We couldn&apos;t get the data. Please try
									again later.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</Frame>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Problems);
