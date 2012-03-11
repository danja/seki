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
var static = require('node-static');

var verbose = true;

/*
 * Seki support scripts imports
 */
var templater = require('./templater');
var sparqlTemplates = require('./sparqlTemplates');
var htmlTemplates = require('./htmlTemplates');

/*
 * If there is a custom config.js, use it
 */
try {
  var config = require('./config').config;
  verbosity("Using config.js");
} // fall back on config-default.js
catch (e) {
  var config = require('./config-default').config;
  verbosity("Using config-default.js");
}

var sekiHeaders = {
  "Content-type" : "text/html; charset=utf-8"
};
// this version will be modified
var sekiHeaders2 = {
  "Content-type" : "text/html; charset=utf-8"
};

var graphHeaders = {
  "Accept" : "application/rdf+xml",
  "Host" : config.sekiHost+":"+config.sekiPort
};

var sparqlHeaders = {
  "Accept" : "application/sparql-results+xml",
  "Host" : config.sekiHost+":"+config.sekiPort
};

var postHeaders = {
  "Accept" : "application/sparql-results+xml",
  "Host" : config.sekiHost+":"+config.sekiPort,
  'Content-Type' : 'application/x-www-form-urlencoded'
};



/*
 * mapping URIs to static files on the filesystem
 * 
 */
var files = {
  "/" : "www/index.html",
  "/index" : "www/index.html",
  "/form" : "www/form.html",
  "404" : "www/404.html"
};

//
//Create a node-static server to serve the current directory
//
var file = new(static.Server)('www', { cache: 7200});

// set it running
http.createServer(onRequest).listen(config.sekiPort, config.sekiHost);

verbosity("Seki serving on " + config.sekiHost + ":" + config.sekiPort);
verbosity("addressing SPARQL on " + config.sparqlHost + ":" + config.sparqlPort);

/*
 * Callback to handle HTTP requests (typically from browser)
 */
function onRequest(sekiRequest, sekiResponse) {
   verbosity("SEKI REQUEST HEADERS "+JSON.stringify(sekiRequest.headers));
   verbosity("REQUEST URL = " + sekiRequest.url);
   verbosity("REQUEST METHOD = " + sekiRequest.method);
   

   file.serve(sekiRequest, sekiResponse, function (err, res) {
     if (err) { // the file doesn't exist, leave it to Seki
     } else { // The file was served successfully
         verbosity("> " + sekiRequest.url + " - " + res.message);
     }
 });

   verbosity("got past file server");
   
  // browsers ask for this - give them a sensible response
//  if (sekiRequest.url == "/favicon.ico") {
//    sekiResponse.writeHead(404, sekiHeaders); // queryResponse.headers
//    sekiResponse.end();
//    return;
//  }

  // does this URL correspond to a static file?
//  if (files[sekiRequest.url]) {
//    serveFile(sekiResponse, 200, files[sekiRequest.url]);
//    verbosity("FILE = " + files[sekiRequest.url]);
//    return;
//  }

  // the client that will talk to the SPARQL server
  var client = http.createClient(config.sparqlPort, config.sparqlHost);

  // the URI used in the RDF
  var resource = config.uriBase + sekiRequest.url;
  var accept = sekiRequest.headers["accept"];

//verbosity("Accept header =" + accept
//      + accept.indexOf("application/rdf+xml" == 0));
  
  if (sekiRequest.method == "GET") {

    /*
     * Handle requests for "Accept: application/rdf+xml" addresses server using
     * SPARQL 1.1 Graph Store HTTP Protocol
     */
    if (accept && accept.indexOf("application/rdf+xml") == 0) {
      verbosity("RDF/XML requested");

      var queryPath = config.sparqlGraphEndpoint + "?graph=" + escape(resource);
      verbosity("queryPath =" + queryPath);
      var clientRequest = client.request("GET", queryPath, graphHeaders);
      clientRequest.end();

      // handle SPARQL server response
      clientRequest.on('response', function(queryResponse) {
        // serve status & headers
        sekiResponse.writeHead(200, queryResponse.headers);

        // response body may come in chunks, whatever, just pass them on
        queryResponse.on('data', function(chunk) {
          // verbosity("headers " + JSON.stringify(queryResponse.headers));
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
    var queryPath = config.sparqlQueryEndpoint + "?query=" + escape(sparql);

    // make the request to the SPARQL server
    var clientRequest = client.request("GET", queryPath, sparqlHeaders);

    // verbosity("QUERY = "+sparql);

    // handle the response from the SPARQL server
    clientRequest.on('response', function(queryResponse) {
      serveHTML(resource, sekiResponse, queryResponse);
    });

    // finish up
    sekiRequest.on('end', function() {
      // verbosity("End of sekiRequest");
      clientRequest.end();
    });
    return;
  }

  if (sekiRequest.method == "POST") {
    // verbosity("Start of POST");

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

      // verbosity("ReplaceMap = "+JSON.stringify(replaceMap));

      // can now make the query
      var sparql = queryTemplater.fillTemplate(replaceMap);

      /*
       * make the request to the SPARQL server the update has to be POSTed to
       * the SPARQL server
       */
      var clientRequest = client.request("POST", config.sparqlUpdateEndpoint,
          postHeaders);

      // send the update query as POST parameters
      clientRequest.write(qs.stringify({
        "update" : sparql
      }));

      // verbosity(queryPath);
      // verbosity(post_body);
      // verbosity(sparql);

      clientRequest.end();

      // handle the response from the SPARQL server
      clientRequest.on('response', function(queryResponse) {

        var relativeUri = replaceMap.uri.substring(config.uriBase.length);

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
function serveHTML(resource, sekiResponse, queryResponse) {

  // set up HTML builder
  var viewTemplater = templater(htmlTemplates.viewTemplate);
  // verbosity("GOT RESPONSE ");
  var saxer = require('./srx2map');
  var stream = saxer.createStream();

  sekiResponse.pipe(stream);

  queryResponse.on('data', function(chunk) {
    stream.write(chunk);
  });
  queryResponse.on('end', function() {

    stream.end();

    var bindings = stream.bindings;
    if (bindings.title) { //// this is ugly
      verbosity("GOT: " + JSON.stringify(bindings));
      // verbosity("TITLE: " + bindings.title);

      var html = viewTemplater.fillTemplate(bindings);
    } else {
      verbosity("404");
      ///////////////////////////////// refactor
      var creativeTemplater = templater(htmlTemplates.creativeTemplate);
      var creativeMap = {
    	      "uri" : resource
    	    };
      var html = creativeTemplater.fillTemplate(creativeMap);
      /////////////////////////////////////////////
      // serveFile(sekiResponse, 404, files["404"]);
      //return;
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
  verbosity("FILE = " + file);

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

function verbosity (message) {
  if(verbose) console.log(message);
}
// }
