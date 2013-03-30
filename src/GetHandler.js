var special = require('./config/SpecialPages');
// var templater = require('./templates/Templater');
var sparqlTemplates = require('./templates/SparqlTemplates');
var htmlTemplates = require('./templates/HtmlTemplates');
var TurtleHandler = require('./TurtleHandler');
var config = require('./config/ConfigDefault').config;
var freemarker = require('./templates/freemarker');

var verbose = true;

var sparqlHeaders = {
	"Accept" : "application/sparql-results+xml",
	"Host" : config.sekiHost + ":" + config.sekiPort
};

// is duplicated in seki.js
var sekiHeaders = {
	"Content-type" : "text/html; charset=utf-8",
	"Connection" : "keep-alive", // added later
	"Transfer-Encoding" : "chunked"
};

// Constructor
function GetHandler() {

}

// properties and methods
GetHandler.prototype = {

	"handle" : function(client, sekiRequest, sekiResponse) {
		var queryTemplate;
		var viewTemplate;

		// this is duplicated in seki.js
		var accept = sekiRequest.headers["accept"];

		// the URI used in the RDF
		var resource = config.uriBase + sekiRequest.url;
		console.log("RESOURCE = " + resource);
		console.log("sekiRequest.url = " + sekiRequest.url);

		if (special[sekiRequest.url]) {
			queryTemplate = special[sekiRequest.url].sparqlTemplate;
			viewTemplate = special[sekiRequest.url].htmlTemplate;
		}

		console.log("special[sekiRequest.url] = " + special[sekiRequest.url]);
		console.log("queryTemplate = " + queryTemplate);
		console.log("viewTemplate = " + viewTemplate);

		if (accept && accept.indexOf("text/turtle") == 0) {
			verbosity("text/turtle requested");
			var handler = new TurtleHandler();
			handler.GET(resource, sekiResponse);
			return;
		}

		// Assume HTML is acceptable

		if (!queryTemplate) { // need smarter switching/lookup here
			queryTemplate = sparqlTemplates.itemTemplate;
		}
		if (!viewTemplate) { // need smarter switching/lookup here
			viewTemplate = htmlTemplates.itemTemplate;
		}

		var editSuffix = "?mode=edit";

		if (resource.indexOf(editSuffix, resource.length
				- editSuffix.length) !== -1) {
			viewTemplate = htmlTemplates.editorTemplate;
			var contentURL = sekiRequest.url.substring(0, sekiRequest.url.length
					- editSuffix.length) + "?mode=content";
			
			var replaceMap = { "contentURL" : contentURL };
			var html = freemarker.render(viewTemplate, replaceMap);
			sekiResponse.end(html);
		}
		
		console.log("RESOURCE = "+resource);
		
		var contentSuffix = "?mode=content";
		if (resource.indexOf(contentSuffix, resource.length
				- contentSuffix.length) !== -1) {
			viewTemplate = htmlTemplates.contentTemplate;
			console.log("ASKING FOR CoNTENT TEMPLATE");
			console.log("HERE2  sresource = " + resource);
			resource = resource.substring(0, resource.length
					- contentSuffix.length);
			console.log("HERE3  sresource = " + resource);
		}
		console.log("HERE4  sresource = " + resource);
		console.log("queryTemplate = " + queryTemplate);
		console.log("viewTemplate = " + viewTemplate);
		console.log("endpoint = " + config.sparqlQueryEndpoint);

		// build the query
		// var queryTemplater = templater(queryTemplate);
		var replaceMap = {
			"uri" : resource
		};
		// var sparql = queryTemplater.fillTemplate(replaceMap);

		var sparql = freemarker.render(queryTemplate, replaceMap);

		// build the URL from the query
		var queryPath = config.sparqlQueryEndpoint + "?query=" + escape(sparql);

		// make the request to the SPARQL server
		var clientRequest = client.request("GET", queryPath, sparqlHeaders);

		verbosity("QUERY = " + sparql);

		// handle the response from the SPARQL server
		clientRequest.on('response', function(queryResponse) {
			serveHTML(resource, viewTemplate, sekiResponse, queryResponse);
		});

		// finish up
		sekiRequest.on('end', function() {
			// verbosity("End of sekiRequest");
			clientRequest.end();
		});
		return;
	}
}

/*
 * Handles GET requests (typically from a browser)
 */
function serveHTML(resource, viewTemplate, sekiResponse, queryResponse) {

	if (!viewTemplate) {
		viewTemplate = htmlTemplates.postViewTemplate;
	}
	// set up HTML builder
	// var viewTemplater = templater(viewTemplate);

	// verbosity("GOT RESPONSE viewTemplate "+viewTemplate);

	var saxer = require('./srx2map');
	var stream = saxer.createStream();

	sekiResponse.pipe(stream);

	queryResponse.on('data', function(chunk) {
		console.log("CHUNK: " + chunk);
		stream.write(chunk);
	});

	queryResponse.on('end', function() {

		stream.end();

		var bindings = stream.bindings;

		verbosity("bindings " + JSON.stringify(bindings));
		// verbosity("bindings.uri " + bindings.uri);

		if (bindings && bindings.title) { // // this is shite
			// if (bindings != {}) { // // this is shite
			verbosity("here GOT: " + JSON.stringify(bindings));
			// verbosity("TITLE: " + bindings.title);
			verbosity("WRITING HEADERS " + JSON.stringify(sekiHeaders));
			sekiResponse.writeHead(200, sekiHeaders);
			// var html = viewTemplater.fillTemplate(bindings);
			var html = freemarker.render(viewTemplate, bindings);
		} else {
			verbosity("404");
			sekiResponse.writeHead(404, sekiHeaders);
			// /////////////////////////////// refactor
			// var creativeTemplater =
			// templater(htmlTemplates.creativeTemplate);
			var creativeMap = {
				"uri" : resource
			};
			// var html = creativeTemplater.fillTemplate(creativeMap);
			var html = freemarker.render(htmlTemplates.creativeTemplate,
					creativeMap);
		}
		sekiResponse.end(html);
	});
};

function verbosity(message) {
	if (verbose)
		console.log(message);
}

module.exports = GetHandler;