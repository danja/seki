/*
 * Templates used to build SPARQL
 * parts like ${this} will be replaced
 */
var sparqlUserTemplates = {

    listUsersTemplate: "PREFIX um: <http://purl.org/stuff/usermanagement#>  \
    \
    SELECT DISTINCT ?uri ?login ?password ?role \
    WHERE { \
        GRAPH <http://hyperdata.org/users> { \
            ?uri     a um:User ; \
            um:login ?login ; \
            um:password ?password ; \
            um:hasRole ?role . \
    }}",

    // used to insert a new item into the store
    insertUserTemplate: "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \
PREFIX owl: <http://www.w3.org/2002/07/owl#> \
PREFIX dcterms: <http://purl.org/dc/terms/> \
PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
PREFIX um: <http://purl.org/stuff/usermanagement#> \
\
INSERT DATA { \
GRAPH <users>{\
\
   <http://hyperdata.org/users/${login}> a um:User ; \
   dcterms:created \"${date}\";\
um:login \"${login}\" ; \
um:password \"${password}\" ; \
um:hasRole <http://hyperdata.org/roles/default> . \
}}"

}
