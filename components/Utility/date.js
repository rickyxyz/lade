export function getTimeDifference(past) {
	if(!past)
		return "long time ago";

	const now = new Date();

	// seconds of difference
	const difference = Math.ceil((now - past)/1000);

	if(difference < 60) {
		return "less than a minute ago";
	} else if(difference < 60*60) {
		const time = Math.floor(difference/60);
		return `${Math.floor(difference/60)} minute${(time > 1) ? "s" : ""} ago`;
	} else if(difference < 60*60*24) {
		const time = Math.floor(difference/(60*60));
		return `${Math.floor(difference/(60*60))} hour${(time > 1) ? "s" : ""} ago`;
	} else if(difference < 60*60*24*7) {
		const time = Math.floor(difference/(60*60*24));
		return `${Math.floor(difference/(60*60*24))} day${(time > 1) ? "s" : ""} ago`;
	} else if(difference < 60*60*24*7*30) {
		const time = Math.floor(difference/(60*60*24*7));
		return `${Math.floor(difference/(60*60*24*7))} week${(time > 1) ? "s" : ""} ago`;
	} else if(difference < 60*60*24*7*30*12) {
		const time = Math.floor(difference/(60*60*24*7*30));
		return `${Math.floor(difference/(60*60*24*7*30))} month${(time > 1) ? "s" : ""} ago`;
	} else {
		const time = Math.floor(difference/(60*60*24*7*30*12));
		return `${Math.floor(difference/(60*60*24*7*30*12))} year${(time > 1) ? "s" : ""} ago`;
	}
}