var sparqlTemplates = require('./sparqlTemplates');
var htmlTemplates = require('./htmlTemplates');

var special = {
		"/graphs" : {
				sparqlTemplate : sparqlTemplates.listGraphURIs,
				htmlTemplate : htmlTemplates.uriList
			}
		
};

module.exports = special;