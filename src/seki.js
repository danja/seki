/*
 * curl http://localhost:8888/seki/Hello
 */

var http = require('http');
var sys = require('sys');

var templater = require('./templater');
var sparql_templates = require('./sparql_templates');
var html_templates = require('./html_templates');

var seki_host = "localhost";
var seki_port = 8888; // change to 80 for live

var sparql_host = "localhost";
var sparql_port = 3030;
var sparql_endpoint = "/seki/query";

var uri_base = "http://hyperdata.org";


// "application/sparql-results+xml"
var client_headers = {
  "Accept" : "application/sparql-results+xml",
  "Host" : "localhost:8888"
};
var server_headers = {
  "Content-type" : "text/html"
};

sys.log("Seki serving on " + seki_host + ":" + seki_port);
sys.log("addressing SPARQL on " + sparql_host + ":" + sparql_port);

http.createServer(
        function(request, response) {
        //  sys.log("SEKI REQUEST HEADERS "+JSON.stringify(request.headers));
          
          var client = http.createClient(sparql_port, sparql_host);
          
          var resource = uri_base + request.url;
          //   sys.log("RESOURCE = "+resource);
          
            var  query_templater = templater(sparql_templates.named_post_template);
       
             var replace_map = {"URI": resource};
             
              var query = query_templater.fill_template(replace_map);

             // sys.log("QUERY = "+query);

          var query_path = sparql_endpoint + "?query=" + escape(query);

          var query_request = client.request(request.method, query_path,
              client_headers);
   
          var page_entry_templater = templater(html_templates.page_entry_template);

          query_request.addListener('response', function(query_response) {

            
            var saxer = require('./srx2map');
            var stream = saxer.create_stream();

            // stream.write(xml);
            response.pipe(stream);

            query_response.addListener('data', function(chunk) {
              stream.write(chunk);
            });
            query_response.addListener('end', function() {

              stream.end();

              var bindings = stream.bindings;
          //    sys.log("GOT: " + JSON.stringify(bindings));
           //   sys.log("TITLE: " + bindings.title);

              var html = page_entry_templater.fill_template(bindings);

              response.write(html, 'binary');
              response.end();
            });

            response.writeHead(query_response.statusCode, server_headers); // query_response.headers
          //  sys.log("SEKI RESPONSE HEADERS "+query_response.statusCode + JSON.stringify(server_headers)); 
          });
          request.addListener('data', function(chunk) {
            sys.log("query_request.write(chunk "+chunk)
            query_request.write(chunk, 'binary');
          });
          request.addListener('end', function() {
            query_request.end();
          });
        }).listen(seki_port, seki_host);