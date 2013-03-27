/*
 * Main Seki script

 * 
 * see README.md
 */

/* TODO
 * change to using http.request (have done?)
 * 
 * 
 * figure out wat bindings
 * mustache - foreach templates
 */

/*
 * library module imports
 */
var sys = require('sys');
var http = require('http');
var fs = require('fs'); // filesystem module
// var qs = require('querystring'); // POST parameters parser
var static = require('node-static');


// refactor verbosity out (is also in PostHandler)
var verbose = true;

/*
 * Seki support scripts imports
 */

var Constants = require('./Constants');
var Utils = require('./Utils');

var Authenticator = require('./Authenticator');
var templater = require('./templater');
var sparqlTemplates = require('./sparqlTemplates');
var htmlTemplates = require('./htmlTemplates');

var TurtleHandler = require('./TurtleHandler');
var JSONHandler = require('./JSONHandler');
var Admin = require('./admin/Admin');
var config = require('./ConfigDefault').config;
var special = require('./SpecialPages');

var PostHandler = require('./PostHandler');

var sekiHeaders = {
	"Content-type" : "text/html; charset=utf-8",
	"Connection" : "keep-alive", // added later
	"Transfer-Encoding" : "chunked"
};


var graphHeaders = {
	// "Accept" : "application/rdf+xml",
	"Accept" : "text/turtle",
	"Host" : config.sekiHost + ":" + config.sekiPort
};

var sparqlHeaders = {
	"Accept" : "application/sparql-results+xml",
	"Host" : config.sekiHost + ":" + config.sekiPort
};



var notAuthHeaders = {
	"Host" : config.sekiHost + ":" + config.sekiPort,
	'Content-Type' : 'text/plain',
	'WWW-Authenticate' : 'Basic realm="Secure Area"'
};

/*
 * mapping URIs to static files on the filesystem
 * 
 */
var files = {
	"/" : config.wwwDir + "/index.html",
	"/index" : config.wwwDir + "/index.html",
	"/form" : config.wwwDir + "/form.html",
	"404" : config.wwwDir + "/404.html"
};

//
// Create a node-static server to serve the current directory
//
var file = new (static.Server)(config.wwwDir, {
	cache : false
// temp while getting config right
});

// set it running
http.createServer(onRequest).listen(config.sekiPort, config.sekiHost);

verbosity("Seki serving on " + config.sekiHost + ":" + config.sekiPort);
verbosity("addressing SPARQL on " + config.sparqlHost + ":" + config.sparqlPort);

/*
 * Callback to handle HTTP requests (typically from browser)
 */
function onRequest(sekiRequest, sekiResponse) {
	verbosity("SEKI REQUEST HEADERS " + JSON.stringify(sekiRequest.headers));
	verbosity("REQUEST URL = " + sekiRequest.url);
	verbosity("REQUEST METHOD = " + sekiRequest.method);

	// check for corresponding files on the filesystem
	if (sekiRequest.method == "GET" || sekiRequest.method == "HEAD") {
		file.serve(sekiRequest, sekiResponse, function(err, res) {
			if (err) { // the file doesn't exist, leave it to Seki
				// sys.error("Error serving " + sekiRequest.url + " - " +
				// err.message); // temp for debugging
			} else { // The file was served successfully
				verbosity(sekiRequest.url + " - " + res.message);
			}
		});
	}

	verbosity("got past file server");

	var auth = new Authenticator();

	if (sekiRequest.method == "POST") {
		if (!auth.Basic(sekiRequest)) {
			sekiResponse.writeHead(401, notAuthHeaders);
			sekiResponse.end("401 Not Authorized");
			return;
		}
	}
	// handle admin requests/commands
	if (sekiRequest.method == "POST") {
		if (sekiRequest.url.substring(0, 7) == "/admin/") {
			var command = sekiRequest.url.substring(7);
			var admin = new Admin(sekiRequest, sekiResponse);
			if (admin[command]) {
				sekiResponse.writeHead(202, sekiHeaders);
				sekiResponse.end("202 Accepted for command '" + command + "'");
				admin[command](); // perhaps this should spawn a separate OS
				// process?
				return;
			} else {
				sekiResponse.writeHead(404, sekiHeaders);
				sekiResponse.end("404 Not Found. Admin command '" + command
						+ "' unknown");
				return;
			}
		}
	}

	// the client that will talk to the SPARQL server
	var client = http.createClient(config.sparqlPort, config.sparqlHost);

	// the URI used in the RDF
	var resource = config.uriBase + sekiRequest.url;
	console.log("RESOURCE = " + resource);
	var accept = sekiRequest.headers["accept"];

	if (accept && accept.indexOf("application/json") == 0) {
		var handler = new JSONHandler();
		return handler[sekiRequest.method]();
	}

	// verbosity("Accept header =" + accept
	// + accept.indexOf("application/rdf+xml" == 0));

	// TODO pull these out into separate per-media type handlers
	// use pattern as for JSONHandler
	if (sekiRequest.method == "GET") {
		var queryTemplate;
		var viewTemplate;
		// = templater(htmlTemplates.viewTemplate);

		if (special[sekiRequest.url]) {
			queryTemplate = special[sekiRequest.url].sparqlTemplate;
			viewTemplate = special[sekiRequest.url].htmlTemplate;
		}

		// console.log("special[sekiRequest.url] = "+special[sekiRequest.url]);
		// console.log("queryTemplate = "+queryTemplate);
		// console.log("viewTemplate = "+viewTemplate);

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

		// build the query
		var queryTemplater = templater(queryTemplate);
		var replaceMap = {
			"uri" : resource
		};
		var sparql = queryTemplater.fillTemplate(replaceMap);

		// build the URL from the query
		var queryPath = config.sparqlQueryEndpoint + "?query=" + escape(sparql);

		// make the request to the SPARQL server
		var clientRequest = client.request("GET", queryPath, sparqlHeaders);

		// verbosity("QUERY = "+sparql);

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

	if (sekiRequest.method == "POST") {
		//var postHandler = Object.create(PostHandler);
		var postHandler = new PostHandler();
		postHandler.handle(client, sekiRequest, sekiResponse);
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
	var viewTemplater = templater(viewTemplate);

	// verbosity("GOT RESPONSE viewTemplate "+viewTemplate);

	var saxer = require('./srx2map');
	var stream = saxer.createStream();

	sekiResponse.pipe(stream);

	queryResponse.on('data', function(chunk) {
		stream.write(chunk);
	});

	queryResponse.on('end', function() {

		stream.end();

		var bindings = stream.bindings;

		verbosity("bindings " + JSON.stringify(bindings));
		verbosity("bindings.uri " + bindings.uri);

		if (bindings.title) { // // this is shite
			// if (bindings != {}) { // // this is shite
			verbosity("here GOT: " + JSON.stringify(bindings));
			// verbosity("TITLE: " + bindings.title);
			verbosity("WRITING HEADERS " + JSON.stringify(sekiHeaders));
			sekiResponse.writeHead(200, sekiHeaders);
			var html = viewTemplater.fillTemplate(bindings);
		} else {
			verbosity("404");
			sekiResponse.writeHead(404, sekiHeaders);
			// /////////////////////////////// refactor
			var creativeTemplater = templater(htmlTemplates.creativeTemplate);
			var creativeMap = {
				"uri" : resource
			};
			var html = creativeTemplater.fillTemplate(creativeMap);
		}
		sekiResponse.end(html);
	});
};

/*
 * Reads a file from the filesystem and writes its data to response (typically a
 * browser)
 */
function serveFile(sekiResponse, status, file) {
	verbosity("FILE = " + file);

	fs.readFile(file, function(err, data) {
		if (err) {
			data = "Error :" + err;
			status = 500;
		}
		sekiResponse.writeHead(status, sekiHeaders); // queryResponse.headers
		sekiResponse.write(data, 'binary');
		sekiResponse.end();
	});
}

function verbosity(message) {
	if (verbose)
		console.log(message);
}
// }
