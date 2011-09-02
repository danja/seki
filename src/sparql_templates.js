var sys  = require('sys');

var uri_base = "http://hyperdata.org";
var endpoint = "/seki/query";

exports.named_post = function (path) {
	var resource = "<" + uri_base + path + ">";
	sys.log("RESOURCE :"+resource);
	var query = query_template.replace("%URI%", resource);
	var query_path = endpoint + "?query=" + escape(query);
	sys.log("QUERYPATH :"+query_path);
	return query_path;
};

var query_template = "PREFIX dc: <http://purl.org/dc/elements/1.1/> \
PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
PREFIX sioc: <http://rdfs.org/sioc/ns#> \
\
SELECT ?title ?content ?date ?nick WHERE { \
\
%URI% a sioc:Post ; \
   dc:title ?title; \
   sioc:content ?content ; \
   foaf:maker ?maker ; \
   dc:date ?date . \
\
?maker foaf:nick ?nick . \
}";