import clsx from "clsx";
import { useEffect, useState } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import Button from "../Generic/Button";

const Choice = ({
	name = "Choice",
	index,
	checked = false,
	removable,
	onNameChange,
	onCheck,
	onDelete,
	readOnly,
	triggerWhenInputIsClicked = false,
}) => {
	const [state, setState] = useState(name);

	useEffect(() => {
		if(onNameChange)
			onNameChange(state, index);
	}, [state]);

	return (
		<div role="button" className="choice flex flex-row mt-4 first:mt-0" onClick={() => triggerWhenInputIsClicked ? onCheck(state, index) : () => {}}>
			<input
				type="radio"
				name="multiple-choice"
				className="w-10 h-10 rounded-full border-2"
				onChange={() => triggerWhenInputIsClicked ? () => {} : onCheck(state, index)}
				checked={checked}
			/>
			<input
				type="text"
				className="top-0 flex flex-row items-center w-40 h-10 px-4 py-0 ml-8 border-2"
				value={state}
				onChange={(e) => {
					if(!readOnly)
						setState((state) => e.target.value);
				}}
				readOnly={readOnly}
			/>
			<Button
				variant="ghost-danger"
				className={clsx("ml-8 px-3 rounded-sm", !removable && "hidden")}
				onClick={() => {
					if (removable) onDelete(state, index);
				}}
			>
				<BsFillTrashFill className="w-4 h-4" />
			</Button>
		</div>
	);
};

export default Choice;