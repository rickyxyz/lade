export function loginUser(loggedIn) {
	return {
		type: "userLogin",
		loggedIn: loggedIn
	};
}

export function logoutUser() {
	return {
		type: "userLogout",
		loggedIn: null
	};
}

export function setProblems(problems) {
	return {
		type: "problemsSet",
		problems: problems
	};
}

export function setComment(comments) {
    return {
        type: "commentSet",
        comments: comments
    }
}

export function setContests(contests) {
	return {
		type: "contestsSet",
		contests: contests
	};
}

export function mapStateToProps(state) {
	return {
		loggedIn: state.loggedIn,
		problems: state.problems,
		contests: state.contests,
	};
}

export const mapDispatchToProps = {
	loginUser,
	logoutUser,
	setProblems,
	setContests,
};