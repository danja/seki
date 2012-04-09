var TurtleHandler = require('../TurtleHandler');
var config = require('../ConfigDefault').config;


//Constructor
function Admin(sekiRequest, sekiResponse) {
	this.sekiRequest = sekiRequest;
	this.sekiResponse = sekiResponse;
}

// properties and methods
Admin.prototype = {

	value1 : "default_value",

	"testCall" : function() {
		// this.value2 = argument + 100;
		console.log("Admin.testCall called");
	},
	"bake" :  function() { // perhaps this should spawn a separate OS process?
		// this.value2 = argument + 100;
		console.log("Admin.bake called");
		
		var handler = new TurtleHandler();
		handler.getGraphs();
//		var graphURIs = getTurtleForGraph()

	},
	"unbake" :  function() { // perhaps this should spawn a separate OS process?
		// this.value2 = argument + 100;
		console.log("Admin.unbake called");
	}
};

module.exports = Admin;