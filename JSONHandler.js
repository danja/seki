
var jsonld = require('./lib/jsonld/jsonld');
require('./lib/jsonld/Future');

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
  
  "PUT": function(request, response) {
      var sekiRequest = request;
      var sekiResponse =  response;
      // this.value2 = argument + 100;
      console.log("JSONHandler.PUT called");
      var body = '';
      
      // request body may come in chunks, join them together
      sekiRequest.on('data', function(chunk) {
          log.debug("JSON PUT data event");
          body += chunk;
      });
      
      // now received body of request
      sekiRequest .on('end', function() { 
          log.debug("JSON PUT end event");
              var options = { "format" : 'application/nquads' };
     
              var bodyMap = JSON.parse(body);
              
              // handle legacy ///////////////
              for (var i=0;i<bodyMap["@type"].length;i++) {
                  if(bodyMap["@type"][i][0]=="<"){
                      bodyMap["@type"][i] = bodyMap["@type"][i].substring(1, bodyMap["@type"][i].length-1);
                  }
              }
              var newMap = {};
              for (var key in bodyMap) {

                  var newKey = key;
                  var value = bodyMap[key];
                 // log.debug("BEFORE = "+key+ " : "+bodyMap[key]);
                  
                  if(key[0] == "<") {
                    //  log.debug("key HAS <");
                      newKey = key.substring(1, key.length-1);
                    //  log.debug("newKey = "+newKey);
                  }
                  
                      // is adequate? consider literals
                  if(bodyMap[key] && bodyMap[key][0] == "<"){
                  //    log.debug("value HAS <");
                          value = bodyMap[key].substring(1, value.length-1);
                    //      log.debug("bodyMap[key] = "+bodyMap[key]);
                   //       log.debug("value = "+value);
                  }
//                     log.debug("newKey = "+newKey);
//                     log.debug("value = "+value);
                    newMap[newKey] = value;
              };
              bodyMap = newMap;
              
              if(!bodyMap["@id"]) {
                  bodyMap["@id"] = bodyMap["@subject"];
            //      log.debug("RESOURCE = "+resourceURI);
              }
              //////////////////////////////////
              
              bodyMap["http://purl.org/dc/terms/date"] = new Date().toJSON();
              
              var resourceURI = bodyMap["@id"];
              var pathname = url.parse(resourceURI).pathname;          
              var section = pathname.split("/");
              var graphURI = config.uriBase+"/"+section[1];
              
           //   log.debug("graphURI = "+graphURI);
              options.format = 'application/nquads';
              var processor = new jsonld.JsonLdProcessor();
              processor.normalize(bodyMap, options, jsonLdProcessorCallback);
              
              function jsonLdProcessorCallback(err, turtle) {
                  this.name = "JSONLDPROCESSORCALLBACK";
                  log.debug("JSONLDPROCESSORCALLBACK");
                  log.debug("err = "+err);
                  
                  var client = new StoreClient();
                  var finalCallback = function(){
                      var headers = {
                          "Location" : resourceURI,
                      "Content-type" : "text/html; charset=utf-8"
                      };
                      sekiResponse.writeHead(201, headers); // 201 Created
                      sekiResponse.end();
                  }
                  client.replaceResource(graphURI, resourceURI, turtle, finalCallback);   
               
                  }   
});
  }
}

module.exports = JSONHandler;