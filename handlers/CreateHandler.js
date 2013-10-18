var config = require('../config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);
var StoreClient = require("../StoreClient");
var url = require("url");
var util = require("util");
var LegacyJSONUtils = require("./LegacyJSONUtils");
var Utils = require("./Utils");
var jsonld = require('../lib/jsonld/jsonld');
require('../lib/jsonld/Future');

//Constructor
function CreateHandler() {
}

// properties and methods
CreateHandler.prototype = {
    "handle": function(message, sekiResponse) { // takes JSON
        // this.value2 = argument + 100;
        console.log("CreateHandler.handle called");
        
        var bodyMap = JSON.parse(message);
        
    //    if(config.handleLegacyJSON) { // removes extra <<< - check need
            bodyMap = LegacyJSONUtils.tweak(bodyMap);
    //    };
            
            log.debug("BODYMAP = "+bodyMap);
        
        var isoDate = (new Date()).toISOString(); 
        
        bodyMap["http://purl.org/dc/terms/date"] = isoDate;
        
        if(!bodyMap["@id"] || bodyMap["@id"] == '') {
            bodyMap["@id"] = config.uriBase+"/pages/"+Utils.makePath(bodyMap["title"], isoDate);
        };
        
        var resourceURI = bodyMap["@id"];
        
        var targetUrl = resourceURI.substring(config.uriBase.length);
        
        log.debug("targetUrl ======"+targetUrl);
        
        var graphURI = config.uriBase+"/pages";
        
        // *          [base] the base IRI to use.
        // *          [format] the format if output is a string:
        // *            'application/nquads' for N-Quads.
        // *          [loadContext(url, callback(err, url, result))] the context loader.
        var options = { "format" : 'application/nquads' };
        
        var processor = new jsonld.JsonLdProcessor();
        processor.normalize(bodyMap, options, jsonLdProcessorCallback);
        
        function jsonLdProcessorCallback(err, turtle) {
            log.debug("error in jsonLdProcessorCallback = "+err);
            
            var client = new StoreClient();
            
            var finalCallback = function(){
                var headers = {
                    "Location" : targetUrl,
                    "Content-type" : "text/html; charset=utf-8"
                };
                sekiResponse.writeHead(201, headers); // 201 Created
                sekiResponse.end();
            }
            client.replaceResource(graphURI, resourceURI, turtle, finalCallback);   
            
        }
        return;
    }
}

// ResponseHandler.handle(message, sekiResponse);

module.exports = CreateHandler;