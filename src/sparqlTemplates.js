var sparqlTemplates = {
  itemTemplate : "PREFIX dc: <http://purl.org/dc/elements/1.1/> \
      PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
      PREFIX sioc: <http://rdfs.org/sioc/ns#> \
      \
      SELECT ?title ?content ?date ?nick WHERE { \
      \
      <%uri%> a sioc:Post ; \
         dc:title ?title; \
         sioc:content ?content ; \
         foaf:maker ?maker ; \
         dc:date ?date . \
      \
      ?maker foaf:nick ?nick . \
      }",

  insertTemplate : "PREFIX dc: <http://purl.org/dc/elements/1.1/> \
        PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
        PREFIX sioc: <http://rdfs.org/sioc/ns#> \
        \
        INSERT DATA { \
        GRAPH <%uri%>{\
        \
        <%uri%> a sioc:Post ;\
           dc:title \"%uri%\";\
           sioc:content \"%content%\" ;\
           foaf:maker [ foaf:nick \"%nick%\" ] ;\
           dc:date \"%date%\" .\
        }}"
};

module.exports = sparqlTemplates;