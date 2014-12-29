define(['underscore', 'jsonld'], function(_, jsonld) {
	var LdArticleClient = function(store, listUrl, loadGraph) {
		var toFlattenedJsonLd = function(graph) {
			var flattened = [];

			graph.forEach(function(triple) {
				var subjectIndex = function() {
					for(var i=0; i<flattened.length; i++) {
						if(flattened[i]['@id'] == triple.subject.nominalValue)
							return i;
					}

					flattened.push({'@id': triple.subject.nominalValue});

					return flattened.length-1;
				};

				flattened[subjectIndex()][triple.predicate.nominalValue] =
					triple.object.interfaceName == 'Literal' ?
						[{'@value':triple.object.nominalValue}] : [{'@id':triple.object.nominalValue}];
			});

			return flattened;
		};

		var defaultJsonLdContext = {
			"headline": "http://schema.org/headline",
			"description": "http://schema.org/description",
			"dateCreated": "http://schema.org/dateCreated",
			"datePublished": "http://schema.org/datePublished",
			"url": {
				"@id": "http://schema.org/url",
				"@type": "@id" },
			"author": "http://schema.org/author",
			"image": {
				"@id": "http://schema.org/image",
				"@type": "@id" }
		};

		this.listArticleUrls = function(callback) { 
			var query = 'SELECT ?article WHERE { GRAPH <' + listUrl + '> { ?s <http://schema.org/itemListElement> ?article } }';

			store.execute(query, function(success, results) {
				if(success) {
					var articleUrls  = [];

					_.each(results, function(result) { articleUrls.push(result.article.value); });

					callback(articleUrls);
				} else {
					callback([]);
				}
			});
		};

		this.listArticles = function(callback) {
			var client = this;

			this.listArticleUrls(function(articleUrls) {
				_.each(articleUrls, function(articleUrl) {
					//TODO: fetch graph via sync-store
					loadGraph(articleUrl, function(success) {
						client.getArticle(articleUrl, callback);				
					});
				});
			});
		};

		this.getArticle = function(articleUrl, callback) {
			if(!callback) callback = function() {};

			store.graph(articleUrl, function(success, graph) {
				var flattenedGraph = toFlattenedJsonLd(graph);

				jsonld.compact(flattenedGraph, defaultJsonLdContext, function(error, article) {
					if(error == null)//TODO: check @type
						callback(article);
				});
			});
		};
	};

	return LdArticleClient;
});
