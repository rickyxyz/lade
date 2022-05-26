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

export function mapStateToProps(state) {
	return {
		loggedIn: state.loggedIn,
		problems: state.problems,
	};
}

export const mapDispatchToProps = {
	loginUser,
	logoutUser,
	setProblems,
};