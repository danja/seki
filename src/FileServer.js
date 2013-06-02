// crude static fileserver Connect middleware
// if file not found i.e. 404 then next() is called
// possible replace with https://github.com/visionmedia/send#readme

var Log = require('log')
, log = new Log('debug');
var fs = require('fs'); // filesystem module

var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"};
    var p = require('path');

exports = module.exports = function fileServer(){
//  options = options || {};
    
    return function fileServer(req, res, next) {
        log.debug("IN MIDDLEWARE");
        
        var url = require('url');
        
        var urlParts = url.parse(req.url, true);
        
        if (req.method != "GET" && !req.method == "HEAD") return next();
            log.debug("IN MIDDLEWARE "+req.method);
            var tweakedPathname = urlParts.pathname;
            if (urlParts.pathname.substring(0, 1) == "/") {
                tweakedPathname = urlParts.pathname.substring(1);
            }
            var dir = __dirname + "/../www/";
            
            log.debug("IN MIDDLEWARE dir = " + dir);
            console.log("tweakedPathname = " + tweakedPathname);
            var path = require('path').resolve(dir, tweakedPathname);
            console.log("__dirname = " + __dirname);
            console.log("PATH = " + path);

                    var uri = url.parse(req.url).pathname;
                    var filename = p.join(process.cwd(), "../www/", unescape(uri));
                    var stat;
                    
                    try {
                        stat = fs.lstatSync(filename); // throws if path doesn't exist
                    } catch (e) {
                        next();
                        return;
        }
        
        if (stat.isFile()) {
            // path exists, is a file
            var mimeType = mimeTypes[p.extname(filename).split(".")[1]];
            res.writeHead(200, {'Content-Type': mimeType} );
            
            var fileStream = fs.createReadStream(filename);
            fileStream.pipe(res);
           // log.debug("HERE");
            // res.end(); /////////////////////
            return;
        } else if (stat.isDirectory()) {
            // path exists, is a directory
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write('Index of '+uri+'\n');
            res.write('TODO, show index?\n');
            res.end();
        //    return;
            } else {
                // Symbolic link, other?
                // TODO: follow symlinks?  security?
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.write('500 Internal server error\n');
                res.end();
            }
            return;
    //    }
    };
};