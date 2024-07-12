function pad(x: number) {
  return x < 10 ? `0${x}` : x;
}

export function getHMS(time: number) {
  const hours = Math.floor(time / 3600);
  time %= 3600;
  const minutes = Math.floor(time / 60);
  time %= 60;
  const seconds = time;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function getDateString(date: Date) {
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

const MINUTE = 1000 * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const YEAR = MONTH * 12;

export function timeAgo(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const diffYears = Math.floor(diff / YEAR);
  if (diffYears) return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;

  const diffMonths = Math.floor(diff / MONTH);
  if (diffMonths) return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;

  const diffWeeks = Math.floor(diff / WEEK);
  if (diffWeeks) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;

  const diffDays = Math.floor(diff / DAY);
  if (diffDays) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  const diffHours = Math.floor(diff / HOUR);
  if (diffHours) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

  const diffMinutes = Math.floor(diff / MINUTE);
  return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
}
