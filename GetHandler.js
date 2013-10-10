var http = require('http');
var url = require('url');
var special = require('./config/Special');
// var templater = require('./templates/Templater');
var sparqlTemplates = require('./templates/SparqlTemplates');
var htmlTemplates = require('./templates/HtmlTemplates');
var TurtleHandler = require('./TurtleHandler');
var config = require('./config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);
var freemarker = require('./templates/freemarker');

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
        log.debug("RESOURCE = " + resource);
        log.debug("sekiRequest.url = " + sekiRequest.url);

		if (special[sekiRequest.url]) {
			queryTemplate = special[sekiRequest.url].sparqlTemplate;
			viewTemplate = special[sekiRequest.url].htmlTemplate;
		}

		console.log("special[sekiRequest.url] = " + special[sekiRequest.url]);
        log.debug("queryTemplate = " + queryTemplate);
        log.debug("viewTemplate = " + viewTemplate);

		if (accept && accept.indexOf("text/turtle") == 0) {
            log.debug("text/turtle requested");
			var handler = new TurtleHandler();
			handler.GET(resource, sekiResponse);
			return;
		}
		
		if (accept && accept.indexOf("application/json") == 0) {
            log.debug("application/json requested");
            var handler = new GetJsonHandler();
            handler.handle(resource, sekiResponse);
            return;
        }

		// Assume HTML is acceptable

		if (!queryTemplate) { // need smarter switching/lookup here
			queryTemplate = sparqlTemplates.itemTemplate;
		}
		if (!viewTemplate) { // need smarter switching/lookup here
            viewTemplate = htmlTemplates.postViewTemplate;
		}

		var urlParts = url.parse(sekiRequest.url, true);
		var query = urlParts.query;

        log.debug("urlParts.query[mode] = " + urlParts.query["mode"]);

		var mode = urlParts.query["mode"];
        
        /////////////////////////////
        mode="content"; // force it
        /////////////////////////////////

		if (mode) {
            log.debug("MODE = "+mode);
            log.debug("sekiRequest.url before = " + sekiRequest.url);

			resource = config.uriBase + urlParts.pathname;

			var replaceMap = {
                "uri" :  urlParts.pathname // config.uriBase + urlParts.pathname
			};

			// the body of a post
			if (mode == "content") {
		//		viewTemplate = htmlTemplates.contentTemplate;
                viewTemplate = htmlTemplates.postViewTemplate;
                log.debug("ASKING FOR CoNTENT TEMPLATE");
                log.debug("content resource = " + resource);
			}

			// top-level editor (with tabs)
			if (mode == 'edit') {
				viewTemplate = htmlTemplates.editorTemplate;
                log.debug("EDITOR TEMPLATE = "+html);
				var html = freemarker.render(viewTemplate, replaceMap);
                log.debug("EDITOR HTML = "+html);
				sekiResponse.end(html);
			}

			console.log("RESOURCE = " + resource);

			// WYSIWYG HTML editor (tinyMCE)
			 if (mode == "editHTML") {
			 viewTemplate = htmlTemplates.htmlEditorTemplate;
             log.debug("ASKING FOR CoNTENT TEMPLATE");

//			 var html = freemarker.render(viewTemplate, replaceMap);
//			 sekiResponse.end(html);
			 }
			
			// var sourceEditorSuffix = "?mode=source";
			if (mode == "editSource") {
				viewTemplate = htmlTemplates.sourceEditorTemplate;
                log.debug("ASKING FOR SOURCE TEMPLATE");
				
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
		config.client["method"] = "GET";
        config.client["path"] = config.client["queryEndpoint"] + "?query=" + escape(sparql);

        log.debug("OPTIONS IN GETHANDLER = "+JSON.stringify(config.client));
		var clientRequest = http.request(config.client, function(queryResponse) {
			queryResponse.setEncoding('utf8');
			});
		
        log.debug("QUERY = " + sparql);

		// handle the response from the SPARQL server
		clientRequest.on('response', function(queryResponse) {
		log.debug("VIEW TEMPLATE = "+viewTemplate);
		//	serveHTML(resource, viewTemplate, sekiResponse, queryResponse);
			var urlParts = url.parse(sekiRequest.url, true);
			
			serveHTML(urlParts.pathname, viewTemplate, sekiResponse, queryResponse); ////////////////////////////////////////////////////////////////
		});

		// finish up
		sekiRequest.on('end', function() {
            log.debug("End of sekiRequest");
			clientRequest.end();
		});
		return;
	}
}

/*
 * Handles GET requests (typically from a browser)
 */
function serveHTML(resource, viewTemplate, sekiResponse, queryResponse) {
    log.debug("in serveHTML, viewTemplate = "+viewTemplate);
	if (!viewTemplate) {
        viewTemplate = htmlTemplates.contentTemplate; // 
	}

	var saxer = require('./srx2map');
	var stream = saxer.createStream();

	sekiResponse.pipe(stream);

	queryResponse.on('data', function(chunk) {
     //   log.debug("CHUNK: " + chunk);
		stream.write(chunk);
	});

	queryResponse.on('end', function() {

		stream.end();

		var bindings = stream.bindings;

		// verbosity("bindings " + JSON.stringify(bindings));

		if (!bindings || !bindings.title) { // // this is shite
                        var creativeMap = {
                 "uri" : resource,
                 "title" : "Enter title",
                  "content" : "Enter content",
                  "login" : "nickname"
                        }
                // "uri" :  sekiRequest.url
            };
            
			sekiResponse.writeHead(200, sekiHeaders);

            bindings["uri"] = resource; 
            
            var html = freemarker.render(viewTemplate, bindings);

			log.info("404");
		
        //    log.debug("viewTemplate = "+viewTemplate);
        //    log.debug("bindings = "+JSON.stringify(bindings));
		sekiResponse.end(html);
	});
};

module.exports = GetHandler;