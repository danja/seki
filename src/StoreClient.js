
// consider using 'request' module
var fs = require('fs'); 
var http = require('http');
var util = require('util');
var config = require('./config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);
var Constants = require('./config/Constants');
var config = require('./config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);
// var sparqlTemplates = require('./templates/SparqlTemplates');
// var freemarker = require('./templates/freemarker');
var SparqlUtils = require("./SparqlUtils");

    // Constructor
function StoreClient() {
    }
    
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
        
    "send" : function(options, sparql, callback) {
        
        log.debug("StoreClient.send");

        for (var name in config.clientOptions) { // merge constants
            if(!options[name]) {
                options[name] = config.clientOptions[name]; 
            }
        }
        
        var clientRequest = http.request(options, function(queryResponse) {
            //                                console.log('STATUS: ' + res.statusCode);
            //                                console.log('HEADERS: ' + JSON.stringify(res.headers));
            queryResponse.setEncoding('utf8');
            
            if(callback) callback(queryResponse);
        });
        log.debug("SENDING "+sparql);
        clientRequest.write(sparql);
        clientRequest.end();
    },
    
    "sendTurtle" : function(graphURI, turtle, callback) {      
        log.debug("StoreClient.sendTurtle");
        var sparqlUtils = new SparqlUtils();
        var sparql = sparqlUtils.turtleToInsert(graphURI, turtle, callback); 
     //   log.debug("SPARQL = "+sparql);
        this.send(config.updateOptions, sparql, callback);
    },
    
    "replaceTurtle" : function(graphURI, resourceURI, turtle, callback) {      
        log.debug("StoreClient.replaceTurtle");
        log.debug("TURTLE = "+turtle);
        var sparqlUtils = new SparqlUtils();
        var sparql = sparqlUtils.turtleToReplace(graphURI, resourceURI, turtle, callback); 
        //   log.debug("SPARQL = "+sparql);
        this.send(config.updateOptions, sparql, callback);
    },
    
    "replaceResource" : function(graphURI, resourceURI, turtle, callback) {      
        log.debug("StoreClient.replaceTurtle");
        log.debug("TURTLE = "+turtle);
        var sparqlUtils = new SparqlUtils();
        var sparql = sparqlUtils.resourceToDelete(graphURI, resourceURI, turtle); 
        //   log.debug("SPARQL = "+sparql);
        function insert(client, graphURI, turtle, callback){ // ensures the DELETE/INSERT happens in the right order
            sparql = sparqlUtils.turtleToSimpleInsert(graphURI, turtle); 
            client.send(config.updateOptions, sparql, callback);
        };
        this.send(config.updateOptions, sparql, insert(this, graphURI, turtle, callback));

    }
}


module.exports = StoreClient;