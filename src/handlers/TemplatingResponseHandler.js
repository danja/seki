var http = require('http');
var qs = require('querystring'); // POST parameters parser
var sparqlTemplates = require('../templates/SparqlTemplates');
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
        log.debug("TemplatingResponseHandler.create");
        log.debug("RES = " + this.resource);

        var turtleSplit = SparqlUtils.extractPrefixes(message);
        var turtle = message;

        this.replaceMap["prefixes"] = turtleSplit.prefixes;
        this.replaceMap["body"] = turtleSplit.body;

        var sparql = freemarker.render(sparqlTemplates[route.queryTemplate], this.replaceMap);

        log.debug("SPARQL = " + sparql);

        log.debug("route.queryOptions = " + JSON.stringify(route.queryOptions));

        /*
        var headers = {
            "Location" : route.path,
            "Content-type" : "text/html; charset=utf-8"
        };
        */

        var finalCallback = function() {
            log.debug("route.responseCode = " + route.responseCode);
            log.debug("route.responseHeaders = " + JSON.stringify(route.responseHeaders));
            sekiResponse.writeHead(route.responseCode, route.responseHeaders); // 201 Created
            sekiResponse.end();
        };

        var client = new StoreClient();
        log.debug("SENDING TO STORE");
        log.debug("SPARQL = " + sparql);
        log.debug("route.queryOptions = " + JSON.stringify(route.queryOptions, null, 4));
        client.send(route.queryOptions, sparql, finalCallback);
    },
    
    "update": function(sekiRequest, sekiResponse, message, route) {
        log.debug("TemplatingResponseHandler.update");
        log.debug("RES = " + this.resource);
        
        var turtleSplit = SparqlUtils.extractPrefixes(message);
        var turtle = message;
        
        this.replaceMap["prefixes"] = turtleSplit.prefixes;
        this.replaceMap["body"] = turtleSplit.body;
        
        var sparql = freemarker.render(sparqlTemplates[route.queryTemplate], this.replaceMap);
        
        log.debug("SPARQL = " + sparql);
        
        log.debug("route.queryOptions = " + JSON.stringify(route.queryOptions));
        
        /*
         *  var headers = {
         *      "Location" : route.path,
         *      "Content-type" : "text/html; charset=utf-8"
    };
    */
        
        var finalCallback = function() {
            log.debug("route.responseCode = " + route.responseCode);
            log.debug("route.responseHeaders = " + JSON.stringify(route.responseHeaders));
            sekiResponse.writeHead(route.responseCode, route.responseHeaders); // 201 Created
            sekiResponse.end();
        };
        
        var client = new StoreClient();
        log.debug("SENDING TO STORE");
        log.debug("SPARQL = " + sparql);
        log.debug("route.queryOptions = " + JSON.stringify(route.queryOptions, null, 4));
        client.send(route.queryOptions, sparql, finalCallback);
    },

    // {"type":"read","path":"/pages/ApiTest","graph":"pages","targetFunction":"GenericHandler",
    //"responseHandler":"TemplatingResponseHandler","preprocessor":"","queryTemplate":"turtleReadTemplate",
    //"queryOptions":{"host":"localhost","port":3030,"path":"/seki/query","method":"GET"},
    //"viewTemplate":"minimalViewTemplate","responseHeaders":{"Content-type":"text/turtle"},"responseCode":"200"}

    "read": function(sekiRequest, sekiResponse, message, route) {
        log.debug("TemplatingResponseHandler.read");

        //  turtleReadTemplate : "CONSTRUCT { ?s ?p ?o } WHERE { GRAPH <${graph}>{ <${uri}> ?p ?o  }}",
        // this.replaceMap["body"] = turtleSplit.body;

        log.debug("Query Template = " + route.queryTemplate);

        var sparql = freemarker.render(sparqlTemplates[route.queryTemplate], this.replaceMap);

        //   log.debug("SPARQL = "+sparql);
        // build the URL from the query
        // make the request to the SPARQL server

        var options = JSON.parse(JSON.stringify(route.queryOptions)); // clone

        options["path"] = config.client["queryEndpoint"] + "?query=" + escape(sparql);
        options["method"] = "GET";

        //    options["headers"] = 
        //sekiRequest.headers;

        // NEED TO ADD QUERYHEADERS TO ROUTE ?????

        log.debug("\n\nROUTE = " + JSON.stringify(route));
        log.debug("\n\noptions = " + JSON.stringify(options));
        log.debug("\n\nconfig.client = " + JSON.stringify(config.client));
        log.debug("\n\nsekiRequest.headers = " + JSON.stringify(sekiRequest.headers) + "\n\n");

        /*
         * var options = {
         * hostname: 'www.google.com',
         * port: 80,
         * path: '/upload',
         * method: 'POST'
    };*/

        var clientRequest = http.request(options, function(queryResponse) {

            queryResponse.setEncoding('utf8');
            log.debug("route.responseHeaders = " + JSON.stringify(route.responseHeaders));
            if (route.queryOptions["headers"]["accept"] == "text/turtle") { ////// SHOULD BE ON QUERYOPTIONS
                log.debug("\n\n\nCALLING RESPONDTurtle");
                respondTurtle(sekiResponse, queryResponse, route);
            } else {
                log.debug("\n\n\nCALLING RESPOND");
                respond(sekiResponse, queryResponse, route, this.replaceMap);
            }
        });
        // no message to send so call right away
        clientRequest.end();
    },

    "handle": function(sekiRequest, sekiResponse, message, route) {

        log.debug("sekiRequest = " + sekiRequest);
        log.debug("TemplatingResponseHandler.handle");
        log.debug("\n\n\nROUTE = \n" + JSON.stringify(route) + "\n\n\n");

        /*
        var resource = config.uriBase + route.path;; // del me
        this.resource = config.uriBase + route.path;
        var graphURI = config.uriBase + "/" + route.graph; // del me
        this.graph = = config.uriBase + "/" + route.graph;
        */
        
        

        this.replaceMap = {
            "graph": route.graph, // SLASH HERE  + "/" config.uriBase + 
            "uri": config.uriBase + route.path //  
        };

        if (route["type"] && route["type"] != "") { // temp
            this[route["type"]](sekiRequest, sekiResponse, message, route);
            return;
        }


        log.debug("route.queryTemplate = " + route.queryTemplate);
    }
}

function respondTurtle(sekiResponse, queryResponse, route) {
    log.debug("RESPOND TURTLE");

    var data = "";

    queryResponse.on('data', function(chunk) {
        log.debug("CHUNK: " + chunk);
        data += chunk;
    });

    queryResponse.on('end', function() {
        log.debug(" queryResponse.on('end'");

        //    log.debug("\nbindings " + JSON.stringify(bindings));

        sekiResponse.writeHead(200, route.responseHeaders);

        // bindings["uri"] = replaceMap.uri; 
        // bindings["graph"] = replaceMap.graph;
        //     var data = freemarker.render(viewTemplate, bindings);
        log.debug("sekiResponse.end(data)");
        //       log.debug("viewTemplate = "+viewTemplate);
        //       log.debug("bindings = "+JSON.stringify(bindings));
        sekiResponse.end(data);
    });
}

function respond(sekiResponse, queryResponse, route, replaceMap) {
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

        sekiResponse.writeHead(200, route.responseHeaders);

        // bindings["uri"] = replaceMap.uri; 
        // bindings["graph"] = replaceMap.graph;
        var data = freemarker.render(viewTemplate, bindings);
        log.debug("sekiResponse.end(html)");
        //       log.debug("viewTemplate = "+viewTemplate);
        //       log.debug("bindings = "+JSON.stringify(bindings));
        sekiResponse.end(data);
    });
}

module.exports = TemplatingResponseHandler;
