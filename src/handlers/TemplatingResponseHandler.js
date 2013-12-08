var http = require('http');
var qs = require('querystring'); // POST parameters parser
var sparqlTemplates = require('../templates/SparqlTemplates');
var htmlTemplates = require('../templates/HtmlTemplates');
var StoreClient = require("../core/StoreClient");
// var templater = require('./templates/Templater');
var freemarker = require('../templates/freemarker');
var Constants = require('../config/Constants');
var config = require('../config/ConfigDefault').config;
var Nog = require('../lib/nog/nog'),
log = new Nog(config.logLevel);
var SparqlUtils = require('../core/SparqlUtils');
var saxer = require('../core/srx2map'); // _multi is ok?

var postHeaders = { // ?????????????????????????
    "Accept": "application/sparql-results+xml",
    "Host": config.sekiHost + ":" + config.sekiPort,
    'Content-Type': 'application/x-www-form-urlencoded'
};

function TemplatingResponseHandler() {}

TemplatingResponseHandler.prototype = {
    "delete": function(sekiRequest, sekiResponse, message, route) {
        this.create(sekiRequest, sekiResponse, message, route);
    },

    "create": function(sekiRequest, sekiResponse, message, route) {
        var turtleSplit = SparqlUtils.extractPrefixes(message);
        var turtle = message;

        this.replaceMap["prefixes"] = turtleSplit.prefixes;
        this.replaceMap["body"] = turtleSplit.body;

        var sparql = freemarker.render(sparqlTemplates[route.queryTemplate], this.replaceMap);
       // log.debug("SPARQL = " + sparql);

        var finalCallback = function() {
            log.debug("route.responseCode = " + route.responseCode);
            log.debug("route.responseHeaders = " + JSON.stringify(route.responseHeaders));
            sekiResponse.writeHead(route.responseCode, route.responseHeaders); // 201 Created
            sekiResponse.end();
        };

        var client = new StoreClient();
        client.send(route.queryOptions, sparql, finalCallback);
    },
    
    "update": function(sekiRequest, sekiResponse, message, route) {
        log.debug("TemplatingResponseHandler.update");
        
        var turtleSplit = SparqlUtils.extractPrefixes(message);
        var turtle = message;
        
        this.replaceMap["prefixes"] = turtleSplit.prefixes;
        this.replaceMap["body"] = turtleSplit.body;
        
        var sparql = freemarker.render(sparqlTemplates[route.queryTemplate], this.replaceMap);
              //  log.debug("SPARQL = " + sparql);

        var finalCallback = function() {
            sekiResponse.writeHead(route.responseCode, route.responseHeaders); // 201 Created
            sekiResponse.end();
        };
        
        var client = new StoreClient();
        client.send(route.queryOptions, sparql, finalCallback);
    },

    "read": function(sekiRequest, sekiResponse, message, route) {
        log.debug("TemplatingResponseHandler.read");

        var sparql = freemarker.render(sparqlTemplates[route.queryTemplate], this.replaceMap);
      //    log.debug("SPARQL = "+sparql);

        var options = JSON.parse(JSON.stringify(route.queryOptions)); // clone

        options["path"] = config.client["queryEndpoint"] + "?query=" + escape(sparql);
        options["method"] = "GET";

        var clientRequest = http.request(options, function(queryResponse) {

            queryResponse.setEncoding('utf8');

            if (route.queryOptions["headers"]["accept"] == "text/turtle") { 
                respondTurtle(sekiResponse, queryResponse, route);
            } else {
                respond(sekiResponse, queryResponse, route, this.replaceMap);
            }
        });
        // no message to send so call right away
        clientRequest.end();
    },

    "handle": function(sekiRequest, sekiResponse, message, route) {
        
        log.debug("TemplatingResponseHandler.handle");

        this.replaceMap = {
            "graph": route.graph, // SLASH HERE  + "/" config.uriBase + 
            "uri": config.uriBase + route.path //  
        };
        
        log.debug("replaceMap = " + JSON.stringify(this.replaceMap, null, 4));
        
        log.debug("route[type] = "+ route["type"]);
        
        if (route["type"] && route["type"] != "") { // temp
            this[route["type"]](sekiRequest, sekiResponse, message, route);
            return;
        }

        log.debug("AFTER");
    }
}

function respondTurtle(sekiResponse, queryResponse, route) {
    // log.debug("RESPOND TURTLE");

    var data = "";

    queryResponse.on('data', function(chunk) {
       // log.debug("CHUNK: " + chunk);
        data += chunk;
    });

    queryResponse.on('end', function() {
//        log.debug(" queryResponse.on('end'");

        //    log.debug("\nbindings " + JSON.stringify(bindings));

        sekiResponse.writeHead(200, route.responseHeaders);

        // bindings["uri"] = replaceMap.uri; 
        // bindings["graph"] = replaceMap.graph;
        //     var data = freemarker.render(viewTemplate, bindings);
 //       log.debug("sekiResponse.end(data) DATA = "+data);
        //       log.debug("viewTemplate = "+viewTemplate);
        //       log.debug("bindings = "+JSON.stringify(bindings));
        sekiResponse.end(data);
    });
}

function respond(sekiResponse, queryResponse, route, replaceMap) {
    // log.debug("RESPOND");

    var stream = saxer.createStream();

    sekiResponse.pipe(stream);

    queryResponse.on('data', function(chunk) {
      //  log.debug("CHUNK: " + chunk);
        stream.write(chunk);
    });

    queryResponse.on('end', function() {
      //  log.debug(" queryResponse.on('end'");
        stream.end();

        var bindings = stream.bindings;

       log.debug("\nbindings " + JSON.stringify(bindings));

        sekiResponse.writeHead(200, route.responseHeaders);

        // bindings["uri"] = replaceMap.uri; 
        // bindings["graph"] = replaceMap.graph;
        log.debug("viewTemplate = "+route["viewTemplate"]);
        var mediaType = route.queryOptions["headers"]["accept"];
        log.debug("mediaType = "+mediaType);   
        var data = freemarker.render(htmlTemplates[route.viewTemplate], bindings);
    //   log.debug("DATA = "+data);
        //       log.debug("viewTemplate = "+viewTemplate);
        //       log.debug("bindings = "+JSON.stringify(bindings));
        sekiResponse.end(data);
    });
}

module.exports = TemplatingResponseHandler;
