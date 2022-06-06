import { useState, useEffect } from "react";
import "../styles/globals.css";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { FirebaseContext, getData } from "../components/firebase";
import Navbar from "../components/Generic/Navbar";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import reducer from "../components/Redux/reducer";
import storage from "../components/Redux/storage";
import { PersistGate } from "redux-persist/integration/react";
import Script from "next/script";
import "firebase/database";
import "firebase/compat/database";
import firebase from 'firebase/compat/app';

const persistConfig = {
	key: "root",
	storage,
	whitelist: ["loggedIn"],
};

const persistedReducer = persistReducer(persistConfig, reducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);

function MyApp({ Component, pageProps }) {
	const [fb, setFb] = useState({
		app: null,
		db: null,
		_topics: {},
		_subtopics: {},
	});

	async function getTopicsAndSubTopics(db) {
		try {
			const _topics = await getData(db, "/topic"),
				_subtopics = await getData(db, "/subtopic");

			if (db) {
				setFb({
					...fb,
					_topics,
					_subtopics,
				});
			}
		} catch (e) {}
	}

	useEffect(() => {
		const config = {
			apiKey: process.env.NEXT_PUBLIC_API_KEY,
			authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
			databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
			projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
		};

		if (!fb.app) {
			const app = firebase.initializeApp(config);
			const db = getDatabase(app);
			setFb({
				app,
				db,
			});
		}
	}, []);

	useEffect(() => {
		getTopicsAndSubTopics(fb.db);
	}, [fb.db]);

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<FirebaseContext.Provider value={fb}>
					<Navbar />
					<link
						rel="stylesheet"
						href="https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css"
						integrity="sha384-R4558gYOUz8mP9YWpZJjofhk+zx0AS11p36HnD2ZKj/6JR5z27gSSULCNHIRReVs"
						crossOrigin="anonymous"
					/>
					<Script
						defer
						src="https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.js"
						integrity="sha384-z1fJDqw8ZApjGO3/unPWUPsIymfsJmyrDVWC8Tv/a1HeOtGmkwNd/7xUS0Xcnvsx"
						crossOrigin="anonymous"
					/>
					<div className="mt-16">
						<Component {...pageProps} />
					</div>
				</FirebaseContext.Provider>
			</PersistGate>
		</Provider>
	);
}

export default MyApp;
