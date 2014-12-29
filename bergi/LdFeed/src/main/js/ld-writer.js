var _ = require('underscore');
var http = require('http');
var jsonld = require('jsonld');
var url = require('url');


var LdWriter = function(options) {	
	var jsonLdToNT = function(data, callback) {
		jsonld.normalize(data, {}, function(error, normalized) {
			if(error)
				throw error;

			var nt = "";

			var nodeToNT = function(node) {
				if(node.type == "IRI")
					return "<" + node.value + ">";
				else if(node.type == "blank node")
					return '_:' + node.value ;
				else
					return '\"\"\"' + node.value.replace(/\"/g, '\\"')  + '\"\"\"';
			};

			_.each(normalized["@default"], function(triple) {
				nt += nodeToNT(triple.subject) + ' ' + nodeToNT(triple.predicate) + ' ' + nodeToNT(triple.object) + ' .\n';
			});

			callback(nt);
		});
	};

	var sendSparqlUpdate = function(query, callback) {
		var options = url.parse(sparqlEndpoint);

		options.method = 'POST';
		options.headers = { 'Content-Type': 'application/sparql-update' };

		var request = http.request(options, function(response) {
			if(response.statusCode < 200 || response.statusCode >= 300) {
				throw "error writing data (http status code: " + response.statusCode + ")";
			} else {
				request.abort();
				callback();
			}
		});

		request.on('error', function(error) {
			throw "error writing data (" + error + ")";
		});

		request.write(query);
		request.end();
	};

	var writeSparql = function(graphUrl, data, callback) {
		if(typeof callback !== "function") callback = function() {};

		jsonLdToNT(data, function(nt) {
			sendSparqlUpdate("INSERT DATA { GRAPH <" + graphUrl + "> { " + nt + " }}", callback);
		});
	};

	var writeLdp = function(graphUrl, data, callback) {
		//TODO: implement me
	};

	var sparqlEndpoint = null;

	if(!options)
		options = {};

	if(typeof options.sparqlEndpoint !== "undefined") {
		sparqlEndpoint = options.sparqlEndpoint;

		this.write = writeSparql;
	} else {
		this.write = writeLdp;
	}
};

module.exports = LdWriter;
