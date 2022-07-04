import "firebase/database";
import "firebase/compat/database";
import firebase from "firebase/compat/app";

export function getLevelFromExperience(exp) {
	if(isNaN(exp)) {
		return 0;
	}
	
	return Math.ceil(Math.cbrt(exp)/3);
}

function getRealLevelFromExperience(exp) {
	return (Math.cbrt(exp)/3);
}

export function getExperienceFromLevel(level) {
	return Math.pow((3*level), 3);
}

export function getExperienceToNextLevelFromCurrentLevel(exp) {
	const currentLevel = getLevelFromExperience(exp) + 1;
	return (getExperienceFromLevel(currentLevel) - getExperienceFromLevel(currentLevel - 1));
}

export function getExperienceToNextLevel(exp) {
	return getExperienceFromLevel(getLevelFromExperience(exp)) - exp;
}

export function getProgressToNextLevel(exp) {
	const numerator = exp - getExperienceToNextLevel(exp), denominator = getExperienceToNextLevelFromCurrentLevel(exp);
	return numerator * 100 / denominator ;
}

export function setExperience(uid, exp) {
	firebase.database().ref(`/user/${uid}/`).child("experience").set(exp);
}