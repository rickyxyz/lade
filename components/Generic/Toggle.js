import clsx from "clsx";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Toggle = ({ initial = false, onChange }) => {
	const [state, setState] = useState(initial);

	useEffect(() => {
		onChange(state);
	}, [ state ]);

	return (
		<div className="relative w-12 h-6" onClick={() => setState(!state)}>
			<div
				className={clsx(
					"absolute top-1 rounded-lg w-12 h-4",
					state ? "bg-green-200" : "bg-gray-200"
				)}
			></div>
			<div
				className={clsx(
					"absolute rounded-full w-6 h-6 shadow-sm transition-all",
					state ? "left-0 bg-green-400" : "left-6 bg-gray-400"
				)}
			></div>
		</div>
	);
};

export default Toggle;
