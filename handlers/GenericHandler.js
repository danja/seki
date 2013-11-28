var http = require('http');
var qs = require('querystring'); // POST parameters parser
var sparqlTemplates = require('../templates/SparqlTemplates');
var StoreClient = require("../StoreClient");
// var templater = require('./templates/Templater');
var freemarker = require('../templates/freemarker');
var Constants = require('../config/Constants');
var config = require('../config/ConfigDefault').config;
var Nog = require('../lib/nog/nog'),
log = new Nog(config.logLevel);

var postHeaders = {
    "Accept": "application/sparql-results+xml",
    "Host": config.sekiHost + ":" + config.sekiPort,
    'Content-Type': 'application/x-www-form-urlencoded'
};

// MERGE THIS INTO RequestHandler

function GenericHandler() {}

// properties and methods
GenericHandler.prototype = {

    "handle": function(sekiRequest, sekiResponse, ResponseHandler, route) {

        // log.debug("GenericHandler.handle");

        var message = '';

        sekiRequest.on('data', function(chunk) {
            message += chunk;
        });
        sekiRequest.on('end', function() {
            //     log.debug("GenericHandler.handle ON END");
            var handler = new ResponseHandler(); // (sekiRequest, sekiResponse, message, route)
            handler.handle(sekiRequest, sekiResponse, message, route);
        });
    }

}


module.exports = GenericHandler;
