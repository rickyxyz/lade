import { useEffect, useState } from "react";
import { getTimeDifference } from "../Utility/date";

const DynamicTime = ({ time }) => {
	const [display, setDisplay] = useState("");

	useEffect(() => {
		const interval = setInterval(() => {
			const now = Date.now();
			setDisplay( getTimeDifference( time, now ) );
		}, 100);

		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<span>
			{ display }
		</span>
	)
};

export default DynamicTime;