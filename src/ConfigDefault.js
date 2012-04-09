var config;

var defaultConfig =
{ 
		
	wwwDir: "../www" // static files
,	baked: "../baked"	
    /*
     * Settings for the Seki Server (this)
     */
,  sekiHost: "localhost"
, sekiPort: 8888
, uriBase: "http://hyperdata.org" // used in the RDF
  
  /*
   * Settings for the remote SPARQL/HTTP server (typically Fuseki on localhost)
   */
, sparqlHost: "localhost"
, sparqlPort: 3030
, sparqlGraphEndpoint: "/seki/data"
, sparqlQueryEndpoint: "/seki/query"
, sparqlUpdateEndpoint: "/seki/update"
};

try { 
	config = require('./Config').config;
	console.log("Using Config.js");
} // fall back on config-default.js
catch (e) {
	config = defaultConfig;
	console.log("Using ConfigDefault.js");
}

exports.config = config;

