/*
 * Templates used to build SPARQL
 * parts like ${this} will be replaced
 * 
 * RENAME TO QueryTemplates
 * 
 * TODO remove ...Template from names
 */
var sparqlTemplates = {
    // used to retrieve an item from the store for display
    // http://purl.org/dc/terms/

// Graph-oriented
    
    turtleCreateTemplate: "${prefixes} \
            INSERT DATA { GRAPH <${graph}>{ ${body} }}",
            
    readGraphTemplate: "CONSTRUCT { ?s ?p ?o } WHERE { GRAPH <${graph}>{ ?s ?p ?o }}",
            
    updateGraphTemplate: "${prefixes} \
            WITH <${graph}> DELETE { ?s ?p ?o } WHERE {  ?s ?p ?o }\
            ; \
            INSERT DATA { GRAPH <${graph}>{ ${body} }}",
            
            dropGraphTemplate: "DROP GRAPH <${graph}>",
// Resource-oriented

    turtleReadTemplate: "CONSTRUCT { <${uri}> ?p ?o } WHERE { GRAPH <${graph}>{ <${uri}> ?p ?o  }}",

    resourceDeleteTemplate: "WITH <${graph}> DELETE { <${uri}> ?p ?o } WHERE {  <${uri}> ?p ?o }",

    generalDeleteTemplate: "${prefixes} \
        DELETE DATA { GRAPH <${graph}>{ ${body} }}",

    resourceExistsTemplate: "ASK { GRAPH <${graph}> { <${uri}> ?p ?o } }",

    turtleUpdateTemplate: "${prefixes} \
       WITH <${graph}> DELETE { <${uri}> ?p ?o } WHERE {  <${uri}> ?p ?o }\
       ; \
       INSERT DATA { GRAPH <${graph}>{ ${body} }}",
       
    turtleTrellisTemplate: "${prefixes} \
       WITH <${graph}> DELETE { <${uri}> ?p ?o } WHERE {  <${uri}> ?p ?o }\
       ; \
       INSERT DATA { GRAPH <${graph}>{ ${body} <${graph}> a <http://hyperdata.org/trellis/Tree> }}",

// page-oriented
       
    readPage: "PREFIX dcterms: <http://purl.org/dc/terms/> \
      PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
      PREFIX sioc: <http://rdfs.org/sioc/ns#> \
      PREFIX um: <http://purl.org/stuff/usermanagement#> \
      \
      SELECT DISTINCT ?title ?content ?date ?login WHERE { \
             GRAPH <http://hyperdata.org/pages> {\
          <${uri}> a sioc:Post ; \
         dcterms:title ?title; \
         sioc:content ?content ; \
         um:login ?login ; \
         dcterms:date ?date . \
            } \
}", //     um:fullname ?fullname ; \

    multiPageTemplate: "PREFIX dcterms: <http://purl.org/dc/terms/> \
      PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
      PREFIX sioc: <http://rdfs.org/sioc/ns#> \
      PREFIX um: <http://purl.org/stuff/usermanagement#> \
      \
      SELECT DISTINCT ?uri ?title ?content ?date ?fullname WHERE { \
          \
          ?uri a sioc:Post ; \
          dcterms:title ?title; \
          sioc:content ?content ; \
          dcterms:date ?date . \
      } \
      ORDER BY DESC(?date) \
      LIMIT ${limit} \
      OFFSET ${offset} \
      ", //           um:fullname ?fullname ; \

    // used to insert a new item into the store
    createPage: "PREFIX dcterms: <http://purl.org/dc/terms/> \
        PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
        PREFIX sioc: <http://rdfs.org/sioc/ns#> \
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
        
        // 
    updatePage: "PREFIX dcterms: <http://purl.org/dc/terms/> \
        PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
        PREFIX sioc: <http://rdfs.org/sioc/ns#> \
        WITH <${graph}> DELETE { <${uri}> ?p ?o } WHERE {  <${uri}> ?p ?o }\
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

    insertAnnotationTemplate: "PREFIX dcterms: <http://purl.org/dc/terms/> \
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

// Other functions 
            
    listGraphURIs: "SELECT DISTINCT ?graph WHERE { GRAPH ?graph {} }",

    vocabTemplate: "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \
    \
    SELECT * WHERE { GRAPH <${graph}> { \
        { \
            ?class a ?type . \
            ?class a rdfs:Class . \
            OPTIONAL { ?c rdfs:label ?label } \
            OPTIONAL { ?c rdfs:label ?label } \
            OPTIONAL { ?c rdfs:comment ?comment } \
            OPTIONAL { ?c rdfs:subClassOf ?subClassOf } \
        } UNION { \
            ?property a ?type . \
            ?property a rdf:Property . \
            OPTIONAL { ?p rdfs:subPropertyOf ?subPropertyOf } \
            OPTIONAL { ?p rdfs:domain ?domain } \
            OPTIONAL { ?p rdfs:range ?range } \
        }}}"
};

// make it visible to other scripts
module.exports = sparqlTemplates;
