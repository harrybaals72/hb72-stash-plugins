function getTimestamp() {
	const timestamp = document.querySelector(".vjs-current-time-display").innerText;
	const timeParts = timestamp.split(':').map(Number);
	let seconds = 0;

	if (timeParts.length === 3) {
		seconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
	} else if (timeParts.length === 2) {
		seconds = timeParts[0] * 60 + timeParts[1];
	}
	seconds = Math.max(1, seconds - 5);

	console.log("Seconds: ", seconds);
	console.log("Timestamp: ", timestamp);
	return seconds
}