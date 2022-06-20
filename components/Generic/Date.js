import clsx from "clsx";
import { getTimeDifference } from "../Utility/date";

const Time = ({ time, className }) => {
	time = new Date(time);

	const now = new Date();

	let suffix = now.getTime() > time ? " ago" : "";

	return (
		<span
			className={clsx(className)}
			title={time.toLocaleString()}
		>
			<b>
				{getTimeDifference(time, "")}
				{suffix}
			</b>
		</span>
	);
};

export default Time;
