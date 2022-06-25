import {
	BsArrowDownCircle,
	BsArrowUpCircle,
	BsArrowDownCircleFill,
	BsArrowUpCircleFill,
} from "react-icons/bs";
import "react-quill/dist/quill.snow.css";

import { useContext, useEffect, useState } from "react";
import { FirebaseContext, getData, postData } from "../../components/firebase";

import { mapDispatchToProps, mapStateToProps } from "../Redux/setter";
import "react-quill/dist/quill.snow.css";
import { connect } from "react-redux";

import "firebase/database";
import "firebase/compat/database";
import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import { ref, onValue } from "firebase/database";

import clsx from "clsx";

const Reaction = ({
	type,
	record,
	className,
	onClick,
}) => {
	return (
		<div
			className={clsx(
				"flex flex-row justify-center items-center",
				"cursor-pointer ",
				className
			)}
			onClick={onClick}
		>
			{type === 1 ? (
				<>
					<BsArrowUpCircle
						className={clsx(record === 1 && "hidden")}
					/>
					<BsArrowUpCircleFill
						className={clsx(record !== 1 && "hidden")}
					/>
				</>
			) : (
				<>
					<BsArrowDownCircle
						className={clsx(record === -1 && "hidden")}
					/>
					<BsArrowDownCircleFill
						className={clsx(record !== -1 && "hidden")}
					/>
				</>
			)}
		</div>
	);
};

const UpvoteDownvote = ({ loggedIn, problemId, comment }) => {
	const { db } = useContext(FirebaseContext);

	const [record, setRecord] = useState(0);
	const [eRecord, setERecord] = useState(0);

	// get UID and upvote record
	const auth = getAuth();
	const uid = auth.currentUser ? auth.currentUser.uid : null;

	// up and downvote
	const upvote = comment.upvote + (record === 1 ? 1 : 0) - (eRecord === 1 ? 1 : 0);
	const downvote =  comment.downvote +
	(record === -1 ? 1 : 0) -
	(eRecord === -1 ? 1 : 0);

	async function react(type) {
		function pair(t) {
			return t === "up" ? "down" : "up";
		}

		let aRecord = parseInt(record);
		if (isNaN(aRecord)) aRecord = 0;

		type = parseInt(type);

		let change = aRecord === type ? -1 : 1;
		let change2 = 0;
		if (aRecord !== type && aRecord !== 0) {
			change2 = 1;
		}

		if (aRecord === 0) change = 1;

		const wordType = type === 1 ? "up" : "down";

		// For some unknown reason, if I remove this setstate,
		// the feature won't work properly.
		setRecord(aRecord === type ? 0 : type);

		firebase
			.database()
			.ref(`/comment/${problemId}/${comment.id}`)
			.child(`${wordType}vote`)
			.set(firebase.database.ServerValue.increment(change));
		firebase
			.database()
			.ref(`/comment/${problemId}/${comment.id}`)
			.child(`${pair(wordType)}vote`)
			.set(firebase.database.ServerValue.increment(-change2));

		await getData(db, `/user/${uid}`).then(async (userData) => {
			await postData(db, `/user/${uid}`, {
				...userData,
				reaction: {
					...userData.reaction,
					[comment.id]: aRecord === type ? null : type,
				},
			}).catch((e) => {});
		});
	}

	useEffect(() => {
		getData(db, `/user/${uid}/reaction`).then((reaction) => {
			if (reaction !== null && record != reaction[comment.id]) {
				// Both record and eRecord indicate the user's reactions to a comment.
				// "record" will change as soon as user changes their reaction.
				// "eRecord" will not change as it only serves to show the user's initial reaction.
				setRecord(reaction[comment.id] ?? 0);
				setERecord(reaction[comment.id] ?? 0);
			}
		});
	}, []);

	return (
		<div className="flex flex-col gap-1 items-center">
			<Reaction
				className={clsx(
					"hover:text-orange-500 active:text-orange-800 focus:text-orange-800",
					record === 1 && "text-orange-600"
				)}
				type={1}
				record={record}
				onClick={() => react(1)}
			/>
				<span className="w-8 text-center">
					{ upvote - downvote }
				</span>
			<Reaction
				className={clsx(
					"hover:text-blue-500 active:text-blue-800 focus:text-blue-800",
					record === -1 && "text-blue-600"
				)}
				type={-1}
				record={record}
				onClick={() => react(-1)}
			/>
		</div>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(UpvoteDownvote);
