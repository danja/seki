/*
 * target.js
 */

var http = require('http');
var sys  = require('sys');

var mapper = require('./mapper')

var target_port = 3030;
var access_port = 8888; // change to 80 for live
var host = "localhost";
	//  "application/sparql-results+xml"
	var target_headers = { "Accept": "application/sparql-results+xml", "Host":"localhost:8888"};

http.createServer(function(request, response) {

  sys.log(request.connection.remoteAddress + ": " + request.method + " " + request.url+ " - "+request.headers['host']);
  var target = http.createClient(target_port, host); // request.headers['host']
    var query_path = mapper.to_sparql(request.url);

 // var target_request = target.request(request.method, request.url, request.headers); // proxy version
 // sys.log("proxy: " + request.method + " " + request.url+ " - "+JSON.stringify(request.headers));
    var target_request = target.request(request.method, query_path, target_headers); // 
  sys.log("target: " + request.method + " " + query_path+ " - "+JSON.stringify(target_headers));
  
  target_request.addListener('response', function (target_response) {
	  var xml = "";
    target_response.addListener('data', function(chunk) {
    //	sys.log("CHUNK "+chunk);  	
    	xml += chunk;
      // response.write(chunk, 'binary');
    });
    target_response.addListener('end', function() {
    	response.write(xml, 'binary');
    	sys.log("XML "+xml); 
      response.end();
      xml = "";
      
    });
    
    response.writeHead(target_response.statusCode, target_response.headers);
  });
  request.addListener('data', function(chunk) {
    target_request.write(chunk, 'binary');
  });
  request.addListener('end', function() {
    target_request.end();
  });
}).listen(access_port);