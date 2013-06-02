
    var url = require('url');
    
    var urlParts = url.parse(sekiRequest.url, true);
    // var query = urlParts.query;
    // var path = urlParts.pathname;
    
    // __dirname = /home/danny/workspace-javascript/seki/src
    // /home/danny/workspace-javascript/seki/src/seki/js/rdface/
    // /home/danny/workspace-javascript/seki/www/seki/js/rdface/
    
    // check for corresponding files on the filesystem
    if (sekiRequest.method == "GET" || sekiRequest.method == "HEAD") {
        var tweakedPathname = urlParts.pathname;
        if (urlParts.pathname.substring(0, 1) == "/") {
            tweakedPathname = urlParts.pathname.substring(1);
        }
        var dir = __dirname + "/../www/";
        console.log("dir = " + dir);
        console.log("tweakedPathname = " + tweakedPathname);
        var path = require('path').resolve(dir, tweakedPathname);
        console.log("__dirname = " + __dirname);
        console.log("PATH = " + path);
        
        var stats = null;
        try {
            stats = fs.statSync(path);
            //  console.log(util.inspect(stats));
        } catch (e) {
            //  console.log("Error : " + e);
        }
        
        /////////////////////
        
        //      fs.exists(path, function(exists) {
        // 303 is See Other
        if (stats) { // exists stopped working
            
            var mimeTypes = {
                "html": "text/html",
                "jpeg": "image/jpeg",
                "jpg": "image/jpeg",
                "png": "image/png",
                "js": "text/javascript",
                "css": "text/css"};
                var p = require('path');
                var uri = url.parse(sekiRequest.url).pathname;
                var filename = p.join(process.cwd(), "../www/", unescape(uri));
                var stat;
                
                try {
                    stat = fs.lstatSync(filename); // throws if path doesn't exist
                } catch (e) {
                    sekiResponse.writeHead(404, {'Content-Type': 'text/plain'});
                    sekiResponse.write('404 Not Found \n'+filename);
                    sekiResponse.end();
                    return;
                    }
                    
                    
                    if (stat.isFile()) {
                        // path exists, is a file
                        var mimeType = mimeTypes[p.extname(filename).split(".")[1]];
                        sekiResponse.writeHead(200, {'Content-Type': mimeType} );
                        
                        var fileStream = fs.createReadStream(filename);
                        fileStream.pipe(sekiResponse);
                } else if (stat.isDirectory()) {
                        // path exists, is a directory
                        sekiResponse.writeHead(200, {'Content-Type': 'text/plain'});
                sekiResponse.write('Index of '+uri+'\n');
                sekiResponse.write('TODO, show index?\n');
                sekiResponse.end();
            } else {
                // Symbolic link, other?
                // TODO: follow symlinks?  security?
                sekiResponse.writeHead(500, {'Content-Type': 'text/plain'});
                sekiResponse.write('500 Internal server error\n');
                sekiResponse.end();
                }
                
                
                //                 var staticProxyOptions = {
                //                     hostname: config.staticHost,
                //                     port: config.staticPort,
                //                     path: urlParts.pathname,
                //                     method: 'GET',
                //                     headers: sekiRequest.headers
                //                 };
                //                
                //                 var data = "";
                //                 
                //                 var proxyRequest = http.request(staticProxyOptions, function(proxyResponse) {
                //                     console.log('proxyResponse STATUS: ' + proxyResponse.statusCode);
                //                     console.log('proxyResponse HEADERS: ' + JSON.stringify(proxyResponse.headers));
                //                     sekiResponse.writeHead(proxyResponse.statusCode, proxyResponse.headers);
                //                     
                //                 //    proxyResponse.setEncoding('utf8');
                //                     proxyResponse.on('data', function (chunk) {
                //                         console.log('proxyResponse BODY: ' + chunk);
                //                         data += chunk;
                //                         sekiResponse.write("STUFF"+chunk);    
                //                     });
                //                     
                //                     sekiResponse.end(data);
                //                     proxyRequest.end();
                //                 });
                //                 
                //                 proxyRequest.on('error', function(e) {
                //                     console.log('problem with request: ' + e.message);
                //                 });
                //                 
                
                
                
                
                //  var location = "http://" + config.staticHost + ":"
                //          + config.staticPort + urlParts.pathname;
                //   var proxy = http.createClient(80, request.headers['host'])
                //  redirectHeaders["Location"] = location;
                //  console.log("LOCATION = " + location);
                //  sekiResponse.writeHead(303, redirectHeaders);
                //  sekiResponse.end("303 Redirect to " + "<a href=\"" + location
                //          + "\">new location</a>");
                return;
            }
            
        }