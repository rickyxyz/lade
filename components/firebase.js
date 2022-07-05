import { ref, set, child, get } from "firebase/database";
import { createContext } from "react";

export const FirebaseContext = createContext({
	app: null,
	db: null,
	_topics: null,
	_subtopics: null,
	topicGet: false,
	uid: null,
});

/**
 * Get data from the database.
 * @param {Object} db Firebase database instance.
 * @param {String} link The path to the data.
 * @returns
 */
export async function getData(db, link) {
	return await new Promise(function (res, rej) {
		get(child(ref(db), link))
			.then((snapshot) => {
				let result = null;
				if (snapshot.exists()) {
					result = snapshot.val();
				}
				res(result);
			})
			.catch((error) => {
				rej(error);
			});
	});
}

/**
 * Write data to the database.
 * @param {Object} db Firebase database instance.
 * @param {String} link The path to the data.
 * @param {Object} data The data to be written.
 * @returns
 */
export async function postData(db, link, data) {
	return await new Promise(function (res, rej) {
		set(ref(db, link), data)
			.then(() => res(null))
			.catch((error) => rej(error));
	});
}
/**
 * Convert objects of problems into an array, and it requires the _topics and _subtopics data too.
 * @param {Object} _problems Problems object
 * @param {Object} _topics Topics array
 * @param {Object} _subtopics Subtopics arrays
 * @returns
 */
export function turnProblemsObjectToArray(_problems, _topics, _subtopics, reversed = false) {
	const tempProblems = [];

	if (!_topics || !_subtopics) return;

	const entryProblems = Object.entries(_problems);
	if(reversed) {
		entryProblems.reverse();
	}
		
	for (let [id, _problem] of entryProblems) {
		let { topic, subtopic } = _problem;
		const currentSubtopic = _subtopics[topic];
		_problem.id = id;
		_problem.topic = _topics[topic];
		_problem.subtopic = currentSubtopic
			? currentSubtopic[subtopic]
			: "Unknown";
		tempProblems.unshift(_problem);
	}

	return tempProblems;
}

/**
 * Given a snapshot of problems, convert them into an array, then use it with the callback function. Also, requires _topics and _subtopics.
 * @param {Object} snapshot Snapshot object
 * @param {Boolean} condition Condition
 * @param {Function} callback Callback function
 * @param {Object} _topics Topics array
 * @param {Object} _subtopics Subtopics arrays
 */
export function setProblemsFromSnapshot(
	snapshot,
	condition,
	callback,
	_topics,
	_subtopics,
	reversed = false,
) {
	if (condition) {
		callback(
			// Since we get an object (not array) as a result, we convert them to array first.
			turnProblemsObjectToArray(snapshot.val(), _topics, _subtopics, reversed)
		);
	}
}

export function getId2(topic, subtopic, count) {
	const capsRegex = /[A-Z]/g;

	function caps(word) {
		return word.match(capsRegex).join("");
	}

	return `${caps(topic)}-${caps(subtopic)}-${count}`;
}

/**
 * Return an error message given a code.
 * @param {String} code Firebase error code.
 * @returns
 */
export function getErrorMessage(code) {
	switch (code) {
		case "auth/email-already-in-use":
			return { type: "email", message: "This email is already used." };
		case "auth/invalid-email":
			return { type: "email", message: "This email is invalid." };
		case "auth/user-not-found":
			return { type: "email", message: "This account does not exist." };
		case "auth/weak-password":
			return { type: "password", message: "The password is too weak." };
		case "auth/wrong-password":
			return { type: "password", message: "Wrong password." };
		default:
			return {
				type: "generic",
				message: "Something went wrong. Please try again later.",
			};
	}
}