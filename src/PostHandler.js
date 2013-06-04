var http = require('http');
var qs = require('querystring'); // POST parameters parser
var sparqlTemplates = require('./templates/SparqlTemplates');
var StoreClient = require("./StoreClient");
// var templater = require('./templates/Templater');
var freemarker = require('./templates/freemarker');
var Constants = require('./config/Constants');
var config = require('./config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);


var verbose = true;

var postHeaders = {
	"Accept" : "application/sparql-results+xml",
	"Host" : config.sekiHost + ":" + config.sekiPort,
	'Content-Type' : 'application/x-www-form-urlencoded'
};

// Constructor
function PostHandler() {
}

// properties and methods
PostHandler.prototype = {

	"handle" : function(sekiRequest, sekiResponse) {

        log.debug("PostHandler.handle");

		// check media type of data..?

		var post_body = '';

		// request body may come in chunks, join them together
		sekiRequest.on('data', function(chunk) {
			post_body += chunk;
		});

		// now received body of request
		sekiRequest.on('end',
						function() {
							post_body = post_body.replace(/%0D/g,""); // remove carriage returns 
							post_body = post_body.replace(/%0A/g,""); // remove newlines - Fuseki complains otherwise

							// turn the POST parameters into a map (JSON object)
							var replaceMap = qs.parse(post_body);

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

						//	verbosity("POST UPDATE \n" + sparql);
                        //    console.log("POST UPDATE \n" + sparql);
							/*
							 * make the request to the SPARQL server the update
							 * has to be POSTed to the SPARQL server
							 */
//							var clientRequest = client.request("POST",
//									config.sparqlUpdateEndpoint, postHeaders);
							config.clientOptions["method"] = "POST";
							config.clientOptions["path"] = config.sparqlUpdateEndpoint;
							
                       
                            
                            
                            var options = {
                                "path" : config.sparqlUpdateEndpoint,
                                "method" : "POST"
                            };
                       //     "send" : function(options, sparql, sekiResonse, redirectURI, callback) 
                            var redirectURI = replaceMap.uri.substring(config.uriBase.length);
                            


                           // }
                            
                            var callback = function(queryResponse) {
                                log.debug("callback called");
                                var headers = {
                                    "Location" : redirectURI,
                 "Content-type" : "text/html; charset=utf-8"
                                };
                                // do the redirect
                                sekiResponse.writeHead(303, headers);
                                sekiResponse.end();
                            }
                          //  callback("boo");
                          //  log.debug("CALLBACK = "+callback);
                            
                            var client = new StoreClient();
                            client.send(options, sparql, sekiResponse, redirectURI, callback);
	});
  
}
}

function verbosity(message) {
	if (verbose)
		console.log(message);
}

module.exports = PostHandler;