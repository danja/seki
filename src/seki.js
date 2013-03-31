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
var util = require('util'); // isneeded?
var fs = require('fs'); // filesystem module
// var qs = require('querystring'); // POST parameters parser
// var static = require('node-static');
var connect = require('connect');

// @TODO refactor verbosity out (is also in PostHandler and GetHandler)
var verbose = true;

/*
 * Seki support scripts imports
 */

var Constants = require('./config/Constants');
var Utils = require('./Utils');

var Authenticator = require('./Authenticator');
var templater = require('./templates/Templater');
// var sparqlTemplates = require('./sparqlTemplates');
var htmlTemplates = require('./templates/HtmlTemplates');

var TurtleHandler = require('./TurtleHandler');
var JSONHandler = require('./JSONHandler');
var Admin = require('./admin/Admin');
var config = require('./config/ConfigDefault').config;
// var special = require('./SpecialPages');

var GetHandler = require('./GetHandler');
var PostHandler = require('./PostHandler');

var sekiHeaders = {
	"Content-type" : "text/html; charset=utf-8",
	"Connection" : "keep-alive", // added later
	"Transfer-Encoding" : "chunked"
};

var redirectHeaders = {};

var graphHeaders = {
	// "Accept" : "application/rdf+xml",
	"Accept" : "text/turtle",
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
// var fileServer = new (static.Server)(config.wwwDir, {
// cache : false
// // temp while getting config right
// });

var fileServer = connect().use(connect.static(config.wwwDir)).use(
		connect.directory(config.wwwDir)).listen(config.staticPort);

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

	var url = require('url');

	var urlParts = url.parse(sekiRequest.url, true);
	// var query = urlParts.query;
	// var path = urlParts.pathname;

	// __dirname = /home/danny/workspace-javascript/seki/src
	// /home/danny/workspace-javascript/seki/src/seki/js/rdface/
	// /home/danny/workspace-javascript/seki/www/seki/js/rdface/

	// check for corresponding files on the filesystem
	if (sekiRequest.method == "GET" || sekiRequest.method == "HEAD") {
		var tweakedPathname = urlParts.pathname;
		if (urlParts.pathname.substring(0, 1) == "/") {
			tweakedPathname = urlParts.pathname.substring(1);
		}
		var dir = __dirname + "/../www/";
		console.log("dir = " + dir);
		console.log("tweakedPathname = " + tweakedPathname);
		var path = require('path').resolve(dir, tweakedPathname);
		console.log("__dirname = " + __dirname);
		console.log("PATH = " + path);
		
		var stats = null;
		try {
			stats = fs.statSync(path);
		//	console.log(util.inspect(stats));
		} catch (e) {
		//	console.log("Error : " + e);
		}

		
//		fs.exists(path, function(exists) {
			// 303 is See Other
			if (stats) { // exists stopped working
				var location = "http://" + config.staticHost + ":"
						+ config.staticPort + urlParts.pathname;
				redirectHeaders["Location"] = location;
				console.log("LOCATION = " + location);
				sekiResponse.writeHead(303, redirectHeaders);
				sekiResponse.end("303 Redirect to " + "<a href=\"" + location
						+ "\">new location</a>");
				return;
			}
	//	});
		// fileServer.serve(sekiRequest, sekiResponse, function(err, res) {
		// console.log("RES = "+res);
		// if (err) { // the file doesn't exist, leave it to Seki
		// sys.error("Error serving " + sekiRequest.url + " - " +
		// err.message); // temp for debugging
		// } else { // The file was served successfully
		// verbosity(sekiRequest.url + " - " + res.message);
		// }
		// });
		// var url = sekiRequest.url;
		// fileServer.serveFile(path, 500, {}, sekiRequest,
		// sekiResponse).addListener('error', function (err) {
		// sys.error("Error HERE serving " + sekiRequest.url + " - " +
		// err.message);
		// });
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
	// var client = http.createClient(config.sparqlPort, config.sparqlHost);

	// the URI used in the RDF
	// var resource = config.uriBase + sekiRequest.url;
	// console.log("RESOURCE = " + resource);

	// this is duplicated in GetHandler.js
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
		var getHandler = new GetHandler();
		getHandler.handle(sekiRequest, sekiResponse);
	}

	if (sekiRequest.method == "POST") {
		// var postHandler = Object.create(PostHandler);
		var postHandler = new PostHandler();
		postHandler.handle(sekiRequest, sekiResponse);
	}
}

/*
 * Reads a file from the filesystem and writes its data to response (typically a
 * browser)
 * 
 * IS THIS BEING USED???
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
