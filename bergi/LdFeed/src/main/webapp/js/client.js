require.config({ baseUrl: "js", });

require(["jquery", "underscore", "ld-article-client", "rdfstore"], function($, _, LdArticleClient, rdfstore) {
	window.rdfstore.create(function(store) {
		var loadFromEndpoint = function(url, callback) {
			var query = endpoint + '?query=CONSTRUCT+{+%3Fs+%3Fp+%3Fo+}+WHERE+{+GRAPH+%3C' + escape(url) + '%3E+{+%3Fs+%3Fp+%3Fo+}+}';

			$.ajax(query).done(function(data) {				
				store.load("text/turtle", data, url, callback);
			});
		};

		/*var loadArticles = function(articles, callback) {
			if(!callback) callback = function() {};

			var counter = articles.length;
			var loadedArticles = [];

			_.each(articles, function(article) {
				loadFromEndpoint(article, function(success) {
					counter--;

					if(success)
						loadedArticles.push(article);

					if(counter == 0)
						callback(articles.length == loadedArticles.length, loadedArticles);
				});
			});
		};

		var refreshArticles = function(callback) {
			if(!callback) callback = function() {};

			var counter = feedUrls.length;

			_.each(feedUrls, function(feedUrl) {
				loadFromEndpoint(feedUrl, function(success) {
					if(!success) return callback(false, []);

					counter--;

					if(counter == 0) {
						client.listAllArticles(function(success, articles) {
							if(success)
								loadArticles(articles, callback);
							else
								callback(false, []);
						});
					}
				});
			});
		};*/

		var refreshArticles = function(callback) {
			_.each(feedUrls, function(feedUrl) {
				loadFromEndpoint(feedUrl, function(success) {
					if(success)
						client.listArticles(callback);
				});
			});
		};

		var jsUnescape = function(string) {
			return string.replace(/\\"/g, "\"").replace(/\\n/g, "\n").replace(/\\t/g, "\t");
		};

		var addArticle = function(article) {
			var html = '<div class="row-fluid"><div class="span12 well"><a href="' + article.url + '"><h2>' + jsUnescape(article.headline) + '</h2></a><p>' + jsUnescape(article.description) + '</p></div></div>';

			$('#posts').append(html);
		};

		var endpoint = 'http://localhost:3030/ds/sparql';
		var feedUrls = ['http://feeds.bergnet.org/heise-developer/#feed', 'http://feeds.bergnet.org/canon-rumors/#feed'];
		var client = new LdArticleClient(store, feedUrls[0], loadFromEndpoint);

		refreshArticles(addArticle);
	});
});
