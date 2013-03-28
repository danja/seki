var sparqlTemplates = require('../templates/SparqlTemplates');
var htmlTemplates = require('../templates/HtmlTemplates');

var special = {
		"/graphs" : {
				sparqlTemplate : sparqlTemplates.listGraphURIs,
				htmlTemplate : htmlTemplates.uriList
			}
		
};

module.exports = special;