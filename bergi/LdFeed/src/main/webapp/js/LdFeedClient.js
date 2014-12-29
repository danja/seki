define(['underscore', 'jsonld'], function(_, jsonld) {
	var LdFeedClient = function(store, feedUrls, userUrl) {
		var client = this;
		client.feedUrls = feedUrls;
		client.userUrl = userUrl;

		client.markArticleAsRead = function(articleUrl, callback) {
			var graph = store.rdf.createGraph();

			if(!callback) callback = function() {};

			graph.add(store.rdf.createTriple(
				store.rdf.createNamedNode(client.userUrl),
				store.rdf.createNamedNode('http://schema.org/readItem'),
				store.rdf.createNamedNode(articleUrl)));

			store.insert(graph, userUrl, function(success) { callback(success); });
		};

		client.listAllArticles = function(callback) {
			if(!callback) callback = function() {};

			var query = "SELECT ?article WHERE {";

			for(var i=0; i<client.feedUrls.length; i++) {
				if(i != 0) query += ' UNION ';

				query += '{ GRAPH <' + client.feedUrls[i] + '> { ?s <http://schema.org/itemListElement> ?article } }';
			};

			query += "}";

			store.execute(query, function(success, results) {
				if(success) {
					var articles  = [];

					_.each(results, function(result) { articles.push(result.article.value); });

					callback(true, articles);
				} else {
					callback(false, []);
				}
			});
		};

		client.listReadArticles = function(callback) {
			if(!callback) callback = function() {};

			var query = 'SELECT ?article WHERE { GRAPH <' + client.userUrl + '> { ?s <http://schema.org/readItem> ?article } }';

			store.execute(query, function(success, results) {
				var articles  = [];

				_.each(results, function(result) { articles.push(result.article.value); });

				callback(articles);
			});
		};

		client.listUnreadArticles = function(callback) {
			if(!callback) callback = function() {};

			client.listAllArticles(function(allArticles) {
				client.listReadArticles(function(readArticles) {
					var unreadArticles = _.difference(allArticles, readArticles);

					callback(unreadArticles);
				});
			});
		};

		var toFlattenedJsonLd = function(graph) {
			var flattened = [];

			graph.forEach(function(triple) {
				var subjectIndex = function() {
					for(var i=0; i<flattened.length; i++) {
						if(flattened[i]["@id"] == triple.subject.nominalValue)
							return i;
					}

					flattened.push({"@id": triple.subject.nominalValue});

					return flattened.length-1;
				};

				flattened[subjectIndex()][triple.predicate.nominalValue] = triple.object.interfaceName == "Literal" ? [{'@value':triple.object.nominalValue}] : [{'@id':triple.object.nominalValue}];
			});

			return flattened;
		};

		var defaultJsonLdContext = {
			"headline": "http://schema.org/headline",
			"description": "http://schema.org/description",
			"dateCreated": "http://schema.org/dateCreated",
			"datePublished": "http://schema.org/datePublished",
			"isBasedOnUrl": {
				"@id": "http://schema.org/isBasedOnUrl",
				"@type": "@id" },
			"author": "http://schema.org/author",
			"image": {
				"@id": "http://schema.org/image",
				"@type": "@id" }
		};

		client.getArticleBody = function(articleUrl, callback) {
			if(!callback) callback = function() {};

			store.graph(articleUrl, function(success, graph) {
				var flattenedGraph = toFlattenedJsonLd(graph);

				jsonld.compact(flattenedGraph, defaultJsonLdContext, function(error, article) {
					if(error == null)
						callback(true, article);
					else
						callback(false);
				});
			});
		};
	};

	return LdFeedClient;
});
