var config = require('../config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);

// var sparqlTemplates = require('../templates/SparqlTemplates');
// var htmlTemplates = require('../templates/HtmlTemplates');
// var jsonTemplates = require('../templates/JsonTemplates');
//var specialTemplates = require('../templates/SpecialTemplates');
var util = require('util');

var VieJsonHandler = require('../handlers/VieJsonHandler');
// var vieJsonHandler = new VieJsonHandler();
// log.debug("vieJsonHandler = "+util.inspect(vieJsonHandler));

    
var special = {
// 		"/graphs" : {
// 				sparqlTemplate : sparqlTemplates.listGraphURIs,
// 				htmlTemplate : htmlTemplates.uriList
// 			},
			
		"/vie-json/" : {
//             sparqlTemplate : sparqlTemplates.vocabTemplate;
//             template : jsonTemplates.vieJsonTemplate
            "handler" : new VieJsonHandler()
        }
		
};

module.exports = special;