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

export function mapStateToProps(state) {
	return {
		loggedIn: state.loggedIn,
	};
}

export const mapDispatchToProps = {
	loginUser,
	logoutUser,
};