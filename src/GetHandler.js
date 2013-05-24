var http = require('http');
var url = require('url');
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
	"Transfer-Encoding" : "chunked",
	"Access-Control-Allow-Origin" : "*" // CORS is needed?
};

// Constructor
function GetHandler() {

}

// properties and methods
GetHandler.prototype = {

	"handle" : function(sekiRequest, sekiResponse) {
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

		var urlParts = url.parse(sekiRequest.url, true);
		var query = urlParts.query;

		// console.log("urlParts.query[mode] = " + urlParts.query["mode"]);

		var mode = urlParts.query["mode"];

		if (mode) {
			console.log("MODE = "+mode);
			console.log("sekiRequest.url before = " + sekiRequest.url);

			resource = config.uriBase + urlParts.pathname;

			var replaceMap = {
				"uri" :  urlParts.pathname
			};

			// the body of a post
			if (mode == "content") {
				viewTemplate = htmlTemplates.contentTemplate;
				console.log("ASKING FOR CoNTENT TEMPLATE");
				console.log("content resource = " + resource);
			}

			// top-level editor (with tabs)
			if (mode == 'edit') {
				viewTemplate = htmlTemplates.editorTemplate;
				// console.log("EDITOR TEMPLATE = "+html);
				var html = freemarker.render(viewTemplate, replaceMap);
				// console.log("EDITOR HTML = "+html);
				sekiResponse.end(html);
			}

			console.log("RESOURCE = " + resource);

			// WYSIWYG HTML editor (tinyMCE)
			 if (mode == "editHTML") {
			 viewTemplate = htmlTemplates.htmlEditorTemplate;
			 console.log("ASKING FOR CoNTENT TEMPLATE");

//			 var html = freemarker.render(viewTemplate, replaceMap);
//			 sekiResponse.end(html);
			 }
			
			// var sourceEditorSuffix = "?mode=source";
			if (mode == "editSource") {
				viewTemplate = htmlTemplates.sourceEditorTemplate;
				console.log("ASKING FOR SOURCE TEMPLATE");
				
//				var html = freemarker.render(viewTemplate, replaceMap);
//				sekiResponse.end(html);
			}
		}

		// build the query
		// var queryTemplater = templater(queryTemplate);
		var replaceMap = {
			"uri" : resource
		};
		// var sparql = queryTemplater.fillTemplate(replaceMap);

		var sparql = freemarker.render(queryTemplate, replaceMap);

		// build the URL from the query
		// var queryPath = config.sparqlQueryEndpoint + "?query=" + escape(sparql);

		// make the request to the SPARQL server
		// var clientRequest = client.request("GET", queryPath, sparqlHeaders);
		config.clientOptions["method"] = "GET";
		config.clientOptions["path"] = config.sparqlQueryEndpoint + "?query=" + escape(sparql);

		var clientRequest = http.request(config.clientOptions, function(queryResponse) {
			queryResponse.setEncoding('utf8');
			});
		
		verbosity("QUERY = " + sparql);

		// handle the response from the SPARQL server
		clientRequest.on('response', function(queryResponse) {
			console.log("VIEW TEMPLATE = "+viewTemplate);
		//	serveHTML(resource, viewTemplate, sekiResponse, queryResponse);
			var urlParts = url.parse(sekiRequest.url, true);
			
			serveHTML(urlParts.pathname, viewTemplate, sekiResponse, queryResponse); ////////////////////////////////////////////////////////////////
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
console.log("in serveHTML, viewTemplate = "+viewTemplate);
	if (!viewTemplate) {
		viewTemplate = htmlTemplates.postViewTemplate;
	}

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

		if (bindings && bindings.title) { // // this is shite
			// if (bindings != {}) { // // this is shite
			verbosity("here GOT: " + JSON.stringify(bindings));
			// verbosity("TITLE: " + bindings.title);
			verbosity("WRITING HEADERS " + JSON.stringify(sekiHeaders));
			sekiResponse.writeHead(200, sekiHeaders);
			// var html = viewTemplater.fillTemplate(bindings);
			console.log("VIEW TEMPLATE2 = "+viewTemplate);
			
			bindings["uri"] = resource;
			
			var html = freemarker.render(viewTemplate, bindings);
		} else {
			verbosity("404");
			sekiResponse.writeHead(404, sekiHeaders);
			// /////////////////////////////// refactor
			// var creativeTemplater =
			// templater(htmlTemplates.creativeTemplate);
			var creativeMap = {
				 "uri" : resource
				// "uri" : 	sekiRequest.url
			};
		//	var html = freemarker.render(htmlTemplates.creativeTemplate,
		//			creativeMap);
			var html = freemarker.render(htmlTemplates.editorTemplate,
					creativeMap);
			
			console.log("\n\n\n\nTHIS IS THE OUTPUT\n"+html);
		}
		sekiResponse.end(html);
	});
};

function verbosity(message) {
	if (verbose)
		console.log(message);
}

module.exports = GetHandler;