var http = require('http');

var config = require('./ConfigDefault').config;
var sparqlTemplates = require('./sparqlTemplates');
var headers = require('./Headers');

// Constructor
function TurtleHandler() {

}

// properties and methods
TurtleHandler.prototype = {

	value1 : "default_value",

	// "GET": function() {
	// // this.value2 = argument + 100;
	// console.log("JSONHandler.GET called");
	// }
	getGraphs : function() {
		// the client that will talk to the SPARQL server
		var client = http.createClient(config.sparqlPort, config.sparqlHost);
		var queryPath = config.sparqlQueryEndpoint + "?query="
				+ escape(sparqlTemplates.listGraphURIs);
		console.log("queryPath =" + queryPath);
		var clientRequest = client.request("GET", queryPath, headers.graph);
		clientRequest.end();

		// handle SPARQL server response
		clientRequest.on('response', function(queryResponse) {
			console.log("STATUS=" + queryResponse.statusCode);

			var data = "";
			// response body may come in chunks, whatever, just pass them on
			queryResponse.on('data', function(chunk) {
				// verbosity("headers " +
				// JSON.stringify(queryResponse.headers));
				data += chunk;
			});
			// the SPARQL server response has finished, so finish up this
			// response
			queryResponse.on('end', function() {
				console.log("URIs = "+data);
			});
		});
	}
};

module.exports = TurtleHandler;