/**
 * Closes the modal and clears the input box.
 * @param {HTMLInputElement} inputBox - The input box element.
 * @param {HTMLDialogElement} modal - The modal element.
 */
function exitTagModal(inputBox, modal) {
	modal.close();
	inputBox.value = "";
}

async function handleSubmitPerformerTag(text) {
	var performerId = window.location.pathname.split("/")[2];
	console.log("Performer ID: ", performerId);
	console.log("Text submitted: ", text);

	var tagID = await getTagIdFromName(text, false);
	if (!tagID) {
		console.log("Tag not found");
		return;
	}

	var userConfirmed = confirm("Do you want to add tag " + text + " to this performer?");
  if (!userConfirmed) {
		console.log("User denied");
		return;
	}
	console.log("User confirmed");

	var existingPerformerTags = await getPerformerTags(performerId);
	console.log("Existing performer tags: ", existingPerformerTags);

	if (!existingPerformerTags.includes(tagID)) {
		existingPerformerTags.push(tagID);
	}
	
	console.log("New performer tags: ", existingPerformerTags);

	var updatePerformerResult = await updatePerformerTags(performerId, existingPerformerTags);
	console.log("Update performer result: ", updatePerformerResult);
	var { sceneIds: sceneIds, paths: paths } = await findScenesByPerformerId(performerId);

	var updateSceneTagsBulkResult = await updateSceneTagsBulk(sceneIds, existingPerformerTags);
	console.log("Update scene tags bulk result: ", updateSceneTagsBulkResult);

	metadataScanFromPaths(paths);
}

async function handleSubmitSceneTag(text) {
	var sceneId = window.location.pathname.replace("/scenes/", "").split("/")[0];
	console.log("Scene ID: ", sceneId);
	console.log("Text submitted: ", text);

	var tagID = await getTagIdFromName(text + "_USR", true);
	if (!tagID) {
		console.log("Tag not found");
		return;
	}

	var { tags: tags, paths: paths } = await getScene(sceneId);
	
	console.log("Existing scene tags: ", tags);
	console.log("Existing scene paths: ", paths);

	if (!tags.includes(tagID)) {
		var newSceneArray = tags.concat(tagID);
		console.log("New scene array: ", newSceneArray);
		
		var updateSceneResult = await updateSceneTags(sceneId, newSceneArray);
		console.log("Update scene result: ", updateSceneResult);

	} else {
		console.log("Tag already exists");
	}
	metadataScanFromPaths(paths);
}

/**
 * Handles the submission of the tag.
 * @param {HTMLInputElement} inputBox - The input box element.
 * @param {HTMLDialogElement} modal - The modal element.
 */
async function handleSubmitTag(inputBox, modal) {
	var text = inputBox.value;

	url = window.location.href
	if (url.includes("/scenes/")) {
		handleSubmitSceneTag(text);
	} else if (url.includes("/performers/")) {
		handleSubmitPerformerTag(text)
	}
	
	exitTagModal(inputBox, modal);
}