var getPageListSparql = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n\
PREFIX dc: <http://purl.org/dc/terms/>  \n\
PREFIX foaf: <http://xmlns.com/foaf/0.1/>  \n\
PREFIX sioc: <http://rdfs.org/sioc/ns#>  \n\
PREFIX wiki: <http://purl.org/stuff/wiki#>  \n\
\n\
SELECT DISTINCT * WHERE { \n\
?uri \n\
dc:format <http://purl.org/NET/mediatypes/text/markdown> ; \n\
dc:date ?date ; \n\
dc:title ?title ; \n\
a wiki:Page ; \n\
foaf:maker [ \n\
foaf:nick ?nick \n\
] . \n\
} \n\
ORDER By DESC(?date)  \n\
# LIMIT 10 \n\
";

var getPageSparqlTemplate = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n\
    PREFIX dc: <http://purl.org/dc/terms/>  \n\
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>  \n\
    PREFIX sioc: <http://rdfs.org/sioc/ns#>  \n\
    PREFIX wiki: <http://purl.org/stuff/wiki#>  \n\
    \n\
    SELECT DISTINCT * WHERE { \n\
    <${pageURI}> \n\
    dc:format <http://purl.org/NET/mediatypes/text/markdown> ; \n\
    dc:date ?date ; \n\
    dc:title ?title ; \n\
    sioc:content ?content ; \n\
    a wiki:Page ; \n\
    foaf:maker [ \n\
    foaf:nick ?nick \n\
    ] . \n\
} \n\
";

var postPageSparqlTemplate = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>  \n\
PREFIX dc: <http://purl.org/dc/terms/> \n\
PREFIX foaf: <http://xmlns.com/foaf/0.1/> \n\
PREFIX sioc: <http://rdfs.org/sioc/ns#> \n\
PREFIX wiki: <http://purl.org/stuff/wiki#> \n\
\n\
WITH <${graphURI}> \n\
DELETE { <${pageURI}>  ?p ?o }  \n\
WHERE { <${pageURI}>  ?p ?o } \n\
; \n\
INSERT DATA {  \n\
GRAPH <${graphURI}> {  \n\
\n\
<${pageURI}> \n\
dc:format <http://purl.org/NET/mediatypes/text/markdown> ; \n\
dc:date \"${date}\" ; \n\
dc:title \"\"\"${title}\"\"\" ; \n\
sioc:content  \"\"\"${content}\"\"\" ; \n\
a sioc:Post ; \n\
a wiki:Page ; \n\
foaf:maker [ \n\
foaf:nick \"${nick}\" \n\
] . \n\
}  \n\
}";



