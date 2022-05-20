import { useState, useEffect } from "react";
import "../styles/globals.css";

import { initializeApp, getApps, getApp, FirebaseError } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, child, get, onValue } from "firebase/database";
import { FirebaseContext } from "../firebase/FirebaseContext";

function MyApp({ Component, pageProps }) {

	const [fb, setFb] = useState({
		app: null,
		db: null,
	});

	useEffect(() => {
		const config = {
			apiKey: process.env.NEXT_PUBLIC_API_KEY,
			authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
			databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
			projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
		};
		
		if(!fb.app) {
			const app = initializeApp(config);
			const db = getDatabase(app);
			setFb({
				app,
				db,
			});
		}
	}, []);

	return (
		<FirebaseContext.Provider value={fb}>
			<Component {...pageProps} />
		</FirebaseContext.Provider>
	);
}

export default MyApp;
