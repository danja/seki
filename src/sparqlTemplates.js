/*
 * Templates used to build SPARQL
 * parts like %this% will be replaced
 */
var sparqlTemplates = {
    // used to retrieve an item from the store for display
		// http://purl.org/dc/terms/
		
  itemTemplate : "PREFIX dcterms: <http://purl.org/dc/terms/> \
      PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
      PREFIX sioc: <http://rdfs.org/sioc/ns#> \
      \
      SELECT ?title ?content ?date ?nick WHERE { \
      \
      <%uri%> a sioc:Post ; \
         dcterms:title ?title; \
         sioc:content ?content ; \
         foaf:maker ?maker ; \
         dcterms:date ?date . \
      \
      ?maker foaf:nick ?nick . \
      }",

      // used to insert a new item into the store 
  insertTemplate : "PREFIX dcterms: <http://purl.org/dc/terms/> \
        PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
        PREFIX sioc: <http://rdfs.org/sioc/ns#> \
        \
        INSERT DATA { \
        GRAPH <%uri%>{\
        \
        <%uri%> a sioc:Post ;\
           dcterms:title \"%title%\";\
           sioc:content \"%content%\" ;\
           foaf:maker [ foaf:nick \"%nick%\" ] ;\
           dcterms:date \"%date%\" .\
        }}",
        
        listGraphURIs : "SELECT  ?graph WHERE { GRAPH ?graph {} }"
};

//make it visible to other scripts
module.exports = sparqlTemplates;