import { useContext, useEffect } from "react";
import { FirebaseContext } from "../components/firebase";
import ProblemCard from "../components/Problem/ProblemCard";
import { getData } from "../components/firebase";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../components/Redux/setter";
import Frame from "../components/Generic/Frame";

const Problems = ({ problems, setProblems }) => {
	// const [ problems, setProblems ] = useState([]);
	const { db, _topics, _subtopics } = useContext(FirebaseContext);

	async function getProblems() {
		await getData(db, `/problem`).then((_problems) => {
			const tempProblems = [];

			console.log(_problems);

			for(let [id, _problem] of Object.entries(_problems)) {
				let { topic, subtopic } = _problem;
				_problem.id = id;
				_problem.topic = _topics[topic];
				_problem.subtopic = _subtopics[topic][subtopic];
				tempProblems.unshift(_problem);
			}
			
			setProblems(tempProblems);
		}).catch(e => { console.log(e) });
	}

	useEffect(() => {
		if( db && _topics && _subtopics)
			getProblems();
	}, [ db, _topics, _subtopics ]);

	useEffect(() => {
		console.log(problems);
	}, [ problems ]);

	return (
		<Frame>
			<div>
				<h1 className="h2">Problems</h1>
			</div>
			{problems.map((card, index) => (
				<ProblemCard
					key={card.id}
					{...card}
					className="p-8 !rounded-none border-b-2 transition-all"
				/>
			))}
		</Frame>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Problems);
