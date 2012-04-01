exports.config =
{ 
		
	wwwDir: "../www" // static files
		
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