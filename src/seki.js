/*
 * target.js
 */

var http = require('http');
var sys = require('sys');

var sparql_templates = require('./sparql_templates');

var seki_host = "localhost";
var seki_port = 8888; // change to 80 for live
var sparql_host = "localhost";
var sparql_port = 3030;

// "application/sparql-results+xml"
var target_headers = {
  "Accept" : "application/sparql-results+xml",
  "Host" : "localhost:8888"
};
sys.log("Seki serving on " + seki_host + ":" + seki_port);
sys.log("addressing SPARQL on " + sparql_host + ":" + sparql_port);
http.createServer(
    function(request, response) {

      sys.log(request.connection.remoteAddress + ": " + request.method + " "
          + request.url + " - " + request.headers['host']);
      var target = http.createClient(sparql_port, sparql_host);
      var query_path = sparql_templates.named_post(request.url);

      var target_request = target.request(request.method, query_path,
          target_headers);

      var saxer = require('./srx2map');
      var stream = saxer.create_stream();

      // stream.write(xml);
      response.pipe(stream);

      target_request.addListener('response',
          function(target_response) {

            target_response.addListener('data', function(chunk) {
              stream.write(chunk);

            });
            target_response.addListener('end', function() {
              // response.write(xml, 'binary');
              stream.end();
              var bindings = stream.bindings;
              sys.log("GOT: " + JSON.stringify(bindings));

              var title = bindings.title.value;
              response.write(title, 'binary');

              response.end();
            });

            response.writeHead(target_response.statusCode,
                target_response.headers);
          });
      request.addListener('data', function(chunk) {
        target_request.write(chunk, 'binary');
      });
      request.addListener('end', function() {
        target_request.end();
      });
    }).listen(seki_port, seki_host);