var sparql_templates = {
    named_post_template: "PREFIX dc: <http://purl.org/dc/elements/1.1/> \
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
      }"
    };

module.exports = sparql_templates;