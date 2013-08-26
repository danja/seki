var config;
var defaultConfig = {
    logLevel : "debug",
    graphLabels : ["meta", "users", "content", "vocabs", "foaf"]
    ,
	wwwDir : "../www" // static files
	,
    vocabsDir : "../www/vocabs"
    ,
    samplesDir : "../data/samples"
    ,
	baked : "../baked"
		,
		staticHost : "localhost",
		staticPort : 8889
		
	/*
	 * Settings for the Seki Server (this)
	 */
	,
	sekiHost : "localhost",
	sekiPort : 8888,
	uriBase : "http://hyperdata.org", // used in the RDF
	
	/*
	 * Settings for the remote SPARQL/HTTP server (typically Fuseki on
	 * localhost)
	 */
	
	// refactor
	sparqlHost : "localhost",
	sparqlPort : 3030,
	clientOptions : {
			  hostname: "localhost",
			  port: 3030,
			//  'Content-type': "text/turtle"
			  // accept?
			},
       
			
	sparqlGraphEndpoint : "/seki/data",
	sparqlQueryEndpoint : "/seki/query",
	sparqlUpdateEndpoint : "/seki/update",
    queryOptions : {
        "path" : "/seki/query",
        "method" : "GET"
    },
    updateOptions : {
        "path" : "/seki/update",
        "method" : "POST"
    },
		// features
		sourceHook : true,
		sourceHookPath : "/seki/x/",
		sourceHookScript : "hook"
};


try {
	config = require('./Config').config;

    for (prop in defaultConfig) { // copy defaults not defined in Config.js
        if (prop in config) { continue; }
        config[prop] = defaultConfig[prop];
    }
    
	console.log("Using Config.js");
} // fall back on config-default.js
catch (e) {
	config = defaultConfig;
	console.log("No Config.js so using ConfigDefault.js");
}



exports.config = config;
