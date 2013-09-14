var http = require('http');
var url = require('url');
var special = require('../config/Special');
// var templater = require('./templates/Templater');
var sparqlTemplates = require('../templates/SparqlTemplates');
var htmlTemplates = require('../templates/HtmlTemplates');
var TurtleHandler = require('../TurtleHandler');
var config = require('../config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);
var freemarker = require('../templates/freemarker');

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
function GetBlogHandler() {
    
}

// properties and methods
GetBlogHandler.prototype = {
    
    "handle" : function(sekiRequest, sekiResponse) {
        
        log.debug("GETBLOGHANDLER");
        
        // this is duplicated in seki.js
      //  var accept = sekiRequest.headers["accept"];
        
        // the URI used in the RDF
        var resource = config.uriBase + sekiRequest.url;
        
        log.debug("sekiRequest.url = " + sekiRequest.url);
        
        // build the query
        // var queryTemplater = templater(queryTemplate);
        // var replaceMap = {
        //    "uri" : resource
        // };
        // var sparql = queryTemplater.fillTemplate(replaceMap);
    
        
        var replaceMap = {
           "limit" : "5",
           "offset" : "0"
        };
        
        
        
        var sparql = freemarker.render(sparqlTemplates.pagedItemsTemplate, replaceMap);
        
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
         
        serveAll(sekiResponse, queryResponse);
        var urlParts = url.parse(sekiRequest.url, true);
        
       // serveHTML(urlParts.pathname, viewTemplate, sekiResponse, queryResponse); ////////////////////////////////////////////////////////////////
        });
        
        // finish up
        sekiRequest.on('end', function() {
            log.debug("End of sekiRequest");
            clientRequest.end();
        });
        return;
    }
}

function serveAll(sekiResponse, queryResponse) {
    log.debug("in serveAll");

    var saxer = require('../srx2map_multi');
    var stream = saxer.createStream();
    
    sekiResponse.pipe(stream);
    
    queryResponse.on('data', function(chunk) {
        log.debug("CHUNK: " + chunk);
        stream.write(chunk);
    });
    
    queryResponse.on('end', function() {
        
        stream.end();
        
        var bindings = stream.bindings;
        
        // verbosity("bindings " + JSON.stringify(bindings));
        
//        if (!bindings || !bindings.title) { // // this is shite
 //           var creativeMap = {
 //               "uri" : resource,
 //               "title" : "Enter title",
 //               "content" : "Enter content",
 //               "login" : "nickname"
 //           }
            // "uri" :  sekiRequest.url
//        };
        
        sekiResponse.writeHead(200, sekiHeaders);
        
 //       bindings["uri"] = resource; 
        
 //       var html = freemarker.render(viewTemplate, bindings);
        
        //log.info("404");
        var articles = "GOT TO BINDINGS";
        for(i in bindings) {
            
            articles += freemarker.render(htmlTemplates.blogArticleTemplate, bindings[i]);
            // JSON.stringify(bindings[i]);
        }
        log.debug("bindings = "+JSON.stringify(bindings));
        var map = { "articles" : articles };
        html = freemarker.render(htmlTemplates.blogViewTemplate, map);
        //    log.debug("viewTemplate = "+viewTemplate);
        //    log.debug("bindings = "+JSON.stringify(bindings));
        sekiResponse.end(html);
    });
};

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
        log.debug("CHUNK: " + chunk);
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

module.exports = GetBlogHandler;