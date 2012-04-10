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

	"GET" : function(uri, outputStream) {
		var client = http.createClient(config.sparqlPort, config.sparqlHost);
		
		// console.log("TurtleHandler.GET called");

		var queryPath = config.sparqlGraphEndpoint + "?graph=" + escape(uri);
		// verbosity("queryPath =" + queryPath);
		var clientRequest = client.request("GET", queryPath, headers.graph);
		clientRequest.end();

		// handle SPARQL server response
		clientRequest.on('response', function(queryResponse) {
			// serve status & headers

			console.log("STATTUS=" + queryResponse.statusCode);
			if(outputStream.writeHead) { // if it supports this methods, do it
			outputStream.writeHead(queryResponse.statusCode,
					queryResponse.headers);
			}

			// response body may come in chunks, whatever, just pass them on
			queryResponse.on('data', function(chunk) {
				// verbosity("headers " +
				// JSON.stringify(queryResponse.headers));
				outputStream.write(chunk);
			});
			// the SPARQL server response has finished, so finish up this
			// response
			queryResponse.on('end', function() {
				outputStream.end();
			});
		});
	},

	getGraphs : function(callback) {
		// the client that will talk to the SPARQL server
		var client = http.createClient(config.sparqlPort, config.sparqlHost);
		var queryPath = config.sparqlQueryEndpoint + "?query="
				+ escape(sparqlTemplates.listGraphURIs);
		console.log("queryPath =" + queryPath);
		var clientRequest = client.request("GET", queryPath, headers.graph);
		clientRequest.end();

		var saxer = require('./srx2map_multi');
		var stream = saxer.createStream();

		// handle SPARQL server response
		clientRequest.on('response', function(queryResponse) {
			console.log("STATUS=" + queryResponse.statusCode);

			var data = "";
			// response body may come in chunks, whatever, just pass them on

			queryResponse.on('data', function(chunk) {
				// console.log(chunk);
				stream.write(chunk);
			});

			queryResponse.on('end', function() {

				stream.end();

				callback(stream.bindings);
			});
		});
	}
};

module.exports = TurtleHandler;