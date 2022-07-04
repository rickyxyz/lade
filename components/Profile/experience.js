import "firebase/database";
import "firebase/compat/database";
import firebase from "firebase/compat/app";

export function getLevelFromExperience(exp) {
	return Math.ceil(Math.cbrt(exp)/3);
}

export function getExperienceFromLevel(level) {
	return Math.pow((3*level), 3);
}

export function getExperienceToNextLevelFromCurrentLevel(exp) {
	return (getExperienceFromLevel(getLevelFromExperience(exp) + 1) - getExperienceFromLevel(getLevelFromExperience(exp)));
}

export function getExperienceToNextLevel(exp) {
	return getExperienceToNextLevelFromCurrentLevel(exp) - exp;
}

export function getProgressToNextLevel(exp) {
	const numerator = exp, denominator = getExperienceToNextLevelFromCurrentLevel(exp);
	return numerator * 100 / denominator ;
}

export function setExperience(uid, exp) {
	firebase.database().ref(`/user/${uid}/`).child("experience").set(exp);
}