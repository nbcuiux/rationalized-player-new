import moment from "moment";

export function formatTime(seconds) {

	let sign = "";

	if (seconds < 0) {
		seconds = -seconds;
		sign = "-";
	}

	let m = moment.duration(seconds, 'second');

	let secs = m.seconds();
	let mins = m.minutes();

	secs = secs < 10 ? "0" + secs : secs;
	//mins = mins < 10 ? "0" + mins : mins;

	return sign + mins + ":" + secs;
}