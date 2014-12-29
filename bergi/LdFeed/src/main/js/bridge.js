var fs = require('fs');
var LdFeedBridge = require('./LdFeedBridge.js');
//TODO: all " -> '

var writeConfig = function(filename, config) { fs.writeFileSync(filename, JSON.stringify(config, null, 2)); };
var readConfig = function(filename) { return JSON.parse(fs.readFileSync(filename)); };

var configFilename = 'config.json';
var config = readConfig(configFilename);

var bridge = new LdFeedBridge({sparqlEndpoint: config.sparqlEndpoint});


var parseNextFeed = function(index) {
	if(typeof index === "undefined")
		index = 0;

	var feed = config.feeds[index];

	bridge.parseUrl(feed.xmlUrl, new Date(feed.lastUpdate), new RegExp(feed.idRegExp), feed.url, function(event, data) {
		switch(event) {
			case 'article':
				console.log(data['@id']);

				var articleDate = new Date(data.pubdate);

				if(articleDate.getTime() > (new Date(feed.lastUpdate)).getTime())
					feed.lastUpdate = articleDate.toUTCString();

				break;

			case 'end':
				writeConfig(configFilename, config);

				break;
		}
	});

	index++;

	if(index < config.feeds.length)
		parseNextFeed(index);		
};

parseNextFeed();
