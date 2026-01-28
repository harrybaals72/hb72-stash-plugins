function checkURL() {
	url = window.location.href
	return url.includes("/scenes/") || url.includes("/performers/")
}

function createTaggerModal() {
	const modal = document.createElement("dialog");
	modal.setAttribute("id", "quick-tagger-modal");
	modal.style.border = "none";
	modal.classList.add("bg-dark");

	const inputBox = document.createElement("input");
	inputBox.setAttribute("type", "text");

	// Add event listener to open modal with keyboard shortcut
	document.addEventListener("keydown", (event) => {
		if (!modal.open && event.altKey &&  event.key === "q") {
			if (checkURL()) {
				console.log("Keyboard shortcut 'q' pressed, opening modal");
				event.preventDefault();
				inputBox.value = "";
				modal.showModal();
			}
		}
	});

	// Add event listener to submit text with Enter key
	inputBox.addEventListener("keydown", (event) => {
		if (modal.open && event.key === "Enter") {
			handleSubmitTag(inputBox, modal);
		}
	});

	const submitButton = document.createElement("button");
	submitButton.innerText = "Submit";
	submitButton.addEventListener("click", () => {
		handleSubmitTag(inputBox, modal);
	});

	modal.appendChild(inputBox);
	modal.appendChild(submitButton);

	document.body.appendChild(modal);
}

function createQuickTaggerButton() {
	const triggerButton = document.createElement("button");
	triggerButton.setAttribute("id", "quick-tagger-trigger-button");
	triggerButton.classList.add("btn", "btn-primary");
	triggerButton.innerText = "Quick Tagger";

	triggerButton.addEventListener("click", () => {
		if (event.pointerType === 'mouse') {
			console.log("Quick tagger button clicked");
			document.querySelector("#quick-tagger-modal").showModal();
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

function removeTaggerElements() {
	console.log("Removing quick tagger elements");
	const modal = document.querySelector("#quick-tagger-modal");
	const triggerButton = document.querySelector("#quick-tagger-trigger-button");

	if (modal) {
		modal.remove();
		console.log("Quick tagger modal removed");
	}

	if (triggerButton) {
		triggerButton.remove();
		console.log("Quick tagger trigger button removed");
	}
}

/**
 * Sets up the quick tagger modal and button.
 */
function setupQuickTagger() {
	var existingModal = document.querySelector("#quick-tagger-modal");
	var existingButton = document.querySelector("#quick-tagger-trigger-button");

	if (!existingModal) {
		console.log("Setting up tagger modal");
		createTaggerModal();
	} else {
		console.log("Tagger modal already exists");
	}

	if (!existingButton) {
		console.log("Setting tagger up button");
		createQuickTaggerButton();
	} else {
		console.log("Tagger button already exists, showing");
		existingButton.style.display = "block";
	}
}