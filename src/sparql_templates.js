var sparql_templates = {
  item_template : "PREFIX dc: <http://purl.org/dc/elements/1.1/> \
      PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
      PREFIX sioc: <http://rdfs.org/sioc/ns#> \
      \
      SELECT ?title ?content ?date ?nick WHERE { \
      \
      <%URI%> a sioc:Post ; \
         dc:title ?title; \
         sioc:content ?content ; \
         foaf:maker ?maker ; \
         dc:date ?date . \
      \
      ?maker foaf:nick ?nick . \
      }",

  insert_template : "PREFIX dc: <http://purl.org/dc/elements/1.1/> \
        PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
        PREFIX sioc: <http://rdfs.org/sioc/ns#> \
        \
        INSERT DATA { \
        GRAPH <%URI%>{\
        \
        <%URI%> a sioc:Post ;\
           dc:title \"%TITLE%\";\
           sioc:content \"%CONTENT%\" ;\
           foaf:maker [ foaf:nick \"%NICK%\" ] ;\
           dc:date \"2011-08-30T19:20Z\" .\
        }}"
};

module.exports = sparql_templates;