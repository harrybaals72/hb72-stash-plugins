function createSceneElements() {
	setupQuickTagger()
	setupQuickMarker()
}

function removeSceneElements() {
	removeTaggerElements()
	removeMarkerElements()
}

function hideSceneElements(el) {
	if (el) {
		el.style.display = "none"
	} else {
		console.log('Element not found')
	}
}

function setElements() {
	url = window.location.href
	if (url.includes("/scenes/")) {
		setupQuickTagger()
		setupQuickMarker()
	} else if (url.includes("/performers/")) {
		setupQuickTagger()
	} else {
		console.log("Hiding Quick Tagger button")
		var quickTaggerButton = document.querySelector("#quick-tagger-trigger-button");
		hideSceneElements(quickTaggerButton)

		console.log("Hiding Quick Marker button")
		var quickMarkerButton = document.querySelector("#quick-marker-trigger-button");
		hideSceneElements(quickMarkerButton)
	}
}