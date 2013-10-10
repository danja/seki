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
// var _ = require('underscore'); // isneeded?
var fs = require('fs'); // filesystem module
var commander = require('commander');

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


var templater = require('./templates/Templater');
// var sparqlTemplates = require('./sparqlTemplates');
var htmlTemplates = require('./templates/HtmlTemplates');


var Admin = require('./admin/Admin');
var config = require('./config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);
var special = require('./config/Special');



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

var RequestHandler = require("./RequestHandler");

/*
 * A little connect chain
 */
var app = connect()
    .use(fileServer())
    .use(function(sekiRequest, sekiResponse) {
        log.debug("SEKI");
        var handler = new RequestHandler();
        handler.handle(sekiRequest, sekiResponse);
       // onRequest(sekiRequest, sekiResponse);
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

// neater way of handling handlers - return handler function name?


/*
 * Callback to handle HTTP requests from browser/API
 */

//function onRequest(sekiRequest, sekiResponse) {

// }

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
