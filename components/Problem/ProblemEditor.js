import { useContext } from "react";
import { FirebaseContext, postData } from "../../components/firebase";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import Button from "../Generic/Button";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../Redux/setter";
import pushid from "pushid";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
	ssr: false,
	loading: () => <></>,
});

const ProblemEditor = ({
	loggedIn,
	purpose,
	problem = {
		statement: null,
	},
}) => {
	const { statement } = problem;
	const { db } = useContext(FirebaseContext);

	async function callback() {
		async function newQuestion() {
			const content =
				document.getElementsByClassName("ql-editor")[0].innerHTML;

			if(content === "") return;

			const id = pushid();
			console.log(id);
			await postData(db, `/problem/${id}`, {
				topic: 0,
				subtopic: 0,
				statement: content,
				owner: loggedIn.username,
				accepted: 0,
				attempted: 0,
				comments: 0,
			}).catch((e) => {
				console.log(e);
			});
		}

		async function editQuestion() {
			const content =
				document.getElementsByClassName("ql-editor")[0].innerHTML;

			if(content === "") return;

			await postData(db, `/problem/${problem.id}`, {
				...problem,
				topic: parseInt(0),
				subtopic: parseInt(0),
				statement: content,
			}).catch((e) => {
				console.log(e);
			});
		}

		if (purpose === "new") newQuestion();
		else editQuestion();
	}

	return purpose === "new" ||
		(purpose === "edit" && loggedIn && loggedIn.username === problem.owner) ? (
		<>
			<div>
				<h1 className="h2">
					{purpose === "new" ? "Create Problem" : "Edit Problem"}
				</h1>
				<div className="mt-6">
					<Button onClick={() => callback()}>Finish</Button>
				</div>
			</div>
			<div>
				<h2 className="h4">Problem Settings</h2>
				<select disabled>
					<option value="0">Short Answer</option>
					<option value="1">Multiple Choice</option>
				</select>
			</div>
			<div>
				<h2 className="h4">Problem Statement</h2>
				<QuillNoSSRWrapper
					className="quill"
					placeholder="Write the question here..."
					value={statement}
				/>
			</div>
			<div>
				<h2 className="h4">Problem Answer</h2>
				<input
					type="text"
					placeholder="Type the correct answer here..."
				/>
			</div>
		</>
	) : (
		<div>
			<p>You don&quot;t have permission.</p>
		</div>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(ProblemEditor);
