var config = require('./ConfigDefault').config;

var headers = {
		graph : {
				// "Accept" : "application/rdf+xml",
				"Accept" : "text/turtle",
				"Host" : config.sekiHost + ":" + config.sekiPort
			}
		
};

module.exports = headers;