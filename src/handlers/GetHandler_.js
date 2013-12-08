var http = require('http');
var url = require('url');

// var templater = require('./templates/Templater');
var sparqlTemplates = require('../templates/SparqlTemplates');
var htmlTemplates = require('../templates/HtmlTemplates');
var TurtleHandler = require('./TurtleHandler');
var config = require('../config/ConfigDefault').config;
var Nog = require('../lib/nog/nog'),
log = new Nog(config.logLevel);
var freemarker = require('../templates/freemarker');
var saxer = require('../core/srx2map'); // _multi is ok?

var sparqlHeaders = {
    "Accept": "application/sparql-results+xml",
    "Host": config.sekiHost + ":" + config.sekiPort
};

// is duplicated in seki.js
var sekiHeaders = {
    "Content-type": "text/html; charset=utf-8",
    "Connection": "keep-alive", // added later
    "Transfer-Encoding": "chunked",
    "Access-Control-Allow-Origin": "*" // CORS is needed?
};

// Constructor
function GetHandler() {

}

// properties and methods
GetHandler.prototype = {
    "handle": function(sekiRequest, sekiResponse) {
        return this.handleFull(sekiRequest, sekiResponse, null, null);
    },
    "handleFull": function(sekiRequest, sekiResponse, queryTemplate, viewTemplate) {
        log.debug("GetHandler.handle");
        var queryTemplate;
        var viewTemplate;

        // this is duplicated in seki.js
        var accept = sekiRequest.headers["accept"];

        // the URI used in the RDF
        var resource = config.uriBase + sekiRequest.url;
        //  log.debug("RESOURCE = " + resource);
        //  log.debug("sekiRequest.url = " + sekiRequest.url);
        //   log.debug("queryTemplate = " + queryTemplate);
        //   log.debug("viewTemplate = " + viewTemplate);
        //  log.debug("Headers = "+JSON.stringify(sekiRequest.headers));
        //  log.debug("SUB "+sekiRequest.url.substring(sekiRequest.url.length-5));
        if (sekiRequest.url.substring(sekiRequest.url.length - 5) != ".html") {

            if (accept && accept.indexOf("text/turtle") == 0) {
                //      log.debug("text/turtle requested");
                var handler = new TurtleHandler();
                handler.GET(resource, sekiResponse);
                return;
            }

            if (accept && accept.indexOf("application/json") == 0) {
                //      log.debug("application/json requested");
                var handler = new GetJsonHandler(); ////// DOESN'T EXIST!!!
                handler.handle(resource, sekiResponse);
                return;
            }
        }

        // Assume HTML is acceptable

        if (!queryTemplate) { // need smarter switching/lookup here
            queryTemplate = sparqlTemplates.pageTemplate;
        }
        if (!viewTemplate) { // need smarter switching/lookup here
            viewTemplate = htmlTemplates.pageTemplate;
        }

        var urlParts = url.parse(sekiRequest.url, true);
        var query = urlParts.query;

        resource = config.uriBase + urlParts.pathname;

        log.debug("RESOURCE = " + resource);


        //viewTemplate = htmlTemplates.postViewTemplate;

        //  log.debug("viewTemplate == "+viewTemplate);
        // build the query
        // var queryTemplater = templater(queryTemplate);
        var replaceMap = {
            "uri": resource
        };

        var sparql = freemarker.render(queryTemplate, replaceMap);

        log.debug("SPARQL = " + sparql);
        // build the URL from the query
        // make the request to the SPARQL server

        config.client["method"] = "GET";
        config.client["path"] = config.client["queryEndpoint"] + "?query=" + escape(sparql);

        var clientRequest = http.request(config.client, function(queryResponse) {
            queryResponse.setEncoding('utf8');

            log.debug("url = "+JSON.stringify(url));
            serveHTML(urlParts.pathname, viewTemplate, sekiResponse, queryResponse); //////////////////

        });
        sekiRequest.on('data', function() { // is needed?
            log.debug("ondata");
        });
        // finish up
        sekiRequest.on('end', function() {
            log.debug("End of sekiRequest");
            clientRequest.end();
        });
    }
}

/*
 * Handles GET requests (typically from a browser)
 */
function serveHTML(resource, viewTemplate, sekiResponse, queryResponse) {
   //  log.debug("in serveHTML, viewTemplate = "+viewTemplate);
    log.debug("in serveHTML, resource = "+resource);
    if (!viewTemplate) {
        viewTemplate = htmlTemplates.contentTemplate; // 
    };
    var stream = saxer.createStream();

    sekiResponse.pipe(stream);

    queryResponse.on('data', function(chunk) {
        log.debug("CHUNK: " + chunk);
        stream.write(chunk);
    });

    queryResponse.on('end', function() {
        log.debug(" queryResponse.on('end'");
        stream.end();

        var bindings = stream.bindings;

        log.debug("\nbindings " + JSON.stringify(bindings));

        sekiResponse.writeHead(200, sekiHeaders);
        bindings["uri"] = resource;
        
        log.debug("\nbindings2 " + JSON.stringify(bindings));

        var html = freemarker.render(viewTemplate, bindings);
        log.debug("sekiResponse.end(html)");
        //       log.debug("viewTemplate = "+viewTemplate);
        //       log.debug("bindings = "+JSON.stringify(bindings));
        sekiResponse.end(html);
    });
};

module.exports = GetHandler;
