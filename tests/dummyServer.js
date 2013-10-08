
	var http = require('http');
    var qs = require('querystring');
    
	http.createServer(function (request, response) {
		console.log(JSON.stringify(request.headers));
        
        if (request.method == 'POST') {
            console.log("POST received");
            var body = '';
            request.on('data', function (data) {
            //    console.log("data="+data);
                body += data;
            });
        request.on('end', function () {
            
            var POST = qs.parse(body);
            // use POST
            console.log("data="+body);
            return;        
        });
    
        }
	  response.writeHead(200, {'Content-Type': 'text/plain'});
	  response.end('Hello World\n');
	}).listen(8081, '127.0.0.1');
	console.log('Server running at http://127.0.0.1:8081/');
// }
    
    // curl -i -H "Accept: application/json" -X POST -d "firstName=james" http://localhost:8081