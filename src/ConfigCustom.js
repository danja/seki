/* rename this to Config.js for custom settings */
/* you also probably want to add a .gitignore file in same dir containing just */
/* Config.js */
var config = {

	wwwDir : "../www" // static files
	,
	baked : "../baked"
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
	sparqlHost : "localhost",
	sparqlPort : 3030,
	sparqlGraphEndpoint : "/seki/data",
	sparqlQueryEndpoint : "/seki/query",
	sparqlUpdateEndpoint : "/seki/update"
};

exports.config = config;
