/**
 * Closes the modal and clears the input box.
 * @param {HTMLInputElement} inputBox - The input box element.
 * @param {HTMLDialogElement} modal - The modal element.
 */
function exitMarkerModal(inputBox, modal) {
	modal.close();
	inputBox.value = "";
}

async function handleSubmitMarker(inputBox, modal) {
	var timestamp = getTimestamp();
	console.log("Marker: Timestamp seconds: ", timestamp);

	var title = inputBox.value;
	console.log("Marker: Submitting marker title:", title);

	var sceneId = window.location.pathname.replace("/scenes/", "").split("/")[0];
	console.log("Marker: Scene ID: ", sceneId);

	var tagID = await getTagIdFromName(title, false);
	console.log("Marker: Tag ID: ", tagID);

	if (timestamp && title && sceneId && tagID) {
		console.log("Marker: Creating marker");
		createMarker(sceneId, tagID, timestamp, [], title);
	}

	var { paths: paths } = await getScene(sceneId);

	handleSubmitSceneTag(title);
	// metadataScanFromPaths(paths); //May not be needed as this is already called in handleSubmitSceneTag
	
	exitMarkerModal(inputBox, modal);
}