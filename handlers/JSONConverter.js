var jsonld = require('../lib/jsonld/jsonld');
require('../lib/jsonld/Future');

var config = require('../config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);
var LegacyJSONUtils = require("./LegacyJSONUtils");

function JSONConverter() {
}

JSONConverter.jsonToParams = function(bodyMap) {
    if(config.handleLegacyJSON) {
        bodyMap = LegacyJSONUtils.tweak(bodyMap);
    };
    
    var isoDate = (new Date()).toISOString(); 
    
    bodyMap["http://purl.org/dc/terms/date"] = isoDate;
    
    if(!bodyMap["@id"] || bodyMap["@id"] == '') {
        bodyMap["@id"] = config.uriBase+"/pages/"+Utils.makePath(bodyMap["title"], isoDate);
};

var resourceURI = bodyMap["@id"];

var targetUrl = resourceURI.substring(config.uriBase.length);

log.debug("targetUrl ======"+targetUrl);

//     var pathname = url.parse(resourceURI).pathname;          
//     var section = pathname.split("/");
var graphURI = config.uriBase+"/pages";

// *          [base] the base IRI to use.
// *          [format] the format if output is a string:
// *            'application/nquads' for N-Quads.
// *          [loadContext(url, callback(err, url, result))] the context loader.
var options = { "format" : 'application/nquads' };

var processor = new jsonld.JsonLdProcessor();
processor.normalize(bodyMap, options, jsonLdProcessorCallback);
return {graphURI, resourceURI, turtle};
}

module.exports = JSONConverters;