var http = require('http');
var qs = require('querystring'); // POST parameters parser
var sparqlTemplates = require('./templates/SparqlTemplates');
// var templater = require('./templates/Templater');
var freemarker = require('./templates/freemarker');
var Constants = require('./config/Constants');
var config = require('./config/ConfigDefault').config;
var freemarker = require('./templates/freemarker');

var verbose = true;

var postHeaders = {
	"Accept" : "application/sparql-results+xml",
	"Host" : config.sekiHost + ":" + config.sekiPort,
	'Content-Type' : 'application/x-www-form-urlencoded'
};

// this version will be modified
var sekiHeaders2 = {
	"Content-type" : "text/html; charset=utf-8"
};

// Constructor
function PostHandler() {

}

// properties and methods
PostHandler.prototype = {

	"handle" : function(sekiRequest, sekiResponse) {

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
					//		console.log("\n\n\nBEFORE :"+post_body);
							post_body = post_body.replace(/%0D/g,""); // remove carriage returns 
							post_body = post_body.replace(/%0A/g,""); // remove newlines - Fuseki complains otherwise
							console.log("\n\n\nAFTER :"+post_body);
							// turn the POST parameters into JSON
							var replaceMap = qs.parse(post_body);
                            
                           // if(!replaceMap["type"]) {
                            //    replaceMap["type"] = post;
                          //  }

							verbosity("post_body \n" + post_body);
							verbosity("replaceMap \n" + replaceMap);

							replaceMap["content"] = replaceMap["content"].replace(/\"/g, "\\\"");
								
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

							var sparql;
							if (replaceMap.target) { // if a target URI is specified, it's an annotation
								sparql = freemarker.render(sparqlTemplates.insertAnnotationTemplate, replaceMap);
							} else {
								sparql = freemarker.render(sparqlTemplates.insertTemplate, replaceMap);
							}

							verbosity("POST UPDATE \n" + sparql);
                            console.log("POST UPDATE \n" + sparql);
							/*
							 * make the request to the SPARQL server the update
							 * has to be POSTed to the SPARQL server
							 */
//							var clientRequest = client.request("POST",
//									config.sparqlUpdateEndpoint, postHeaders);
							config.clientOptions["method"] = "POST";
							config.clientOptions["path"] = config.sparqlUpdateEndpoint;
							
							var clientRequest = http.request(config.clientOptions, function(queryResponse) {
//								  console.log('STATUS: ' + res.statusCode);
//								  console.log('HEADERS: ' + JSON.stringify(res.headers));
								queryResponse.setEncoding('utf8');
//								  res.on('data', function (chunk) {
//								    console.log('BODY: ' + chunk);
//								  });
								});

							// send the update query as POST parameters
//							clientRequest.write(qs.stringify({
//								"update" : sparql
//							}));
							clientRequest.write(sparql);

//							verbosity(queryPath);
//							verbosity(post_body);
//							verbosity(sparql);

							clientRequest.end();

							// handle the response from the SPARQL server
							clientRequest
									.on(
											'response',
											function(queryResponse) {

												var relativeUri = replaceMap.uri
														.substring(config.uriBase.length);

												// do a redirect to the new item
												sekiHeaders2["Location"] = relativeUri+"?mode=edit";
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