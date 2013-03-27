var qs = require('querystring'); // POST parameters parser
var sparqlTemplates = require('./sparqlTemplates');
var templater = require('./templater');
var Constants = require('./Constants');
var config = require('./ConfigDefault').config;

var verbose = true;

var postHeaders = {
		"Accept" : "application/sparql-results+xml",
		"Host" : config.sekiHost + ":" + config.sekiPort,
		'Content-Type' : 'application/x-www-form-urlencoded'
	};

//this version will be modified
var sekiHeaders2 = {
	"Content-type" : "text/html; charset=utf-8"
};

//Constructor
function PostHandler() {

}

//properties and methods
PostHandler.prototype = {
		
		  "handle": function(client, sekiRequest, sekiResponse) {

// verbosity("Start of POST");

		// check media type of data

		var post_body = '';

		// request body may come in chunks, join them together
		sekiRequest.on('data', function(chunk) {
			post_body += chunk;
		});

		// now received body of request
		sekiRequest
				.on(
						'end',
						function() {

							// turn the POST parameters into JSON
							var replaceMap = qs.parse(post_body);

							verbosity("post_body \n" + post_body);
							verbosity("replaceMap \n" + replaceMap);

							var queryTemplater;
							if (replaceMap.target) { // if a target URI is
														// specified, it's an
														// annotation
								queryTemplater = templater(sparqlTemplates.insertAnnotationTemplate);
							} else {
								queryTemplater = templater(sparqlTemplates.insertTemplate);
							}

							replaceMap["date"] = new Date().toJSON();
							var resourceType = replaceMap["type"];

							// URI wasn't specified so generate one (if a target
							// URI has been specified
							// use that as a seed)
							if (!replaceMap["uri"] || replaceMap["uri"] == "") {
								replaceMap["uri"] = Utils
										.mintURI(replaceMap["target"]);
							}

							// graph wasn't specified so create named graph
							if (!replaceMap["graph"]
									|| replaceMap["graph"] == "") {
								replaceMap["graph"] = replaceMap["uri"];
							}
							replaceMap["type"] = Constants.rdfsTypes[resourceType];

							verbosity("resource type \n" + resourceType);
							verbosity("type \n"
									+ Constants.rdfsTypes[resourceType]);

							// verbosity("ReplaceMap =
							// "+JSON.stringify(replaceMap));

							// can now make the query
							var sparql = queryTemplater
									.fillTemplate(replaceMap);

							verbosity("POST UPDATE \n" + sparql);
							/*
							 * make the request to the SPARQL server the update
							 * has to be POSTed to the SPARQL server
							 */
							var clientRequest = client.request("POST",
									config.sparqlUpdateEndpoint, postHeaders);

							// send the update query as POST parameters
							clientRequest.write(qs.stringify({
								"update" : sparql
							}));

							// verbosity(queryPath);
							// verbosity(post_body);
							// verbosity(sparql);

							clientRequest.end();

							// handle the response from the SPARQL server
							clientRequest
									.on(
											'response',
											function(queryResponse) {

												var relativeUri = replaceMap.uri
														.substring(config.uriBase.length);

												// do a redirect to the new item
												sekiHeaders2["Location"] = relativeUri;
												sekiResponse.writeHead(303,
														sekiHeaders2);
												// all done
												sekiResponse.end();
											});
						});
}
}

function verbosity(message) {
	if (verbose)
		console.log(message);
}

module.exports = PostHandler;