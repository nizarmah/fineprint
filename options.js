function appendRule(name) {
	let rulesList = document.querySelector(".rules-list");

	let ruleIndex = rulesList.children.length;
	let ruleId = "rule-" + ruleIndex;

	let ruleContainer = document.createElement("div");
	ruleContainer.class = "rule-container";

	let ruleCheckbox = document.createElement("input");
	ruleCheckbox.type = "checkbox";
	ruleCheckbox.className = "rule-checkbox";
	ruleCheckbox.id = ruleId;
	ruleCheckbox.value = name;
	// ruleCheckbox.style.display = "none";
	ruleCheckbox.checked = true;

	ruleContainer.appendChild(ruleCheckbox);

	let ruleBubble = document.createElement("span");
	ruleBubble.className = "rule-bubble";

	ruleContainer.appendChild(ruleBubble);

	let ruleLabel = document.createElement("label");
	ruleLabel.className = "rule-label";
	ruleLabel.htmlFor = ruleId;

	ruleLabel.appendChild(document.createTextNode(name));

	ruleContainer.appendChild(ruleLabel);

	rulesList.appendChild(ruleContainer);
}

function listRules() {
	for (let ruleName in pageRules) {
		appendRule(ruleName);
	}
}

window.addEventListener('load', listRules);