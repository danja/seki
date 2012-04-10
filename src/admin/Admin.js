var TurtleHandler = require('../TurtleHandler');
var config = require('../ConfigDefault').config;
var fs = require('fs');

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
				var uri = bindings[x].graph;

				if (uri.indexOf(config.uriBase) == 0) {
					var filename = config.baked
							+ uri.substring(config.uriBase.length);
				} else {
					console.log("WARNING: graph " + uri
							+ " not in current domain");
					continue;
				}
				console.log("filename = " + filename);
				// filename needs to be prefixed with __dirname ??
				var dirs = filename.split("/");
				console.log("dirs = " + dirs);
				var dir = "";
				for ( var i = 0; i < dirs.length - 1; i++) {
					dir += dirs[i];
					console.log("trying to create dir " + dir);
					fs.mkdir(dir);
					dir += "/";
				}

				var options = {
					flags : 'w',
					encoding : 'utf8',
					mode : 0666
				};
				var stream = fs.createWriteStream(filename + ".ttl", options); 
				stream.write("# Baked by Seki \n\n");

				var handler = new TurtleHandler();
				handler.GET(uri, stream); // includes a stream.end()
			}
		});

	},
	"unbake" : function() { // perhaps this should spawn a separate OS process?
		// this.value2 = argument + 100;
		console.log("Admin.unbake called");
	}
};

module.exports = Admin;