const initialState = {
	loggedIn: null,
};

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case "userLogin":
			return {
				...state,
				loggedIn: action.loggedIn,
			};
		case "userLogout":
			return {
				...state,
				loggedIn: null,
			};
		default:
			return state;
	}
};

export default reducer;