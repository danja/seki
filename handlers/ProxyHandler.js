// todo : trim requires
var http = require('http');
var qs = require('querystring'); // POST parameters parser
var sparqlTemplates = require('../templates/SparqlTemplates');
var StoreClient = require("../StoreClient");
// var templater = require('./templates/Templater');
var freemarker = require('../templates/freemarker');
var Constants = require('../config/Constants');
var config = require('../config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);
var util = require('util'); // isneeded?

var querystring = require("querystring");

var postHeaders = {
	"Accept" : "application/sparql-results+xml",
	"Host" : config.sekiHost + ":" + config.sekiPort,
	'Content-Type' : 'application/x-www-form-urlencoded'
};

// Constructor
function ProxyHandler() {
}

// properties and methods
ProxyHandler.prototype = {
    "announce" : function(message) {
        log.debug("Message = "+message);
    },
    
    "name" : "ProxyHandler",
	"handle" : function(request, response, options) {
        var sekiRequest = request;
        var sekiResponse = response;
        log.debug("ProxyHandler.handle");

        log.debug("ProxyHandler method "+sekiRequest.method);
// log.debug("Proxy resp "+util.inspect(sekiResponse));
        
     //   log.debug("Proxy req "+util.inspect(sekiRequest));
        
    //    log.debug("proxying to "+config.client["host"]+":"+config.client["port"]+options.path);
     
     //   log.debug("\n\noptions.path = "+options.path);
     //   log.debug("\n\noptions.path = "+querystring.unescape(options.path));
        
        options.path = options.path.replace('%2523', '%23'); // HACK - # gets double-escaped
     
        var proxyOptions = {
            host: config.client["host"],
            port: config.client["port"],
            // path: sekiRequest.url.substring(6),
            path: options.path,
            method: sekiRequest.method,
            headers: sekiRequest.headers
        };
        
       log.debug("proxyOptions = "+JSON.stringify(proxyOptions));
        
        /*
        var connector = http.request(proxyOptions, function(res) {
            res.pipe(response, {end:true});//tell 'response' end=true
            });
        sekiRequest.pipe(connector, {end:true});
        */
            
        var proxyRequest = http.request(proxyOptions, function(proxyResponse) {
            
       log.debug("In proxyRequest");
         log.debug("proxyResponse.headers = "+proxyResponse.headers);
            
            sekiResponse.writeHead(proxyResponse.statusCode, proxyResponse.headers);
            
            proxyResponse.on('data', function(chunk) {
      //          log.debug("proxyResponse.on('data' "+chunk);
                sekiResponse.write(chunk, 'binary');
            });
            
            proxyResponse.on('end', function() {
                sekiResponse.end();
            });
            
        });
        
      //  log.debug("proxyRequest = "+util.inspect(proxyRequest));
        
        proxyRequest.on('error', function(e) {
           log.debug('problem with proxy request: ' + e.message);
        });
        
        sekiRequest.on('data', function(chunk) {
           log.debug("sekiRequest.on data "+chunk);
            proxyRequest.write(chunk);
        });
        
        sekiRequest.on('end', function() {
           log.debug("sekiRequest.on end");
            proxyRequest.end();
        });
        sekiRequest.on('close', function() { // shouldn't be needed?
     //       log.debug("sekiRequest.on close");
            proxyRequest.end();
        });
        sekiRequest.on('finish', function() { // shouldn't be needed?
                  log.debug("sekiRequest.on finish");
            proxyRequest.end();
        });
  //     proxyRequest.end(); // the end block above should do this, seems wrong like this
        sekiRequest.addListener('end', function () {
            log.debug("sekiRequest.on end listener");
            // will get called in node v0.10.3 because we called req.resume()
            proxyRequest.end();
        });
     //   proxyRequest.end();
}
}


module.exports = ProxyHandler;