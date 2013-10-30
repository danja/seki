/*
 * Crude HTTP server for client testing
 */

var http = require('http');
var qs = require('querystring');

var host = "localhost";
var port = 8080;

http.createServer(function(request, response) {
    console.log(JSON.stringify(request.headers, null, 4));

    console.log("URL = " + request.url);

    if (request.method == 'POST') {
        console.log("POST received");
        var body = '';
        request.on('data', function(data) {
            //    console.log("data="+data);
            body += data;
        });
        request.on('end', function() {

            var POST = qs.parse(body);
            // use POST
            console.log("data=" + body);
            return;
        });

    }
    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    response.end('Hello World!');
}).listen(port, host);
console.log('Server running at ' + host + ":" + port);
