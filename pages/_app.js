import { useState, useEffect } from "react";
import "../styles/globals.css";

import { initializeApp, getApps, getApp, FirebaseError } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, child, get, onValue } from "firebase/database";
import { FirebaseContext } from "../firebase/FirebaseContext";
import Navbar from "../components/Generic/Navbar";

import { Provider } from "react-redux";
import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import reducer from "../components/Redux/reducer";
import storage from "../components/Redux/storage";
import { PersistGate } from "redux-persist/integration/react";

const persistConfig = {
	key: "root",
	storage,
	whitelist: ['loggedIn']
};

const persistedReducer = persistReducer(persistConfig, reducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);

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
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<FirebaseContext.Provider value={fb}>
					<Navbar />
					<div className="mt-16">
						<Component {...pageProps} />
					</div>
				</FirebaseContext.Provider>
			</PersistGate>
		</Provider>
	);
}

export default MyApp;
