var http = require('http');
var qs = require('querystring'); // POST parameters parser
var sparqlTemplates = require('../templates/SparqlTemplates');
var StoreClient = require("../StoreClient");
// var templater = require('./templates/Templater');
var freemarker = require('../templates/freemarker');
var Constants = require('../config/Constants');
var config = require('../config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);
var SparqlUtils = require('../SparqlUtils');

var postHeaders = {// ?????????????????????????
    "Accept" : "application/sparql-results+xml",
    "Host" : config.sekiHost + ":" + config.sekiPort,
    'Content-Type' : 'application/x-www-form-urlencoded'
};

function TemplatingResponseHandler() {
}

TemplatingResponseHandler.prototype = { 
    
    "handle" : function(sekiRequest, sekiResponse, message, route) {
        
        log.debug("sekiRequest = "+sekiRequest);
        log.debug("TemplatingResponseHandler.handle");
        log.debug("\n\n\nROUTE = \n\n\n"+JSON.stringify(route)); 
        
        var resource = config.uriBase + route.path;
        var graphURI = config.uriBase + "/" + route.graph;
        
        log.debug("RESOURCE = " + resource);
        
        log.debug("route.queryTemplate = " + route.queryTemplate);
        
        var turtleSplit = SparqlUtils.extractPrefixes(message);
        var turtle = message;
        
        var replaceMap = {
            "graph" : graphURI,
            "uri" : resource,
            "prefixes" : turtleSplit.prefixes,
            "body" : turtleSplit.body
        };     
        var sparql = freemarker.render(sparqlTemplates[route.queryTemplate], replaceMap);
        
        log.debug("SPARQL = "+sparql);
        
        log.debug("route.queryOptions = "+JSON.stringify(route.queryOptions));

            var headers = {
                "Location" : route.path,
                "Content-type" : "text/html; charset=utf-8"
            };
            if(!route.viewTemplate || route.viewTemplate=="") { // no response data expected
                log.debug("\n\n\n\n\n\nNO DATA EXPECTED");
                var finalCallback = function(){
                    log.debug("route.responseCode = "+route.responseCode);
                    log.debug("route.responseHeaders = "+JSON.stringify(route.responseHeaders));
                    sekiResponse.writeHead(route.responseCode, route.responseHeaders); // 201 Created
                    sekiResponse.end();
                };
                var client = new StoreClient();
                log.debug("SENDING TO STORE");
                log.debug("SPARQL = "+sparql);
                log.debug("route.queryOptions = "+JSON.stringify(route.queryOptions));
                client.send(route.queryOptions, sparql, finalCallback);   
                return;
            }
            
            var clientRequest = http.request(config.client, function(queryResponse) {
                    queryResponse.setEncoding('utf8');
                    this.respond(sekiResponse, queryResponse, route, replaceMap);
                });
       // }
        
        
    },
    
    "respond" : function(sekiResponse, queryResponse, route, replaceMap) {
        log.debug("RESPOND");

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
            
            sekiResponse.writeHead(200, responseHeaders);
            bindings["uri"] = replaceMap.uri; 
            bindings["graph"] = replaceMap.graph;
            var html = freemarker.render(viewTemplate, bindings);
            log.debug("sekiResponse.end(html)");
            //       log.debug("viewTemplate = "+viewTemplate);
            //       log.debug("bindings = "+JSON.stringify(bindings));
            sekiResponse.end(html);
        });
    }
    
}

module.exports = TemplatingResponseHandler;