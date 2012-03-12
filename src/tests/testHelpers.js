var http = require("http");

exports.normalizeXmlSpaces = function normalizeXmlSpaces(string) {
	string = string.replace(/\s+</g, "<"); // clear out leading spaces
	string = string.replace(/>\s+</g, "><"); // clear out spaces between tags
	string = string.replace(/>\s+/g, ">"); // clear out trailing spaces
	return string;
}

exports.client = function client(clientMethod, clientHeaders, callback) {
	try {
		var config = require('../config').config;
	} // fall back on config-default.js
	catch (e) {
		var config = require('../config-default').config;
	}

	var options = {
		 host: config.sekiHost,
		 port: config.sekiPort,
		 path: "/Hello",
		 method: clientMethod,
		 headers: clientHeaders
	};

	var req = http.request(options, function(res) {
	//	console.log('STATUS: ' + res.statusCode);
	//	console.log('HEADERS: ' + JSON.stringify(res.headers));
		// res.setEncoding('utf8');
		var content = "";
		res.on('data', function(chunk) {
		//	console.log('BODY: ' + chunk);
			// callback(chunk);
			content += chunk;
		});
		res.on('end', function() {
			callback(res.statusCode, content);
		});
	});
	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
		callback('problem with request: ' + e.message);
	});

	// write data to request body
	// req.write('data\n'); // for POSTs
	req.end();
}
