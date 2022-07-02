import clsx from "clsx";
import { HiLockClosed } from "react-icons/hi";
import { CgPlayListRemove } from "react-icons/cg";
import Tag from "../Generic/Tag";
import Visibility from "../Generic/Visibility";

const ProblemHead = ({ important = false, id2, owner, topic, subtopic, setting }) => {

	const smallFont = important ? "" : "text-xs";

	return (
		<div className="flex flex-col gap-4">
			<div className={clsx("text-gray-600", smallFont)}>
				<span
					className={clsx("font-semibold cursor-pointer", smallFont)}
					id={id2}
					title="Click to select all"
					onClick={() => {
						if (window)
							window
								.getSelection()
								.selectAllChildren(
									document.getElementById(id2)
								);
					}}
				>
					{id2}
				</span>{" "}
				⦁ Posted by <b>{owner}</b>
			</div>
			<div className="flex items-center">
				<Visibility visibility={setting.visibility} important={important} />
				{ important ? (<h1 className="h2">{topic}</h1>) : (<h3 className="h4">{topic}</h3>) }
			</div>
			<Tag className={clsx(smallFont)}>{subtopic}</Tag>
		</div>
	);
}

export default ProblemHead;