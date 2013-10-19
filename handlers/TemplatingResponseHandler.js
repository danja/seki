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

function TemplatingResponseHandler() {
}

TemplatingResponseHandler.prototype = { 
    /*
     *         this.route = { 
     * path : '',
     * targetFunction : '',
     * responseHandler : '',
     * preprocessor : '',
     * queryTemplate : '',
     * viewTemplate : '',
     * responseHeaders : ''
}  */
    
    "handle" : function(sekiResponse, message, route) {
        
        log.debug("TemplatingResponseHandler.handle");
        log.debug("\n\n\nROUTE = \n\n\n"+JSON.stringify(route));
               
    }
    
}

module.exports = TemplatingResponseHandler;