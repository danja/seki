/*
 * curl http://localhost:8888/seki/Hello

CONSOLE.LOG(
 */

var sys = require('sys');
var http = require('http');
var fs = require('fs');
var qs = require('querystring');

var templater = require('./templater');
var sparqlTemplates = require('./sparqlTemplates');
var htmlTemplates = require('./htmlTemplates');

var sekiHost = "localhost";
var sekiPort = 8888; // change to 80 for live
var sekiHeaders = {
  "Content-type" : "text/html; charset=utf-8"
};

var sparqlHost = "localhost";
var sparqlPort = 3030;
var sparqlEndpoint = "/seki/query";
var sparqlHeaders = {
  "Accept" : "application/sparql-results+xml",
  "Host" : "localhost:8888"
};

var uriBase = "http://hyperdata.org";

var files = {
  "/seki/" : "www/index.html",
  "/seki/form" : "www/form.html",
  "404" : "www/404.html"
}

http.createServer(onRequest).listen(sekiPort, sekiHost);

function onRequest(sekiRequest, sekiResponse) {
//      sys.log("SEKI REQUEST HEADERS "+JSON.stringify(sekiRequest.headers));
//      sys.log("REQUEST URL = " + sekiRequest.url);
//      sys.log("REQUEST METHOD = " + sekiRequest.method);
      
      if (files[sekiRequest.url]) {
        serveFile(sekiResponse, 200, files[sekiRequest.url]);
        sys.log("FILE = " + files[sekiRequest.url]);
      }

      var client = http.createClient(sparqlPort, sparqlHost);

      var resource = uriBase + sekiRequest.url;
      // sys.log("RESOURCE = "+resource);

       var viewTemplater = templater(htmlTemplates.viewTemplate);
       
    //   if(sekiRequest.method =="GET") {
         var queryTemplater = templater(sparqlTemplates.itemTemplate);
         var replaceMap = { "uri" : resource };
  //     }
//       if(sekiRequest.method =="POST"){
//         var queryTemplater = templater(sparqlTemplates.insert_template);  
//       }
       
       
      var sparql = queryTemplater.fillTemplate(replaceMap);

      // console.log("QUERY = "+sparql);

      var queryPath = sparqlEndpoint + "?query=" + escape(sparql);

      var queryRequest = client.request("GET", queryPath,
          sparqlHeaders); // sekiRequest.method

      queryRequest.addListener('response', function(queryResponse) {
        
        console.log("GOT RESPONSE ");
        var saxer = require('./srx2map');
        var stream = saxer.createStream();

        sekiResponse.pipe(stream);

        queryResponse.addListener('data', function(chunk) {
          stream.write(chunk);
        });
        queryResponse.addListener('end', function() {

          stream.end();

          var bindings = stream.bindings;
          if (bindings.title) {
            sys.log("GOT: " + JSON.stringify(bindings));
            //sys.log("TITLE: " + bindings.title);

            var html = viewTemplater.fillTemplate(bindings);
          } else {
            sys.log("404");
            serveFile(sekiResponse, 404, files["404"]);
            return;
          }

          sekiResponse.write(html, 'binary');
          sekiResponse.end();
        });

    //    sekiResponse.writeHead(queryResponse.statusCode, sekiHeaders); // queryResponse.headers
        // sys.log("SEKI RESPONSE HEADERS "+queryResponse.statusCode +
        // JSON.stringify(sekiHeaders));
      });
      var post_body = '';
//      sekiRequest.addListener('data', function(chunk) {
//        post_body += chunk;
//        sys.log("HEREHEREHEREHEREHEREHEREqueryRequest.write(chunk " + chunk)
//     //   queryRequest.write(chunk, 'binary');
//      });
      
    sekiRequest.addListener('end', function() {
      queryRequest.end();


     });
//      sekiRequest.addListener('end', function() {
//     //   queryRequest.end();
//      
//        var replaceMap = qs.parse(post_body);
//        var sparql = queryTemplater.fillTemplate(replaceMap);
//        // sys.log(post_body);
//      //  sys.log(JSON.stringify(params));
//        sys.log(sparql);
//
//      });
}



sys.log("Seki serving on " + sekiHost + ":" + sekiPort);
sys.log("addressing SPARQL on " + sparqlHost + ":" + sparqlPort);

function serveFile(response, status, file) {
  sys.log("FILE = " + file);

  fs.readFile(file, function(err, data) {
    if (err) {
      data = "Error :" + err;
      status = 500;
    }
    response.writeHead(status, sekiHeaders); // queryResponse.headers
    response.write(data, 'binary');
    response.end();
  });
}