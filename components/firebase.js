import { signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set, child, get } from "firebase/database";

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
