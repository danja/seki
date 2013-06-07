/*
 * Templates used to build SPARQL
 * parts like ${this} will be replaced
 */
var sparqlTemplates = {
	// used to retrieve an item from the store for display
	// http://purl.org/dc/terms/

    generalInsertTemplate : "${prefixes} \
    INSERT DATA { GRAPH <${graph}>{ ${body} }}",
    
    generalDeleteTemplate : "${prefixes} \
    DELETE DATA { GRAPH <${graph}>{ ${body} }}",

    resourceDeleteTemplate : "${prefixes} \
    WITH <${graph}> DELETE { <${uri}> ?p ?o } WHERE {  <${uri}> ?p ?o }",
    

    simpleReplaceTemplate : "${prefixes} \
       WITH <${graph}> \
       DELETE { <${uri}> ?p ?o } \
       INSERT { ${body} } \
       WHERE  { <${uri}> ?p ?o } ",
    
	itemTemplate : "PREFIX dcterms: <http://purl.org/dc/terms/> \
      PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
      PREFIX sioc: <http://rdfs.org/sioc/ns#> \
      PREFIX um: <http://purl.org/stuff/usermanagement#> \
      \
      SELECT DISTINCT ?title ?content ?date ?fullname WHERE { \
      \
      <${uri}> a sioc:Post ; \
         dcterms:title ?title; \
         sioc:content ?content ; \
         um:fullname ?fullname ; \
         dcterms:date ?date . \
      }",

	// used to insert a new item into the store
	insertTemplate : "PREFIX dcterms: <http://purl.org/dc/terms/> \
        PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
        PREFIX sioc: <http://rdfs.org/sioc/ns#> \
        PREFIX x: <http://purl.org/stuff/> \
        \
        INSERT DATA { \
        GRAPH <${graph}>{\
        \
        <${uri}> a ${type} ;\
           dcterms:title \"${title}\";\
           sioc:content \"${content}\" ;\
           foaf:maker [ foaf:nick \"${nick}\" ] ;\
           dcterms:date \"${date}\" .\
        }}",
        
	insertAnnotationTemplate : "PREFIX dcterms: <http://purl.org/dc/terms/> \
            PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
            PREFIX sioc: <http://rdfs.org/sioc/ns#> \
            PREFIX x: <http://purl.org/stuff/> \
            \
            INSERT DATA { \
            GRAPH <${graph}>{\
            \
            <${uri}> a ${type} ;\
               x:target <${target}> ;\
               dcterms:title \"${title}\";\
               sioc:content \"${content}\" ;\
               foaf:maker [ foaf:nick \"${nick}\" ] ;\
               dcterms:date \"${date}\" .\
            }}",

	listGraphURIs : "SELECT DISTINCT ?graph WHERE { GRAPH ?graph {} }"
}; // sioc:Post

// make it visible to other scripts
module.exports = sparqlTemplates;