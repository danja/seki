/*
 * curl http://localhost:8888/seki/Hello

CONSOLE.LOG(
 */

/*
 * library module imports
 */
// var sys = require('sys');
var http = require('http');
var fs = require('fs'); // filesystem module
var qs = require('querystring'); // POST parameters parser

/*
 * Seki support scripts imports
 */
var templater = require('./templater');
var sparqlTemplates = require('./sparqlTemplates');
var htmlTemplates = require('./htmlTemplates');

/*
 * Settings for the Seki Server (this)
 */
var sekiHost = "localhost";
var sekiPort = 8888; // change to 80 for live
var sekiHeaders = {
  "Content-type" : "text/html; charset=utf-8"
};
// this version will be modified
var sekiHeaders2 = {
    "Content-type" : "text/html; charset=utf-8"
  };
/*
 * Settings for the SPARQL/HTTP server (typically Fuseki)
 */
var sparqlHost = "localhost";
var sparqlPort = 3030;
var sparqlQueryEndpoint = "/seki/query";
var sparqlUpdateEndpoint = "/seki/update";
var sparqlHeaders = {
  "Accept" : "application/sparql-results+xml",
  "Host" : "localhost:8888"
};

var postHeaders = {
    "Accept" : "application/sparql-results+xml",
    "Host" : "localhost:8888",
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  
var uriBase = "http://hyperdata.org"; // used in the RDF

/*
 * mapping URIs to static files on the filesystem
 */
var files = {
  "/seki/" : "www/index.html",
  "/seki/index" : "www/index.html",
  "/seki/form" : "www/form.html",
  "404" : "www/404.html"
};

http.createServer(onRequest).listen(sekiPort, sekiHost);

/*
 * Callback to handler HTTP requests (typically from browser)
 */
function onRequest(sekiRequest, sekiResponse) {
  // console.log("SEKI REQUEST HEADERS "+JSON.stringify(sekiRequest.headers));
  // console.log("REQUEST URL = " + sekiRequest.url);
  // console.log("REQUEST METHOD = " + sekiRequest.method);

  if (sekiRequest.url == "/favicon.ico") {
    sekiResponse.writeHead(404, sekiHeaders); // queryResponse.headers
    sekiResponse.end();
    return;
  }
  // does this URL correspond to a static file?
  if (files[sekiRequest.url]) {
    serveFile(sekiResponse, 200, files[sekiRequest.url]);
    console.log("FILE = " + files[sekiRequest.url]);
    return;
  }

  // the client that will talk to the SPARQL server
  var client = http.createClient(sparqlPort, sparqlHost);

  // the URI used in the RDF
  var resource = uriBase + sekiRequest.url;

  if (sekiRequest.method == "GET") {
    var queryTemplater = templater(sparqlTemplates.itemTemplate);
    var replaceMap = { "uri" : resource };

    var sparql = queryTemplater.fillTemplate(replaceMap);
    var queryPath = sparqlQueryEndpoint + "?query=" + escape(sparql);
    var clientRequest =  client.request("GET", queryPath, sparqlHeaders);
    // console.log("QUERY = "+sparql);


    clientRequest.on('response', function(queryResponse) {
      getHandler(sekiResponse, queryResponse);
    });

    sekiRequest.on('end', function() {
      console.log("End of sekiRequest");
      clientRequest.end();
    });
  }
  if (sekiRequest.method == "POST") {
    console.log("Start of POST");
    var queryTemplater = templater(sparqlTemplates.insertTemplate);
    var post_body = '';

    sekiRequest.on('data', function(chunk) {
      post_body += chunk;
    });

    sekiRequest.on('end', function() {

      var replaceMap = qs.parse(post_body);
      
      replaceMap["date"] =  new Date().toJSON();
      
      console.log("ReplaceMap = "+JSON.stringify(replaceMap));
      
      var sparql = queryTemplater.fillTemplate(replaceMap);
   //  var queryPath = sparqlUpdateEndpoint + "?query=" + escape(sparql);
      var queryPath = sparqlUpdateEndpoint;
      //+ "?graph=" + escape(replaceMap.uri);
      
     var clientRequest =  client.request("POST", queryPath, postHeaders);
    
     clientRequest.write(qs.stringify({"update": sparql}));
     
     console.log(queryPath);
      // console.log(post_body);
      // console.log(JSON.stringify(params));
      console.log(sparql);

      clientRequest.end();
      
      clientRequest.on('response', function(queryResponse) {
        // getHandler(sekiResponse, queryResponse);
        var relativeUri = replaceMap.uri.substring(uriBase.length);
        
        sekiHeaders2["Location"] = relativeUri;
        
        sekiResponse.writeHead(303, sekiHeaders2); // queryResponse.headers
       // sekiResponse.write(replaceMap.uri+" : "+queryResponse.statusCode, 'binary');
        sekiResponse.end();
      });
    });
  }
}

console.log("Seki serving on " + sekiHost + ":" + sekiPort);
console.log("addressing SPARQL on " + sparqlHost + ":" + sparqlPort);

/*
 * Handles GET requests (typically from a browser)
 */
function getHandler(sekiResponse, queryResponse) {

  var viewTemplater = templater(htmlTemplates.viewTemplate);
  console.log("GOT RESPONSE ");
  var saxer = require('./srx2map');
  var stream = saxer.createStream();

  sekiResponse.pipe(stream);

  queryResponse.on('data', function(chunk) {
    stream.write(chunk);
  });
  queryResponse.on('end', function() {

    stream.end();

    var bindings = stream.bindings;
    if (bindings.title) {
      console.log("GOT: " + JSON.stringify(bindings));
      // console.log("TITLE: " + bindings.title);

      var html = viewTemplater.fillTemplate(bindings);
    } else {
      console.log("404");
      serveFile(sekiResponse, 404, files["404"]);
      return;
    }
    sekiResponse.write(html, 'binary');
    sekiResponse.end();
  });
};

/*
 * Reads a file from the filesystem and writes its data to response (typically a
 * browser)
 */
function serveFile(sekiResponse, status, file) {
  console.log("FILE = " + file);

  fs.readFile(file, function(err, data) {
    if (err) {
      data = "Error :" + err;
      status = 500;
    }
    sekiResponse.writeHead(status, sekiHeaders); // queryResponse.headers
    sekiResponse.write(data, 'binary');
    sekiResponse.end();
  });
};
// }
