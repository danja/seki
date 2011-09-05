/*
 * curl http://localhost:8888/seki/Hello

CONSOLE.LOG(
 */

var sys = require('sys');
var http = require('http');
var fs = require('fs');
var qs = require('querystring');

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
  "/seki/form" : "www/form.html",
  "404" : "www/404.html"
}


sys.log("Seki serving on " + seki_host + ":" + seki_port);
sys.log("addressing SPARQL on " + sparql_host + ":" + sparql_port);

http.createServer(
    function(seki_request, seki_response) {
      sys.log("SEKI REQUEST HEADERS "+JSON.stringify(seki_request.headers));

      sys.log("REQUEST URL = " + seki_request.url);
      sys.log("REQUEST METHOD = " + seki_request.method);
      if (files[seki_request.url]) {
        serve_file(seki_response, 200, files[seki_request.url]);
        sys.log("FILE = " + files[seki_request.url]);
      }

      var client = http.createClient(sparql_port, sparql_host);

      var resource = uri_base + seki_request.url;
      // sys.log("RESOURCE = "+resource);

       var view_templater = templater(html_templates.view_template);
       
       if(seki_request.method =="GET") {
         var query_templater = templater(sparql_templates.item_template);
         var replace_map = { "URI" : resource };
       }
       if(seki_request.method =="POST"){
         var query_templater = templater(sparql_templates.insert_template);  
       }
       
       
       
      var sparql = query_templater.fill_template(replace_map);

      // sys.log("QUERY = "+query);

      var query_path = sparql_endpoint + "?query=" + escape(sparql);

      var query_request = client.request("GET", query_path,
          sparql_headers); // seki_request.method

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
          if (bindings.title) {
            sys.log("GOT: " + JSON.stringify(bindings));
            //sys.log("TITLE: " + bindings.title);

            var html = view_templater.fill_template(bindings);
          } else {
            sys.log("404");
            serve_file(seki_response, 404, files["404"]);
            return;
          }

          seki_response.write(html, 'binary');
          seki_response.end();
        });

        seki_response.writeHead(query_response.statusCode, seki_headers); // query_response.headers
        // sys.log("SEKI RESPONSE HEADERS "+query_response.statusCode +
        // JSON.stringify(seki_headers));
      });
      var post_body = '';
      seki_request.addListener('data', function(chunk) {
        post_body += chunk;
        sys.log("HEREHEREHEREHEREHEREHEREquery_request.write(chunk " + chunk)
     //   query_request.write(chunk, 'binary');
      });
      seki_request.addListener('end', function() {
     //   query_request.end();
      
        var replace_map = qs.parse(post_body);
        var sparql = query_templater.fill_template(replace_map);
        // sys.log(post_body);
      //  sys.log(JSON.stringify(params));
        sys.log(sparql);

      });
    }).listen(seki_port, seki_host);

function serve_file(response, status, file) {
  sys.log("FILE = " + file);

  fs.readFile(file, function(err, data) {
    if (err) {
      data = "Error :" + err;
      status = 500;
    }
    response.writeHead(status, seki_headers); // query_response.headers
    response.write(data, 'binary');
    response.end();
  });
}