function log(msg) {
	console.log("File Print : Injector : ", msg);
}

function injectCSS(origin, cssFiles) {
	cssFiles.forEach((cssFile) => {
		var link = document.createElement("link");
		link.type = "text/css";
		link.rel = "stylesheet";

		link.href = origin + "/css/" + cssFile;

		document.getElementsByTagName("head")[0].appendChild(link);
	});
}

log("Initiated");

var messenger = chrome.runtime.sendMessage({ 
		location: window.location, 
		document: document.documentElement.outerHTML
	}, (response) => {
		if (response == undefined || response == null ||
				Object.keys(response).length == 0) {
			return log("Calling into the void");
		} 

		log("Page Supported (:");

		injectCSS(response.origin, response.cssFiles);

		log("Injected Print Media CSS");
	});