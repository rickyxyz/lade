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

const Problems = ({ loggedIn, }) => {
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
