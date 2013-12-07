source files for addressing Seki via HTTP programmatically (i.e. API)
used as helpers in tests

=== GenericClient.js ===

 * low-level access to remote HTTP server (typically the SPARQL store)
 
=== ProxySparql.js ===

 * at /store
 * entries are each a named graph
 * 
 * Proxies SPARQL requests/response to/from remote endpoint

=== Page.js ===

 * under /pages/
 * entries are each a sioc:Post
 * 
 * a Page is a little tree:
 *       <resource> ?p ? o
 * 
 * Create is HTTP POST to /pages
 * Update is HTTP PUT to /pages/{name}
 *
 * Create, Read, Update for different media types
 *
 * (Delete handled by HTTP DELETE method)
 
 === NamedGraph.js ===
 
 * under /graphs/
 * entries are each a named graph
 * 
 * 
 * Create is HTTP POST to /graphs
 * Update is HTTP PUT to /graphs/{name}
 *
 * Create, Read, Update for different media types
 *
 * (Delete handled by HTTP DELETE method)
 
 
