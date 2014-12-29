var _ = require('underscore');
var FeedParser = require('feedparser');
var fs = require('fs');
var http = require('http');
var url = require('url');
var LdWriter = require(__dirname + '/ld-writer.js');


var LdFeedBridge = function(options) {	
	var addArticle = function(feedUrl, articleUrl, article, callback) {
		if(!callback) callback = function() {};

		var feedData = {
			"@id": feedUrl,
			"http://schema.org/itemListElement": { "@id": articleUrl }
		};

		ldWriter.write(articleUrl, article, function() {
			ldWriter.write(feedUrl, feedData, function() {
				callback(article);
			});
		});
	};

	var processArticle = function(feedUrl, idRegExp, article, callback) {
		var context = {
			"title": "http://schema.org/headline",
			"description": "http://schema.org/description",
			"date": "http://schema.org/dateCreated",
			"pubdate": "http://schema.org/datePublished",
			"link": {
				"@id": "http://schema.org/url",
				"@type": "@id" },
			"author": "http://schema.org/author",
			"image": {
				"@id": "http://schema.org/image",
				"@type": "@id" }
		};

		var propertyWhiteList = Object.keys(context);

		var isEmpty = function(x) {
			return (x == null || (_.isArray(x) && x.length == 0) || (_.isObject(x) && _.isEmpty(x)));
		};

		var id = feedUrl + idRegExp.exec(article['guid'])[0] + postFragmentId;

		for(var property in article) {
			if(_.isDate(article[property]))
				article[property] = article[property].toISOString();

			if(!_.contains(propertyWhiteList, property) || isEmpty(article[property]))
				delete article[property];
		}

		article['@context'] = context;
		article['@id'] = id;
		article['@type'] = "http://schema.org/Article";

		addArticle(feedUrl + feedFragmentId, article['@id'], article, function(article) {
			callback(article);
		});
	};

	var processFeedStream = function(feedStream, feedUrl, lastUpdate, idRegExp, callback) {
		var done = false;
		var process = 0;
		
		feedStream
			.on('data', function(article) {
				if(new Date(article.pubdate) <= lastUpdate)
					return;

				process++;

				processArticle(feedUrl, idRegExp, article, function(article) {
					callback('article', article);

					process--;

					if(done && !process)
						callback('end');
				});
			})
			.on('end', function() { done = true; });
	};

	var ldWriter = new LdWriter(options);

	var feedFragmentId = "#feed";
	var postFragmentId = "#post";

	this.parseFile = function(file, idRegExp, feedUrl, callback) {
		if(!callback) callback = function() {};

		processFeedStream(
				fs.createReadStream(file)
					.on('error', function(error) {
						console.log(error);
					})
					.pipe(new FeedParser()),
				feedUrl, new Date(), idRegExp, callback);
	};

	this.parseUrl = function(xmlUrl, lastUpdate, idRegExp, feedUrl, callback) {
		if(!callback) callback = function() {};
 
		var options = url.parse(xmlUrl);
		options.headers = { 'If-Modified-Since': lastUpdate.toUTCString() };

		var request = http.get(options, function(response) {			
			processFeedStream(response.pipe(new FeedParser()), feedUrl, lastUpdate, idRegExp, callback);
		});

		request.on('error', function(error) {
			console.log(error);
		});

		request.end();
	};
};

module.exports = LdFeedBridge;
