import { useContext, useEffect, useState } from "react";
import { FirebaseContext } from "../components/firebase";
import ProblemCard from "../components/Problem/ProblemCard";
import { getData } from "../components/firebase";
import { connect } from "react-redux";
import {
    mapDispatchToProps,
    mapStateToProps,
} from "../components/Redux/setter";
import Frame from "../components/Generic/Frame";

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

    async function getProblems() {
        await getData(db, `/problem`)
            .then((_problems) => {
                const tempProblems = [];

                console.log(_problems);

                for (let [id, _problem] of Object.entries(_problems)) {
                    let { topic, subtopic } = _problem;
                    _problem.id = id;
                    _problem.topic = _topics[topic];
                    _problem.subtopic = _subtopics[topic][subtopic];
                    tempProblems.unshift(_problem);
                }

                setProblems(tempProblems);
                setDisplayProblems(tempProblems);
            })
            .catch((e) => {
                console.log(e);
            });
    }

    useEffect(() => {
        if (db && _topics && _subtopics) getProblems();
    }, [db, _topics, _subtopics]);

    useEffect(() => {
        console.log(problems);
    }, [problems]);

    return (
        <Frame>
            <div className="flex flex-col gap-5">
                <h1 className="h2 w-full">Problems</h1>
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
            {displayProblems.map((card, index) => (
                <ProblemCard
                    key={`${card.id}${index}`}
                    {...card}
                    className="p-8 !rounded-none border-b-2 transition-all"
                />
            ))}
        </Frame>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Problems);
