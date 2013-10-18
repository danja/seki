/* 
 * crude static fileserver Connect middleware
 * 
 * if file not found i.e. 404 then next() is called (pass-through)
 * 
 * possibly replace with https://github.com/visionmedia/send#readme
 * 
 * OR add :
 * 
 * conneg for no-extension files, i.e. HTML/RDFXML/Turtle
 * caching
 * Range
 * etags etc
 * ...?
*/

var Log = require('log'), log = new Log('debug');
var fs = require('fs'); // filesystem module
var htmlTemplates = require('./templates/HtmlTemplates');
var freemarker = require('./templates/freemarker');

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
        // log.debug("IN MIDDLEWARE");
        
        var url = require('url');
        
        var urlParts = url.parse(req.url, true);
        
        if (req.method != "GET" && !req.method == "HEAD") return next();
           // log.debug("IN MIDDLEWARE "+req.method);
            var tweakedPathname = urlParts.pathname;
            if (urlParts.pathname.substring(0, 1) == "/") {
                tweakedPathname = urlParts.pathname.substring(1);
            }
            var dir = __dirname + "/www/";
            
       //   log.debug("\n\nIN FileServer dir = " + dir);
      //  log.debug("tweakedPathname = " + tweakedPathname);
            var path = require('path').resolve(dir, tweakedPathname);
        //    log.debug("__dirname = " + __dirname);
        //    log.debug("PATH = " + path);

                    var uri = url.parse(req.url).pathname;
                    var filename = p.join(process.cwd(), "www/", unescape(uri));
                    var stat;
                  //  log.debug("filename = "+filename+"\n\n");
                    try {
                        stat = fs.lstatSync(filename); // throws if path doesn't exist
                    } catch (e) {
                        next();
                        return;
        }
        
        if (stat.isFile()) {
            // path exists, is a file
         //   log.debug("\n*** stat.isFile()\n");
            var mimeType = mimeTypes[p.extname(filename).split(".")[1]];
            res.writeHead(200, {'Content-Type': mimeType} );
            
            var fileStream = fs.createReadStream(filename);
            fileStream.pipe(res);
        //    log.debug("FILE PIPED");
            // res.end(); /////////////////////
            return;
        } else if (stat.isDirectory()) {  // path exists, is a directory     
            //   log.debug("\n*** stat.isDirectory()\n");
            var callback = function(err, files) {
                var uri = url.parse(req.url).pathname;
                if(files.indexOf("index.html") != -1) {
                    res.writeHead(303, {"Location": uri+"index.html"});
                 //   res.write(html);
                    res.end();
                };
                var bindings = { "uris" : files };
                var html = freemarker.render(htmlTemplates.uriList, bindings);
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(html);
                res.end();
            }
            fs.readdir(filename, callback)
        //    return;
            } else {
                // Symbolic link, other?
                // TODO: follow symlinks?  security?
                log.debug("FAILED WITH filename = "+filename+"\n\n");
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.write('500 Internal server error\n');
                res.write("FAILED WITH filename = "+filename+"\n\n");
                res.end();
            }
            return;
    //    }
    };
};