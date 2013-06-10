var config = require('../config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);
var freemarker = require('../templates/freemarker');
var StoreClient = require("../StoreClient");
var url = require("url");
var ResponseRenderer = require("../ResponseRenderer");

var sparqlTemplates = require('../templates/SparqlTemplates');
var jsonTemplates = require('../templates/JsonTemplates');


// Constructor
function VieJsonHandler() {
}

// properties and methods
VieJsonHandler.prototype = {
    
    "handle" : function(sekiRequest, sekiResponse) {
        log.debug("VieJsonHandler.handle called");
        var vocab = sekiRequest.url.split("/")[1];
        log.debug("VOCAB = "+vocab);
        
        var map = {
            "graph" : "http://hyperdata.org/misc"
        };
        
        var sparql = freemarker.render(sparqlTemplates.vocabTemplate, map);
        
        var client = new StoreClient();
        var callback = function(res){
         ;
            res.setEncoding('utf8');
            var responseRenderer = new ResponseRenderer();
            var headers = {
                "Content-type": "application/json; charset=utf-8",
                "Connection": "keep-alive", // added later
                "Transfer-Encoding": "chunked"
            };
            responseRenderer.serve(sekiResponse, res, jsonTemplates.vieJsonTemplate, headers);
            
//             var data;
//             res.on('data', function (chunk) {
//                 data += chunk;
// 
//            //     sekiResponse.writeHead(200, headers);
//             //    sekiResponse.end(chunk);
//              
//             });
//             res.on('end', function () {
//                 var responseRenderer = new ResponseRenderer();
//                 responseRenderer.serve(sekiResponse, data, jsonTemplates.vieJsonTemplate);
//             });
            
        }
        var options = {
            "method" : "GET",
            "path" : config.sparqlQueryEndpoint + "?query=" + escape(sparql)
        };
        // config.queryOptions
        client.send(options, sparql, callback);
        

       
    }
}

module.exports = VieJsonHandler;