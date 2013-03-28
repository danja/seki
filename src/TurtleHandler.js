var http = require('http');

var config = require('./config/ConfigDefault').config;
var sparqlTemplates = require('./templates/SparqlTemplates');
var headers = require('./config/Headers');

// Constructor
function TurtleHandler() {

}

// properties and methods
TurtleHandler.prototype = {

	value1 : "default_value",
	
	// uses http://www.w3.org/TR/sparql11-http-rdf-update/#http-put
	"PUT" : function(uri, data, callback){

		console.log("URI in PUT = "+uri);
		var client = http.createClient(config.sparqlPort, config.sparqlHost);
		var queryPath = config.sparqlGraphEndpoint + "?graph=" + escape(uri);
		// HERE HERE HERE
		var headers = {
				"Content-type" : "text/turtle"
			}
		var clientRequest = client.request("PUT", queryPath, headers);
		clientRequest.end(data);
		
		// handle SPARQL server response
		clientRequest.on('response', function(queryResponse) {
			callback(queryResponse.statusCode,
					queryResponse.headers);
		});
	},

	// uses http://www.w3.org/TR/sparql11-http-rdf-update/#http-get
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

			// console.log("STATTUS=" + queryResponse.statusCode);
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

	/* utility - gets list of named graph URIs
	 * as object bindings
	 * used by admin/Admin.js
	 */
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