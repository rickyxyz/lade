import clsx from "clsx";
import Tag from "../Generic/Tag";

const ProblemHead = ({ important = false, id2, owner, topic, subtopic }) => {

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
			{ important ? (<h1 className="h2">{topic}</h1>) : (<h3 className="h4">{topic}</h3>) }
			<Tag className={clsx(smallFont)}>{subtopic}</Tag>
		</div>
	);
}

export default ProblemHead;