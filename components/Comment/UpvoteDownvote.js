import { BsArrowDownCircle, BsArrowUpCircle, BsArrowDownCircleFill, BsArrowUpCircleFill } from "react-icons/bs";
import "react-quill/dist/quill.snow.css";

import { useContext, useEffect, useState } from "react";
import { FirebaseContext, getData, postData } from "../../components/firebase";

import { mapDispatchToProps, mapStateToProps } from "../Redux/setter";
import "react-quill/dist/quill.snow.css";
import { connect } from "react-redux";

import { getAuth } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import clsx from "clsx";

const UpvoteDownvote = ({ loggedIn, problemId, comment }) => {
	const { db } = useContext(FirebaseContext);

	const [record, setRecord] = useState(0);
	const [eRecord, setERecord] = useState(0);

	// get UID and upvote record
	const auth = getAuth();
	const uid = auth.currentUser.uid;

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

		await getData(db, `/comment/${problemId}/${comment.id}`).then(
			async (commentData) => {
				await postData(db, `/comment/${problemId}/${comment.id}`, {
					...commentData,
					[`${wordType}vote`]:
						commentData[`${wordType}vote`] + change,
					[`${pair(wordType)}vote`]:
						commentData[`${pair(wordType)}vote`] - change2,
				}).catch((e) => {});
			}
		);

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
		<div className="flex flex-row gap-1 items-center">
			<div
				className={clsx(
					"flex flex-row items-center w-12",
					"hover:text-red-500 active:text-red-800 focus:text-red-800",
					"cursor-pointer ",
					record === 1 && "text-red-600"
				)}
				onClick={() => react(1)}
			>
				<BsArrowUpCircle className={clsx(record === 1 && "hidden")} />
				<BsArrowUpCircleFill className={clsx(record !== 1 && "hidden")} />
				<span className="ml-2">
					{comment.upvote + (record === 1 ? 1 : 0) - (eRecord === 1 ? 1 : 0)}
				</span>
			</div>
			<div
				className={clsx(
					"flex flex-row items-center w-12 ml-4",
					"hover:text-blue-500 active:text-blue-800 focus:text-blue-800",
					"cursor-pointer ",
					record === -1 && "text-blue-600"
				)}
				onClick={() => react(-1)}
			>
				<BsArrowDownCircle className={clsx(record === -1 && "hidden")} />
				<BsArrowDownCircleFill className={clsx(record !== -1 && "hidden")} />
				<span className="ml-2">
					{comment.downvote + (record === -1 ? 1 : 0) - (eRecord === -1 ? 1 : 0)}
				</span>
			</div>
		</div>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(UpvoteDownvote);
