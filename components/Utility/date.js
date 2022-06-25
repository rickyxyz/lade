export function getTimeDifference(time, now) {
	if (!time) return `unknown`;

	if (!now)
		now = new Date().getTime();

	// seconds of difference
	const difference = Math.abs(Math.ceil((now - time) / 1000));

	if (difference < 60) {
		return `less than a minute`;
	} else if (difference < 60 * 60) {
		const time = Math.floor(difference / 60);
		return `${Math.floor(difference / 60)} minute${
			time > 1 ? "s" : ""
		}`;
	} else if (difference < 60 * 60 * 24) {
		const time = Math.floor(difference / (60 * 60));
		return `${Math.floor(difference / (60 * 60))} hour${
			time > 1 ? "s" : ""
		}`;
	} else if (difference < 60 * 60 * 24 * 7) {
		const time = Math.floor(difference / (60 * 60 * 24));
		return `${Math.floor(difference / (60 * 60 * 24))} day${
			time > 1 ? "s" : ""
		}`;
	} else if (difference < 60 * 60 * 24 * 7 * 30) {
		const time = Math.floor(difference / (60 * 60 * 24 * 7));
		return `${Math.floor(difference / (60 * 60 * 24 * 7))} week${
			time > 1 ? "s" : ""
		}`;
	} else if (difference < 60 * 60 * 24 * 7 * 30 * 12) {
		const time = Math.floor(difference / (60 * 60 * 24 * 7 * 30));
		return `${Math.floor(difference / (60 * 60 * 24 * 7 * 30))} month${
			time > 1 ? "s" : ""
		}`;
	} else {
		const time = Math.floor(difference / (60 * 60 * 24 * 7 * 30 * 12));
		return `${Math.floor(difference / (60 * 60 * 24 * 7 * 30 * 12))} year${
			time > 1 ? "s" : ""
		}`;
	}
}

export function getDateFormat(date) {
	let year = date.getFullYear(),
		month = date.getMonth() + 1,
		tgl = date.getDate();

	if (month < 10) month = `0${month}`;

	if (tgl < 10) tgl = `0${tgl}`;

	return `${year}-${month}-${tgl}`;
}

export function getTimeFormat(date) {
	let hour = date.getHours(),
		minute = date.getMinutes();

	if (hour < 10) hour = `0${hour}`;

	if (minute < 10) minute = `0${minute}`;

	return `${hour}:${minute}`;
}

export function getUTCDateWithoutDay(date) {
	date = new Date(date);
	date = date.toUTCString();
	return date.split(", ")[1];
}

export function getHourMinute(date) {
	let hour = date.slice(0, 2),
		minute = date.slice(3, 5);
	return [hour, minute];
}