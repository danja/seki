/*
 * Simple proxy server for troubleshooting HTTP communications
 *
 * runs on Node - http://nodejs.org/
 *
 * modify settings in source as required
 *
 * to run:
 * node Proxy
 */

var http = require('http');

// Settings ------------------------------------
// var targetHost = "localhost";
var targetHost = "dallemang.typepad.com";
// var targetPort = 8080;
var targetPort = 80;

var proxyHost = "localhost";
var proxyPort = 8888;

// note http:// not required, e.g.
// var targetHost = "google.com";
// var targetPort = 80;
// ----------------------------------------------

console.log("\nProxy addressing " + targetHost + ":" + targetPort);
console.log("Serving on " + proxyHost + ":" + proxyPort);

http.createServer(function(clientRequest, clientResponse) {

    console.log("\n***** Calling " + targetHost + ":" + targetPort + clientRequest.url + " *****\n");

    var proxyOptions = {
        host: targetHost,
        port: targetPort,
        path: clientRequest.url,
        method: clientRequest.method,
        headers: clientRequest.headers
    };
    console.log("Request : " + JSON.stringify(proxyOptions, null, 4));
    console.log("-----");
    var proxyRequest = http.request(proxyOptions, function(proxyResponse) {

        clientResponse.writeHead(proxyResponse.statusCode, proxyResponse.headers);

        console.log("Response : HTTP " + proxyResponse.statusCode + "\n" + JSON.stringify(proxyResponse.headers, null, 4));

        var returnedData = '';

        proxyResponse.on('data', function(chunk) {
            clientResponse.write(chunk, 'binary');
            returnedData += chunk;
        });

        proxyResponse.on('end', function() {
            clientResponse.end();
            if (returnedData != "") {
                console.log("Body :\n" + returnedData + "\n");
            } else {
                console.log("(no data returned)");
            }
            console.log("*****");
        });

    });

    proxyRequest.on('error', function(e) {
        console.log('problem with proxy request: ' + e.message);
    });

    var sentData = '';
    clientRequest.on('data', function(chunk) {
        sentData += chunk;
        proxyRequest.write(chunk);
    });

    clientRequest.on('end', function() {
        if (clientRequest.method == 'PUT' || clientRequest.method == 'POST') {
            console.log("Sent data :\n" + sentData);
        }
        proxyRequest.end();
    });
}).listen(proxyPort, proxyHost);
