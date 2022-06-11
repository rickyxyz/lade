import { useContext, useEffect, useState } from "react";
import { FirebaseContext } from "../components/firebase";
import { FirebaseContext, turnProblemsObjectToArray } from "../components/firebase";
import ProblemCard from "../components/Problem/ProblemCard";
import { getData } from "../components/firebase";
import { connect } from "react-redux";
import {
    mapDispatchToProps,
    mapStateToProps,
	mapDispatchToProps,
	mapStateToProps,
} from "../components/Redux/setter";
import Frame from "../components/Generic/Frame";
import { ProblemCardSK } from "../components/Generic/Skeleton";
import { ToastContext } from "../components/Generic/Toast";

const Problems = ({ problems, setProblems }) => {
    const [ displayProblems, setDisplayProblems ] = useState([]);
    const { db, _topics, _subtopics } = useContext(FirebaseContext);
    // useEffect(() => {
    //     console.log("🎇");
    //     console.log(problems);
    // }, [problems]);

    async function sortProblems(criteria) {
        setTimeout(() => {
            console.log(`🎈 sorted by ${criteria}`);
            const sorted = problems.sort((a, b) => (b[criteria] - a[criteria])*1);
            // console.log(`🧨 ${sorted.length}`);
            console.log(sorted);
            setDisplayProblems(p => {
                return p.sort((a, b) => (b[criteria] - a[criteria])*-1);
            });
        }, 1000);
    }

	// Indicate the situation of the fetching process. -1 means fail whereas 1 means success.
	const [fetch, setFetch] = useState(0);

	// Contexts to invoke toasts.
	const { addToast } = useContext(ToastContext);

	async function getProblems() {
		await getData(db, `/problem`)
			.then((_problems) => {
				setProblems(turnProblemsObjectToArray(_problems, _topics, _subtopics));
				setFetch(1);
			})
			.catch((e) => {
				addToast(genericToast("get-fail"));
				setFetch(-1);
			});
	}

	useEffect(() => {
		if (db && _topics && _subtopics) getProblems();
	}, [db, _topics, _subtopics]);

	return (
		<Frame page="Problems">
			<div>
				<h1 className="h2">Problems</h1>
				<p>Sort by:</p>
                <div className="flex flex-row gap-4 w-full">
                    <button
                        className="border-2 border-gray-400 p-2 rounded-full text-gray-400"
                        onClick={() => sortProblems("attempted")}
                    >
                        attempted
                    </button>
                    <button
                        className="border-2 border-gray-400 p-2 rounded-full text-gray-400"
                        onClick={() => sortProblems("accepted")}
                    >
                        accepted
                    </button>
                    {/* <button className="border-2 border-gray-400 p-2 rounded-full text-gray-400" onClick={()=>sortProblems("upvote")}>upvote</button>
                    <button className="border-2 border-gray-400 p-2 rounded-full text-gray-400" onClick={()=>sortProblems("downvote")}>downvote</button> */}
                </div>
			</div>
			{fetch === 1 ? (
				problems.map((card, index) => (
					<ProblemCard
						key={card.id}
						{...card}
						className="p-8 !rounded-none border-b-2 transition-all"
					/>
				))
			) : (
				<>
					<ProblemCardSK />
					<ProblemCardSK />
					<ProblemCardSK />
				</>
			)}
		</Frame>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Problems);
