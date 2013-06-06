
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
        
        clientRequest.write(sparql);
        clientRequest.end();
    },
    
//     var options = {
//         "path": config.sparqlUpdateEndpoint,
//         "method": "POST"
//     };
//     if(!callback) {
//         callback = function(res) {
//             //   log.debug('STATUS: ' + res.statusCode);
//             //  log.debug('HEADERS: ' + JSON.stringify(res.headers));
//             res.setEncoding('utf8');
//             res.on('data', function(chunk) {
//                 log.debug('BODY: ' + chunk);
//             });
//             //     log.info("done.\n");
//         }
//     }

    
    "sendTurtle" : function(graphURI, turtle, callback) {
        
        log.debug("StoreClient.sendTurtle");
        log.debug("TURTLE********************"+turtle);
        log.debug("INSPECT "+util.inspect(turtle));
        var sparqlUtils = new SparqlUtils();
        var sparql = sparqlUtils.turtleToInsert(graphURI, turtle, callback); 
        log.debug("SPARQL = "+sparql);
        this.send(config.updateOptions, sparql, callback);
    }
}


module.exports = StoreClient;