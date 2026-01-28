function createMarkerModal() {
	const modal = document.createElement("dialog");
	modal.setAttribute("id", "quick-marker-modal");
	modal.style.border = "none";
	modal.classList.add("bg-dark");

	const inputBox = document.createElement("input");
	inputBox.setAttribute("type", "text");

	// Add event listener to open marker modal with keyboard shortcut
	document.addEventListener("keydown", (event) => {
		if (!modal.open && event.altKey && event.key === "m") {
			console.log("Keyboard shortcut 'Alt+M' pressed, opening modal");
			event.preventDefault();
			inputBox.value = "";
			modal.showModal();
		}
	});

	// Add event listener to submit text with Enter key
	inputBox.addEventListener("keydown", (event) => {
		if (modal.open && event.key === "Enter") {
			handleSubmitMarker(inputBox, modal);
		}
	});

	const submitButton = document.createElement("button");
	submitButton.innerText = "Submit";
	submitButton.addEventListener("click", () => {
		handleSubmitMarker(inputBox, modal);
	});

	modal.appendChild(inputBox);
	modal.appendChild(submitButton);

	document.body.appendChild(modal);
}

function createQuickMarkerButton() {
	const triggerButton = document.createElement("button");
	triggerButton.setAttribute("id", "quick-marker-trigger-button");
	triggerButton.classList.add("btn", "btn-primary");
	triggerButton.innerText = "Quick Marker";

	triggerButton.addEventListener("click", () => {
		if (event.pointerType === 'mouse') {
			console.log("Quick marker button clicked");
			document.querySelector("#quick-marker-modal").showModal();
		}
	});

	const targetElements = document.querySelectorAll('.navbar-buttons a[href="https://opencollective.com/stashapp"].nav-utility.nav-link');
	if (targetElements.length > 0) {
		// Insert the button before the first matching element
		targetElements[0].parentNode.insertBefore(triggerButton, targetElements[0]);
	} else {
		console.warn('No elements found with href="https://opencollective.com"');
		const sceneDetails = document.querySelector(".scene-details");
		sceneDetails.appendChild(triggerButton);
	}
}

function removeMarkerElements() {
	console.log("Removing quick marker elements");
	const modal = document.querySelector("#quick-marker-modal");
	const triggerButton = document.querySelector("#quick-marker-trigger-button");

	if (modal) {
		modal.remove();
		console.log("Quick marker modal removed");
	}

	if (triggerButton) {
		triggerButton.remove();
		console.log("Quick marker trigger button removed");
	}
}

/**
 * Sets up the quick marker modal and button.
 */
function setupQuickMarker() {
	const existingModal = document.querySelector("#quick-marker-modal");
	const existingButton = document.querySelector("#quick-marker-trigger-button");

	if (!existingModal) {
		console.log("Setting up marker modal");
		createMarkerModal();
	} else {
		console.log("Marker modal already exists");
	}

	if (!existingButton) {
		console.log("Setting up marker button");
		createQuickMarkerButton();
	} else {
		console.log("Marker button already exists");
		existingButton.style.display = "block";
	}
}