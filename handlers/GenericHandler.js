var http = require('http');
var qs = require('querystring'); // POST parameters parser
var sparqlTemplates = require('../templates/SparqlTemplates');
var StoreClient = require("../StoreClient");
// var templater = require('./templates/Templater');
var freemarker = require('../templates/freemarker');
var Constants = require('../config/Constants');
var config = require('../config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);

var postHeaders = {
    "Accept" : "application/sparql-results+xml",
    "Host" : config.sekiHost + ":" + config.sekiPort,
    'Content-Type' : 'application/x-www-form-urlencoded'
};

// Constructor
function GenericHandler() {
}

// properties and methods
GenericHandler.prototype = {
    
    "handle" : function(sekiRequest, sekiResponse, responseHandler) {
        
        log.debug("GenericHandler.handle");

        var message = '';
        
        sekiRequest.on('data', function(chunk) {
            message += chunk;
        });
        sekiRequest.on('end', responseHandler(message, sekiResponse));                  
    }

}


module.exports = GenericHandler;