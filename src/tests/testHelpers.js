var http = require("http");

exports.normalizeXmlSpaces = function normalizeXmlSpaces(string) {
	string = string.replace(/\s+</g,"<"); // clear out leading spaces
	string = string.replace(/>\s+</g,"><"); // clear out spaces between tags
	string = string.replace(/>\s+/g,">"); // clear out trailing spaces
	return string;
}

exports.client = function client(clientMethod){
	try {
		  var config = require('../config').config;
		} // fall back on config-default.js
		catch (e) {
		  var config = require('../config-default').config;
		}
		
	var options = {
//			  host: config.sekiHost,
//			  port: config.sekiPort,
//			  path: "/seki/Hello",
//			  method: clientMethod
			  host: config.sekiHost,
			  port: 8888,
			  path: "/seki/Hello",
			  method: "GET"
			};

		
    	var req = http.request(options, function(res) {
  		  console.log('STATUS: ' + res.statusCode);
  		  console.log('HEADERS: ' + JSON.stringify(res.headers));
  		//  res.setEncoding('utf8');
  		  res.on('data', function (chunk) {
  		   console.log('BODY: ' + chunk);
  		  });
  		});
  	req.on('error', function(e) {
  		  console.log('problem with request: ' + e.message);
  		});

  		// write data to request body
  		req.write('data\n');
  		req.end();
}




