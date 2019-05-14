var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let xhr = new XMLHttpRequest();

// Define the response callback
xhr.onreadystatechange = function() {
	// Wait for request to finish
	if (this.readyState == 4) {
		// Success
		if (this.status == 200) {
			console.log(this.responseText); 
		}
		// Failure
		else {
			console.error("XHR GET http://127.0.0.1:3000/data/dyn/satellite/pos[0] request failed: " + this.status);
		}
	}
}

xhr.open('GET', 'http://127.0.0.1:3000/data/dyn/satellite/pos[0]');
xhr.setRequestHeader("Content-type", "application/json");
xhr.send();
