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
