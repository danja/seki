#!/bin/env node
/*
 * Main Seki script

 * 
 * see README.md
 */

/*
 * library module imports
 */
var sys = require('sys');
var http = require('http');
var util = require('util'); // isneeded?
var fs = require('fs'); // filesystem module
var commander = require('commander');

var nools = require("./lib/nools/index"); // rules engine

var VieJsonHandler = require('./handlers/VieJsonHandler');
var GetBlogHandler = require('./handlers/GetBlogHandler');

// var qs = require('querystring'); // POST parameters parser
// var static = require('node-static');
var connect = require('connect');
var CORS = require('connect-cors');
// var cors = require('../lib/connect-cors');
// var corser = require('../lib/corser');
// @TODO refactor verbosity out (is also in PostHandler and GetHandler)

/*
 * Seki support scripts imports
 */

var Constants = require('./config/Constants');
var Bootstrap = require('./Bootstrap');
var Utils = require('./Utils');

var Authenticator = require('./Authenticator');
var templater = require('./templates/Templater');
// var sparqlTemplates = require('./sparqlTemplates');
var htmlTemplates = require('./templates/HtmlTemplates');

var TurtleHandler = require('./TurtleHandler');
var JSONHandler = require('./JSONHandler');
var Admin = require('./admin/Admin');
var config = require('./config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);
var special = require('./config/Special');

var GetHandler = require('./GetHandler');
var PostHandler = require('./PostHandler');

var sekiHeaders = {
    "Content-type": "text/html; charset=utf-8",
    "Connection": "keep-alive", // added later
    "Transfer-Encoding": "chunked"
};

var redirectHeaders = {};

var graphHeaders = {
    // "Accept" : "application/rdf+xml",
    "Accept": "text/turtle",
    "Host": config.sekiHost + ":" + config.sekiPort
};

var notAuthHeaders = {
    "Host": config.sekiHost + ":" + config.sekiPort,
    'Content-Type': 'text/plain',
    'WWW-Authenticate': 'Basic realm="Secure Area"'
};

/*
 * mapping URIs to static files on the filesystem
 * 
 */
var files = {
    "/": config.wwwDir + "/index.html",
    "/index": config.wwwDir + "/index.html",
    "/form": config.wwwDir + "/form.html",
    //	"404" : config.wwwDir + "/form.html" // /404.html
};

// var fileServer = connect().use(connect.static(config.wwwDir)).use(
//		connect.directory(config.wwwDir)).use(CORS({})).listen(config.staticPort);

var fileServer = require('./FileServer.js');

var dummy = require('./Dummy.js');

log.debug("logging...");
//connect()
//.use(connect.logger('dev'))
//.use(connect.static('public'))
//.use(function(req, res){
//    res.end('hello world\n');
//})

commander
    .version('pre-alpha')
    .option('--init', 'initialize (beware - wipes data)')
    .parse(process.argv);

if (commander.init) {
    console.log('*** INITIALIZING ***');
    Bootstrap();
}

/*
 * A little connect chain
 */
var app = connect()
    .use(fileServer())
    .use(function(sekiRequest, sekiResponse) {
        log.debug("SEKI");
        onRequest(sekiRequest, sekiResponse);
    });

    app.listen(config.server["port"], config.server["host"]);

log.debug("Seki serving on " + config.server["host"] + ":" + config.server["port"]);
log.debug("addressing SPARQL on " + config.client["host"] + ":" + config.client["port"] );

// When deployed, keep running despite exceptions
if(!config.dev) {
    process.on('uncaughtException', function(err) {
        console.error(err.stack);
    });
}

// var hLog = function(message) { console.log(message) };    
 // var h = function(target) { target("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH"); }

// neater way of handling handlers - return handler function name?
var flow = nools.compile(__dirname + "/rules/routes.nools", {scope: {log : log, PostHandler: PostHandler}});


/*
 * Callback to handle HTTP requests from browser/API
 */

function onRequest(sekiRequest, sekiResponse) {
    log.debug("SEKI REQUEST HEADERS " + JSON.stringify(sekiRequest.headers));
    log.debug("REQUEST URL = " + sekiRequest.url);
    log.debug("REQUEST METHOD = " + sekiRequest.method);

    log.debug("\ngot past file server\n");
    
    // setup rules engine
    var RequestRouter = flow.getDefined("RequestRouter");
    var session = flow.getSession();
    // can check :  session.print();
   
   
    var rs = new RequestRouter(sekiRequest);
    
    session.assert(rs);
    
    session.match(function(err){
        if(err){
            console.error(err);
        }else{
            console.log("*** RULES DONE ***");
        }
    });
    

    if (sekiRequest.url.substring(0, 7) == "/store/") {
        var targetUrl = sekiRequest.url.substring(6);
        
        log.debug("proxying to "+config.client["host"]+":"+config.client["port"]+targetUrl);
        
        var proxyOptions = {
            host: config.client["host"],
            port: config.client["port"],
            path: sekiRequest.url.substring(6),
            method: sekiRequest.method,
            headers: sekiRequest.headers
        };
        var proxyRequest = http.request(proxyOptions, function(proxyResponse) {
            
            sekiResponse.writeHead(proxyResponse.statusCode, proxyResponse.headers);
            
            proxyResponse.on('data', function(chunk) {
                sekiResponse.write(chunk, 'binary');
            });
            
            proxyResponse.on('end', function() {
                sekiResponse.end();
            });
            
        });

        proxyRequest.on('error', function(e) {
            log.debug('problem with proxy request: ' + e.message);
        });
        
        sekiRequest.on('data', function(chunk) {
            proxyRequest.write(chunk);
        });
        
        sekiRequest.on('end', function() {
            proxyRequest.end();
        });
        return;
    }

    var auth = new Authenticator();
    
    if (sekiRequest.method == "OPTIONS") {
        log.debug("OPTIONS");
        var optionsHeaders = {
            "Allow": "OPTIONS, GET, HEAD, POST, PUT, DELETE" // , TRACE
       //     Access-Control-Allow-Origin: 
       //     Access-Control-Max-Age: 2520
       //     Access-Control-Allow-Methods: PUT, DELETE, XMODIFY
        };
        sekiResponse.writeHead(200, optionsHeaders);
        sekiResponse.end("200 Ok");
        return;
    }  
    
    if (sekiRequest.method == "PUT") {
        log.debug("PUT");
        var handler = new JSONHandler();
        return handler[sekiRequest.method](sekiRequest, sekiResponse);
}

    if (sekiRequest.method == "POST") {
        if (!auth.Basic(sekiRequest)) {
            sekiResponse.writeHead(401, notAuthHeaders);
            sekiResponse.end("401 Not Authorized");
            return;
        }
    }
    // handle admin requests/commands
    if (sekiRequest.method == "POST") {
        if (sekiRequest.url.substring(0, 7) == "/admin/") {
            var command = sekiRequest.url.substring(7);
            var admin = new Admin(sekiRequest, sekiResponse);
            if (admin[command]) {
                sekiResponse.writeHead(202, sekiHeaders);
                sekiResponse.end("202 Accepted for command '" + command + "'");
                admin[command](); // perhaps this should spawn a separate OS
                // process?
                return;
            } else {
                sekiResponse.writeHead(404, sekiHeaders);
                sekiResponse.end("404 Not Found. Admin command '" + command + "' unknown");
                return;
            }
        }
    }

    // the client that will talk to the SPARQL server
    // var client = http.createClient(config.sparqlPort, config.sparqlHost);

    // the URI used in the RDF
    // var resource = config.uriBase + sekiRequest.url;
    // console.log("RESOURCE = " + resource);

    // this is duplicated in GetHandler.js
    var accept = sekiRequest.headers["accept"]; ///////////////////// is accept!!!


    // TODO pull these out into separate per-media type handlers
    // use pattern as for JSONHandler
    if (sekiRequest.method == "GET") {
        var key = "/vie-json";
        if (sekiRequest.url.substring(0, key.length) == key) {
            var handler = new VieJsonHandler();
            handler.handle(sekiRequest, sekiResponse);
            return;
        }
        // special case for blog index page
            if (sekiRequest.url.substring(0, key.length) == "/blog") {
                var handler = new GetBlogHandler();
                handler.handle(sekiRequest, sekiResponse);
                return;
            }
        
//         for(key in special) {
//             log.debug("KEY = "+key);
//             if (sekiRequest.url.substring(0, key.length) == key) {
//         //    if(Special[key]){
//                 log.debug("SPECIAL MATCH = "+key);
//                 var handler = special[key];
//                 log.debug("special = "+util.inspect(special));
//                 log.debug("handler = "+util.inspect(handler));
//                 handler.handle(sekiRequest, sekiResponse);
//                 return;
//         }
//         }
        var handler = new GetHandler();
        handler.handle(sekiRequest, sekiResponse);
    }

    if (sekiRequest.method == "POST") {
        // var postHandler = Object.create(PostHandler);
        log.debug("calling PostHandler");
        var postHandler = new PostHandler();
        postHandler.handle(sekiRequest, sekiResponse);
    }
}

/*
 * Reads a file from the filesystem and writes its data to response (typically a
 * browser)
 * 
 * IS THIS BEING USED???
 */

function serveFile(sekiResponse, status, file) {
    log.debug("FILE = " + file);

    fs.readFile(file, function(err, data) {
        if (err) {
            data = "Error :" + err;
            status = 500;
        }
        sekiResponse.writeHead(status, sekiHeaders); // queryResponse.headers
        sekiResponse.write(data, 'binary');
        sekiResponse.end();
    });
}

// }
