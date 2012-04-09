var TurtleHandler = require('../TurtleHandler');
var config = require('../ConfigDefault').config;

// Constructor
function Admin(sekiRequest, sekiResponse) {
	this.sekiRequest = sekiRequest;
	this.sekiResponse = sekiResponse;
}

// properties and methods
Admin.prototype = {

	value1 : "default_value",

	"testCall" : function() {
		console.log("Admin.testCall called");
	},
	"bake" : function() { // perhaps this should spawn a separate OS process?

		// console.log("Admin.bake called");

		var handler = new TurtleHandler();
		handler.getGraphs(function(bindings) {
			// console.log(JSON.stringify(bindings, null, '\t'));
			for (x in bindings) {
				console.log(bindings[x].graph);
				// HERE HERE HERE
				// do a query to get the named graph - as in seki.js
				// map URI to fs
				// save to fs
			}
		});

	},
	"unbake" : function() { // perhaps this should spawn a separate OS process?
		// this.value2 = argument + 100;
		console.log("Admin.unbake called");
	}
};

module.exports = Admin;