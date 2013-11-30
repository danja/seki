// todo : trim requires
var http = require('http');
var qs = require('querystring'); // POST parameters parser
var util = require('util'); // isneeded?
var querystring = require("querystring");

var sparqlTemplates = require('../templates/SparqlTemplates');
var StoreClient = require("../core/StoreClient");
// var templater = require('./templates/Templater');
var freemarker = require('../templates/freemarker');
var Constants = require('../config/Constants');
var config = require('../config/ConfigDefault').config;
var Nog = require('../lib/nog/nog'),
log = new Nog(config.logLevel);



var postHeaders = {
    "Accept": "application/sparql-results+xml",
    "Host": config.sekiHost + ":" + config.sekiPort,
    'Content-Type': 'application/x-www-form-urlencoded'
};

function ProxyHandler() {}

ProxyHandler.prototype = {

    "name": "ProxyHandler", // not used!
    "handle": function(sekiRequest, sekiResponse, options) {

        log.debug("ProxyHandler.handle");

        options.path = options.path.replace('%2523', '%23'); // HACK - # gets double-escaped

        var proxyOptions = {
            host: config.client["host"],
            port: config.client["port"],
            // path: sekiRequest.url.substring(6),
            path: options.path,
            method: sekiRequest.method,
            headers: sekiRequest.headers,
            agent: false // see http://nodejs.org/api/http.html#http_http_request_options_callback
        };

        //     log.debug("proxyOptions = "+JSON.stringify(proxyOptions));

        var proxyRequest = http.request(proxyOptions, function(proxyResponse) {

            sekiResponse.writeHead(proxyResponse.statusCode, proxyResponse.headers);

            proxyResponse.on('data', function(chunk) {
                sekiResponse.write(chunk, 'binary');
            });

            proxyResponse.on('end', function() {
                sekiResponse.end();
            });

        });

        proxyRequest.on('error', function(e) {
            log.debug('problem with proxy request: ' + e.message);
        });

        sekiRequest.on('data', function(chunk) {
            //    log.debug("sekiRequest.on data "+chunk);
            proxyRequest.write(chunk);
        });

        sekiRequest.on('end', function() {
            log.debug("ProxyHandler sekiRequest.on end");
            proxyRequest.end();
        });
        sekiRequest.on('close', function() { // shouldn't be needed?
            //       log.debug("sekiRequest.on close");
            proxyRequest.end();
        });
    }
}


module.exports = ProxyHandler;
