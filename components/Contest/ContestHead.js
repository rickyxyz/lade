import clsx from "clsx";
import { useEffect, useState } from "react";
import Time from "../Generic/Date";
import Tag from "../Generic/Tag";
import { getTimeDifference, getUTCDateWithoutDay } from "../Utility/date";

const ContestHead = ({
	important = false,
	owner,
	title,
	topic,
	subtopic,
	addon,
	time = {},
}) => {
	const smallFont = important ? "" : "text-xs";

	const [now, setNow] = useState(new Date().getTime());
	const [timeDetail, setTimeDetail] = useState({
		prefix: "",
		time: <></>,
	});

	useEffect(() => {
		if (now > time.end) {
			setTimeDetail({ ...timeDetail, prefix: "Ended ", time: time.end });
		} else if (time.start > now) {
			setTimeDetail({
				...timeDetail,
				prefix: "Starts in ",
				time: time.start,
			});
		} else {
			setTimeDetail({
				...timeDetail,
				prefix: "Ends in ",
				time: time.end,
			});
		}
	}, []);

	return (
		<div className="flex flex-col gap-4">
			<span className={clsx("text-gray-600", smallFont)}>
				Posted by <b>{owner}</b> ⦁ {timeDetail.prefix}
				<Time className={clsx(smallFont)} time={timeDetail.time} />
			</span>
			{important ? (
				<h1 className="h2">{title}</h1>
			) : (
				<h3 className="h4">{title}</h3>
			)}
			<Tag className={clsx(smallFont)}>{topic}</Tag>
			{addon}
		</div>
	);
};

export default ContestHead;
