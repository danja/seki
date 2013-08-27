// consider using 'request' module

// request options need refactoring
var fs = require('fs');
var http = require('http');
var util = require('util');

var config = require('./config/ConfigDefault').config;
var Log = require('log'),
    log = new Log(config.logLevel);
var Constants = require('./config/Constants');
var config = require('./config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);
// var sparqlTemplates = require('./templates/SparqlTemplates');
// var freemarker = require('./templates/freemarker');
var SparqlUtils = require("./SparqlUtils");
var async = require('async');

// Constructor

function StoreClient() {}

// properties and methods
StoreClient.prototype = {
    /*
     * pushes Turtle data into named graph
     * pull this out into a general utility!
     */
    "loadFile": function(graphURI, file, callback) {
        log.info("\nLoading Turtle file " + file);
        var turtle = fs.readFileSync(file, 'utf8');
        this.sendTurtle(graphURI, turtle);
    },

    // rename to "query"?
    "send": function(options, sparql, callback) {
        log.debug("initial send OPTIONS = "+JSON.stringify(options));
        log.debug("StoreClient.send");
        log.debug("callback = "+callback);
        for (var name in config.client) { // merge constants
            if (!options[name]) {
                options[name] = config.client[name];
            }
        }

        log.debug("\n\nIN StoreClient request OPTIONS = "+JSON.stringify(options));
        
        var clientRequest = http.request(options);
        clientRequest.on('err', function() {
            log.debug("ERROR!" + err);
        });
        
        clientRequest.on('response', function(queryResponse) {
            queryResponse.setEncoding('utf8');
        log.debug("IN SEND CALLING RESPOND");
        if (callback) {
            log.debug("IN SEND CALLING " + callback);
            callback(queryResponse);
        };
        });
//         function respond(queryResponse){
// 
//                 //                                console.log('STATUS: ' + res.statusCode);
//                 //                                console.log('HEADERS: ' + JSON.stringify(res.headers));
//                 queryResponse.setEncoding('utf8');
//                 log.debug("IN SEND CALLING RESPOND");
//                 if (callback) {
//                     log.debug("IN SEND CALLING " + callback);
//                      callback(queryResponse);
//                 };
//             
//         }
//         clientRequest.on('response', function(queryResponse) {
//             log.debug("RESPONSE");
//             response(queryResponse);
//         });
//         function response(queryResponse){
//             callback(queryResponse);
//         }
        clientRequest.write(sparql);
        clientRequest.end();
    },
    
    /* this was used to chain two commands, before Barry Norton pointed out that it could be done
     * directly in the SPARQL simply by putting a ";" between operations. Left here for reference 
     * in case I need to do the async thing again somewhere else.
     */
    "send2": function(options, sparql1, clientCallback1, sparql2, clientCallback2) {

        log.debug("StoreClient.send2");

        for (var name in config.client) { // merge constants
            if (!options[name]) {
                options[name] = config.client[name];
            }
        }

        async.series([
                function(callback) {
                    var clientRequest1 = http.request(options, function(queryResponse) {
                        queryResponse.setEncoding('utf8');
                        if (clientCallback1) {
                            log.debug("IN SEND1 CALLING " + clientCallback1);
                            clientCallback1(queryResponse);
                        };
                        callback(null, 'DELETE');
                    });
                    clientRequest1.on('err', function() {
                        log.debug("ERROR!" + err);
                    });
                    log.debug("SENDING " + sparql1.substring(0, 40));
                    clientRequest1.write(sparql1);
                    clientRequest1.end();
                  
                },
                function(callback) {
                    var clientRequest2 = http.request(options, function(queryResponse) {

                        queryResponse.setEncoding('utf8');
                        if (clientCallback2) {
                            log.debug("IN SEND2 CALLING " + clientCallback2);
                            clientCallback2(queryResponse);
                        };
                        callback(null, 'INSERT');
                    });
                    clientRequest2.on('err', function() {
                        log.debug("ERROR!" + err);
                    });
                    log.debug("SENDING " + sparql2.substring(0, 40));
                    clientRequest2.write(sparql2);
                    clientRequest2.end();
                  
                }
            ],
            // optional callback

            function(err, results) {
                log.debug("send2 SERIES results = " + results);
                log.debug("send2 SERIES err = " + err);
            });



    },

    "sendTurtle": function(graphURI, turtle, callback) {
        log.debug("StoreClient.sendTurtle");
        var sparqlUtils = new SparqlUtils();
        var sparql = sparqlUtils.turtleToInsert(graphURI, turtle, callback);
        log.debug("SPARQL = "+sparql);
        var options = config.client;
        options["method"] = config.client["updateMethod"];
        options["path"] = config.client["updateEndpoint"];
        this.send(options, sparql, callback);
    },

    "replaceTurtle": function(graphURI, resourceURI, turtle, callback) {
        log.debug("StoreClient.replaceTurtle");
        log.debug("TURTLE = " + turtle);
        var sparqlUtils = new SparqlUtils();
        var sparql = sparqlUtils.turtleToReplace(graphURI, resourceURI, turtle, callback);
        var options = config.client;
        options["method"] = config.client["updateMethod"];
        options["path"] = config.client["updateEndpoint"];
        //   log.debug("SPARQL = "+sparql);
        this.send(options, sparql, callback);
    },
    
    "replaceResource": function(graphURI, resourceURI, turtle, finalCallback) {
        log.debug("\n\n*** StoreClient.replaceResource");
        var sparqlUtils = new SparqlUtils();
        var replaceSparql = sparqlUtils.resourceToReplace(graphURI, resourceURI, turtle);
        var options = config.client;
        options["method"] = config.client["updateMethod"];
        options["path"] = config.client["updateEndpoint"];
        log.debug("**** options = "+JSON.stringify(options));
        log.debug("options[path] = "+options["path"]);
        log.debug("replaceSparql = "+replaceSparql);
        log.debug("finalCallback = "+JSON.stringify(finalCallback));
        this.send(options, replaceSparql, finalCallback);
    },

    "replaceResource2": function(graphURI, resourceURI, turtle, finalCallback) {
        log.debug("StoreClient.replaceResource2");
        //    log.debug("TURTLE = "+turtle);
        var sparqlUtils = new SparqlUtils();

        // ensures the DELETE/INSERT happens in the right order

        var deleteCallback = function() {
            log.debug("DONE DELETE");
        };
        var insertCallback = function(queryResponse) {
            log.debug("DONE INSERT");
        };
        var deleteSparql = sparqlUtils.resourceToDelete(graphURI, resourceURI, deleteCallback);
        var insertSparql = sparqlUtils.turtleToSimpleInsert(graphURI, turtle);
        var options = config.client;
        options["method"] = config.client["updateMethod"];
        options["path"] = config.client["updateEndpoint"];
        this.send2(options, deleteSparql, deleteCallback, insertSparql, finalCallback);

    }
}

var client = new StoreClient();

function send(options, sparql, nextCall) {
    client.send(options, sparql, nextCall);
}

module.exports = StoreClient;
