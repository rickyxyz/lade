import { createContext } from "react";

export const FirebaseContext = createContext({
	app: null,
	db: null,
});