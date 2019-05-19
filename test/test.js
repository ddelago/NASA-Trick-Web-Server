var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var optionsInOut = require("./testVariables.js").optionsInOut;
var getInOut = require("./testVariables.js").getInOut;
var postInOut = require("./testVariables.js").postInOut;
var putInOut = require("./testVariables.js").putInOut;
var deleteInOut = require("./testVariables.js").deleteInOut;

Object.keys(optionsInOut).forEach(function(route) {
	let xhr = new XMLHttpRequest();
	xhr.open("OPTIONS", `http://127.0.0.1:3000${route}`);
	xhr.setRequestHeader("Content-type", "application/json");

	// Define the response callback
	xhr.onreadystatechange = function() {
		// Wait for request to finish
		if (this.readyState == 4) {
			// Success
			if(this.status === 200) {
				console.log(`XHR OPTIONS http://127.0.0.1:3000${route} response:\n`, JSON.parse(this.responseText));
			}
			// Failure
			else {
				console.error(`XHR OPTIONS http://127.0.0.1:3000${route} request failed: ${this.status}`);
			}
		}
	}
	xhr.send();
})

Object.keys(getInOut).forEach(function(route) {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", `http://127.0.0.1:3000${route}`);
	xhr.setRequestHeader("Content-type", "application/json");

	// Define the response callback
	xhr.onreadystatechange = function() {
		// Wait for request to finish
		if (this.readyState == 4) {
			// Success
			if(this.status === 200) {
				console.log(`XHR GET http://127.0.0.1:3000${route} response:\n`, JSON.parse(this.responseText)); 
			}
			// Failure
			else {
				console.error(`XHR GET http://127.0.0.1:3000${route} request failed: ${this.status}`);
			}
		}
	}
    xhr.send();
})

postInOut.forEach(function(route) {
	let xhr = new XMLHttpRequest();
	xhr.open("POST", `http://127.0.0.1:3000/data`);
	xhr.setRequestHeader("Content-type", "text/plain");

	// Define the response callback
	xhr.onreadystatechange = function() {
		// Wait for request to finish
		if (this.readyState == 4) {
			// Success
			if(this.status === 200) {
				console.log(`XHR POST http://127.0.0.1:3000/data response:\n`, JSON.parse(this.responseText)); 
			}
			// Failure
			else {
				console.error(`XHR POST http://127.0.0.1:3000/data request failed: ${this.status}`);
			}
		}
    }
    xhr.send(JSON.stringify(route.input));
})

Object.keys(putInOut).forEach(function(route) {
	let xhr = new XMLHttpRequest();
	xhr.open("PUT", `http://127.0.0.1:3000${route}`);
	xhr.setRequestHeader("Content-type", "application/json");

	// Define the response callback
	xhr.onreadystatechange = function() {
		// Wait for request to finish
		if (this.readyState == 4) {
			// Success
			if(this.status === 200) {
				console.log(`XHR PUT http://127.0.0.1:3000${route} response:\n`, JSON.parse(this.responseText)); 
			}
			// Failure
			else {
				console.error(`XHR PUT http://127.0.0.1:3000${route} request failed: ${this.status}`);
			}
		}
	}
    xhr.send();
})

Object.keys(deleteInOut).forEach(function(route) {
	let xhr = new XMLHttpRequest();
	xhr.open("DELETE", `http://127.0.0.1:3000${route}`);
	xhr.setRequestHeader("Content-type", "application/json");

	// Define the response callback
	xhr.onreadystatechange = function() {
		// Wait for request to finish
		if (this.readyState == 4) {
			// Success
			if(this.status === 200) {
				console.log(`XHR DELETE http://127.0.0.1:3000${route} response:\n`, JSON.parse(this.responseText)); 
			}
			// Failure
			else {
				console.error(`XHR DELETE http://127.0.0.1:3000${route} request failed: ${this.status}`);
			}
		}
	}
    xhr.send();
})