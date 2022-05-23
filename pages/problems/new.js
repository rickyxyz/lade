import { useContext, useState } from "react";
import { FirebaseContext } from "../../components/firebase";
import Frame from "../../components/Generic/Frame";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import ProblemEditor from "../../components/Problem/ProblemEditor";

const Problems = () => {
	const db = useContext(FirebaseContext);
	const [value, setValue] = useState("");

	return (
		<Frame>
			<ProblemEditor purpose="new" />
		</Frame>
	);
};

export default Problems;
