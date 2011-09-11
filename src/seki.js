/*
 * Main Seki script
 * 
 * see README.md
 */

/*
 * library module imports
 */
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
 * Settings for the remote SPARQL/HTTP server (typically Fuseki)
 */
var sparqlHost = "localhost";
var sparqlPort = 3030;
var sparqlGraphEndpoint = "/seki/data";
var sparqlQueryEndpoint = "/seki/query";
var sparqlUpdateEndpoint = "/seki/update";

var graphHeaders = {
  "Accept" : "application/rdf+xml",
  "Host" : "localhost:8888"
};

var sparqlHeaders = {
  "Accept" : "application/sparql-results+xml",
  "Host" : "localhost:8888"
};

var postHeaders = {
  "Accept" : "application/sparql-results+xml",
  "Host" : "localhost:8888",
  'Content-Type' : 'application/x-www-form-urlencoded'
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

// set it running
http.createServer(onRequest).listen(sekiPort, sekiHost);

console.log("Seki serving on " + sekiHost + ":" + sekiPort);
console.log("addressing SPARQL on " + sparqlHost + ":" + sparqlPort);

/*
 * Callback to handler HTTP requests (typically from browser)
 */
function onRequest(sekiRequest, sekiResponse) {
  // console.log("SEKI REQUEST HEADERS "+JSON.stringify(sekiRequest.headers));
  // console.log("REQUEST URL = " + sekiRequest.url);
  // console.log("REQUEST METHOD = " + sekiRequest.method);

  // browsers ask for this - give them a sensible response
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
  var accept = sekiRequest.headers["accept"];

  console.log("Accept header =" + accept
      + accept.indexOf("application/rdf+xml" == 0));
  if (sekiRequest.method == "GET") {

    /*
     * Handle requests for "Accept: application/rdf+xml" addresses server using
     * SPARQL 1.1 Graph Store HTTP Protocol
     */
    if (accept.indexOf("application/rdf+xml") == 0) {
      console.log("RDF/XML requested");

      var queryPath = sparqlGraphEndpoint + "?graph=" + escape(resource);
      console.log("queryPath =" + queryPath);
      var clientRequest = client.request("GET", queryPath, graphHeaders);
      clientRequest.end();

      // handle SPARQL server response
      clientRequest.on('response', function(queryResponse) {
        // serve status & headers
        sekiResponse.writeHead(200, queryResponse.headers);

        // response body may come in chunks, whatever, just pass them on
        queryResponse.on('data', function(chunk) {
          // console.log("headers " + JSON.stringify(queryResponse.headers));
          sekiResponse.write(chunk);
        });
        // the SPARQL server response has finished, so finish up this response
        queryResponse.on('end', function() {
          sekiResponse.end();
        });
      });
      return;
    }

    // Assume HTML is acceptable

    // build the query
    var queryTemplater = templater(sparqlTemplates.itemTemplate);
    var replaceMap = {
      "uri" : resource
    };
    var sparql = queryTemplater.fillTemplate(replaceMap);

    // build the URL from the query
    var queryPath = sparqlQueryEndpoint + "?query=" + escape(sparql);

    // make the request to the SPARQL server
    var clientRequest = client.request("GET", queryPath, sparqlHeaders);

    // console.log("QUERY = "+sparql);

    // handle the response from the SPARQL server
    clientRequest.on('response', function(queryResponse) {
      serveHTML(sekiResponse, queryResponse);
    });

    // finish up
    sekiRequest.on('end', function() {
      // console.log("End of sekiRequest");
      clientRequest.end();
    });
    return;
  }

  if (sekiRequest.method == "POST") {
    // console.log("Start of POST");

    /*
     * start building query - but it needs the data supplied in the body of the
     * request by the browser
     */
    var queryTemplater = templater(sparqlTemplates.insertTemplate);
    var post_body = '';

    // request body may come in chunks, join them together
    sekiRequest.on('data', function(chunk) {
      post_body += chunk;
    });

    // now received body of request
    sekiRequest.on('end', function() {

      // turn the POST parameters into JSON
      var replaceMap = qs.parse(post_body);
      replaceMap["date"] = new Date().toJSON();

      // console.log("ReplaceMap = "+JSON.stringify(replaceMap));

      // can now make the query
      var sparql = queryTemplater.fillTemplate(replaceMap);

      /*
       * make the request to the SPARQL server the update has to be POSTed to
       * the SPARQL server
       */
      var clientRequest = client.request("POST", sparqlUpdateEndpoint,
          postHeaders);

      // send the update query as POST parameters
      clientRequest.write(qs.stringify({
        "update" : sparql
      }));

      // console.log(queryPath);
      // console.log(post_body);
      // console.log(sparql);

      clientRequest.end();

      // handle the response from the SPARQL server
      clientRequest.on('response', function(queryResponse) {

        var relativeUri = replaceMap.uri.substring(uriBase.length);

        // do a redirect to the new item
        sekiHeaders2["Location"] = relativeUri;
        sekiResponse.writeHead(303, sekiHeaders2);
        // all done
        sekiResponse.end();
      });
    });
  }
}

/*
 * Handles GET requests (typically from a browser)
 */
function serveHTML(sekiResponse, queryResponse) {

  // set up HTML builder
  var viewTemplater = templater(htmlTemplates.viewTemplate);
  // console.log("GOT RESPONSE ");
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
}
// }
