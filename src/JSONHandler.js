
var jsonld = require('../lib/jsonld/jsonld');
require('../lib/jsonld/Future');

var config = require('./config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);
var StoreClient = require("./StoreClient");
var url = require("url");
var util = require("util");


// var jsonld = require('../../jsonld.js/js/jsonld');


// *          [base] the base IRI to use.
// *          [format] the format if output is a string:
// *            'application/nquads' for N-Quads.
// *          [loadContext(url, callback(err, url, result))] the context loader.

//Constructor
function JSONHandler() {
}

// properties and methods
JSONHandler.prototype = {
		
  value1: "default_value",
  
  "GET": function() {
   // this.value2 = argument + 100;
	  console.log("JSONHandler.GET called");
  },
  
  "POST": function() {
      // this.value2 = argument + 100;
      console.log("JSONHandler.POST called");
  },
  
  "PUT": function(sekiRequest, sekiResponse) {
      // this.value2 = argument + 100;
      console.log("JSONHandler.PUT called");
      var body = '';
      
      // request body may come in chunks, join them together
      sekiRequest.on('data', function(chunk) {
          body += chunk;
      });
      
      // now received body of request
      sekiRequest .on('end', function() { // need to choose graph - use map of URI templates?
              console.log("BODY = "+body);
       // body = body.toString();
              var options = { "format" : 'application/nquads' };
              //  options.format = 'application/nquads';
              
         //     eval("body = "+body);
             //  grab users from "@id"
          
            
              var bodyMap = JSON.parse(body);
              var resourceURI = bodyMap["@id"];
              if(!resourceURI) {
                  resourceURI = bodyMap["@subject"]; // legacy
              }
              var pathname = url.parse(resourceURI).pathname;
              
              var section = pathname.split("/");
              
              log.debug("SECTION = "+section);
              
              var rdfModelMap = {
                  "users" : "users"
                  
              };
              var graphURI = config.uriBase+"/"+section[1];
              
          //    log.debug("bodyMap[\"@id\"] = "+bodyMap["@id"]);
              log.debug("graphURI = "+graphURI);
              options.format = 'application/nquads';
              var processor = new jsonld.JsonLdProcessor();
              processor.normalize(bodyMap, options, callback);
              
              function callback(err, turtle) {
                  console.log("err = "+err);
                  
                  var callback = function(queryResponse) {
                      var redirectURI = "/";
                      log.debug("callback called");
                      var headers = {
                          "Location" : redirectURI,
                          "Content-type" : "text/html; charset=utf-8"
                      };
                      // do the redirect
                      sekiResponse.writeHead(303, headers);
                      sekiResponse.end();
                  }
                  
                  var client = new StoreClient();
                //  var turtle = JSON.stringify(data);
                  console.log("JSONHAndler = "+turtle);
           
                  client.sendTurtle(graphURI, turtle, callback);
              }
 // }
});
  }
}

module.exports = JSONHandler;