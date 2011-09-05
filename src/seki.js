/*
 * curl http://localhost:8888/seki/Hello
 */

var sys = require('sys');
var http = require('http');
var fs = require('fs');

var templater = require('./templater');
var sparql_templates = require('./sparql_templates');
var html_templates = require('./html_templates');

var seki_host = "localhost";
var seki_port = 8888; // change to 80 for live
var seki_headers = {
  "Content-type" : "text/html; charset=utf-8"
};

var sparql_host = "localhost";
var sparql_port = 3030;
var sparql_endpoint = "/seki/query";
var sparql_headers = {
  "Accept" : "application/sparql-results+xml",
  "Host" : "localhost:8888"
};

var uri_base = "http://hyperdata.org";

var files = {
  "/seki/" : "www/index.html",
  "/seki/form" : "www/form.html"
}

sys.log("Seki serving on " + seki_host + ":" + seki_port);
sys.log("addressing SPARQL on " + sparql_host + ":" + sparql_port);

http.createServer(
    function(seki_request, seki_response) {
      // sys.log("SEKI REQUEST HEADERS "+JSON.stringify(request.headers));

      sys.log("REQUEST URL = " + seki_request.url);

      if (files[seki_request.url]) {
        serve_file(seki_response, files[seki_request.url]);
        sys.log("FILE = " + files[seki_request.url]);
      }

      var client = http.createClient(sparql_port, sparql_host);

      var resource = uri_base + seki_request.url;
      // sys.log("RESOURCE = "+resource);

      var query_templater = templater(sparql_templates.named_post_template);

      var replace_map = {
        "URI" : resource
      };

      var query = query_templater.fill_template(replace_map);

      // sys.log("QUERY = "+query);

      var query_path = sparql_endpoint + "?query=" + escape(query);

      var query_request = client.request(seki_request.method, query_path,
          sparql_headers);

      var page_templater = templater(html_templates.page_template);

      query_request.addListener('response', function(query_response) {

        var saxer = require('./srx2map');
        var stream = saxer.create_stream();

        seki_response.pipe(stream);

        query_response.addListener('data', function(chunk) {
          stream.write(chunk);
        });
        query_response.addListener('end', function() {

          stream.end();

          var bindings = stream.bindings;
          // sys.log("GOT: " + JSON.stringify(bindings));
          // sys.log("TITLE: " + bindings.title);

          var html = page_templater.fill_template(bindings);

          seki_response.write(html, 'binary');
          seki_response.end();
        });

        seki_response.writeHead(query_response.statusCode, seki_headers); // query_response.headers
        // sys.log("SEKI RESPONSE HEADERS "+query_response.statusCode +
        // JSON.stringify(seki_headers));
      });
      seki_request.addListener('data', function(chunk) {
        sys.log("query_request.write(chunk " + chunk)
        query_request.write(chunk, 'binary');
      });
      seki_request.addListener('end', function() {
        query_request.end();
      });
    }).listen(seki_port, seki_host);

function serve_file(response, file) {
  sys.log("FILE = " + file);

  fs.readFile(file, function(err, data) {
    var status = 200;
    if (err) {
      data = "Error :" + err;
      var status = 500;
    }
    response.writeHead(status, seki_headers); // query_response.headers
    response.write(data, 'binary');
    response.end();
  });
}