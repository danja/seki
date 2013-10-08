// todo : trim requires
var http = require('http');
var qs = require('querystring'); // POST parameters parser
var sparqlTemplates = require('./templates/SparqlTemplates');
var StoreClient = require("./StoreClient");
// var templater = require('./templates/Templater');
var freemarker = require('./templates/freemarker');
var Constants = require('./config/Constants');
var config = require('./config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);
var util = require('util'); // isneeded?

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
    "name" : "ProxyHandler",
	"handle" : function(sekiRequest, sekiResponse, options) {

        log.debug("ProxyHandler.handle");

        log.debug("ProxyHandler method "+sekiRequest.method);
  //   var targetUrl = sekiRequest.url.substring(6);
        
        log.debug("proxying to "+config.client["host"]+":"+config.client["port"]+options.path);
   //  log.debug("options.path = "+options.path);
     
        var proxyOptions = {
            host: config.client["host"],
            port: config.client["port"],
            // path: sekiRequest.url.substring(6),
            path: options.path,
            method: sekiRequest.method,
            headers: sekiRequest.headers
        };
        
    //    log.debug("proxyOptions = "+JSON.stringify(proxyOptions));
        
        /*
        var connector = http.request(proxyOptions, function(res) {
            res.pipe(response, {end:true});//tell 'response' end=true
            });
        sekiRequest.pipe(connector, {end:true});
        */
            
        var proxyRequest = http.request(proxyOptions, function(proxyResponse) {
            
       
        //    log.debug("proxyResponse.headers = "+proxyResponse.headers);
            
            sekiResponse.writeHead(proxyResponse.statusCode, proxyResponse.headers);
            
            proxyResponse.on('data', function(chunk) {
                sekiResponse.write(chunk, 'binary');
            });
            
            proxyResponse.on('end', function() {
                sekiResponse.end();
            });
            
        });
        
 //       log.debug("proxyRequest = "+util.inspect(proxyRequest));
        
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
        sekiRequest.on('close', function() {
            log.debug("sekiRequest.on close");
            proxyRequest.end();
        });
    //   proxyRequest.end(); // the end block above should do this, seems wrong like this
       
}
}


module.exports = ProxyHandler;