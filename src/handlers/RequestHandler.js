/* 
 * # Top-level Seki handler
 */
var nools = require("../lib/nools/index"); // rules engine
var config = require('../config/ConfigDefault').config;
var Nog = require('../lib/nog/nog'),
log = new Nog(config.logLevel);

var Authenticator = require('../core/Authenticator');

// Definitely in use
var GenericHandler = require('./GenericHandler');
var TemplatingResponseHandler = require('./TemplatingResponseHandler');
var ProxyHandler = require('./ProxyHandler');
var PageJsonHandler = require('./PageJsonHandler');

// Not sure
// var GetHandler = require('./GetHandler');
// var GetBlogHandler = require('./GetBlogHandler');
// var TurtleHandler = require('./TurtleHandler');
// var RegistrationHandler = require('./RegistrationHandler');


var notAuthHeaders = {
    "Host": config.sekiHost + ":" + config.sekiPort,
    'Content-Type': 'text/plain',
    'WWW-Authenticate': 'Basic realm="Secure Area"'
};

var flow = nools.compile(__dirname + "/../rules/routes.nools", {
    scope: {
        log: log,
        config: config
    }
});

function RequestHandler() {}

RequestHandler.prototype = {

    "handle": function(sekiRequest, sekiResponse) {

        // works here
     //   sekiRequest.on('end', function() {
      //      log.debug("END EVENT!!!!!!!!!");
     //   });

           log.debug("SEKI REQUEST HEADERS " + JSON.stringify(sekiRequest.headers, null,4));

        log.debug("request = " + sekiRequest.url);
        //       log.debug("REQUEST METHOD = " + sekiRequest.method);

        log.debug("got past file server");

        // setup rules engine - move this outer scope?

        var RequestRouter = flow.getDefined("RequestRouter");
        var Route = flow.getDefined("Route");

        var session = flow.getSession(); // session isaninstance of flow
        // can check :  session.print();

        var accept = sekiRequest.headers["accept"] ? sekiRequest.headers["accept"] : ''; // ????

        var requestParams = {
            //    "headers" : sekiRequest.headers,
            "method": sekiRequest.method.toLowerCase(),
            "path": sekiRequest.url,
            "accept": accept,
            "contentType": sekiRequest.headers["content-type"]
            // Fuseki SAID : 415 Must be application/sparql-update or application/x-www-form-urlencoded (got text/turtle)
        };

        var rr = new RequestRouter(requestParams);
        session.assert(rr);

        // there is redundancy between rr and r!
        var queryOptions = {
            host: config.client["host"],
            port: config.client["port"],
            path: config.client["updateEndpoint"],
            method: sekiRequest.method,
            headers: {
                "accept": sekiRequest.headers["accept"],
            },
            agent: false // see http://nodejs.org/api/http.html#http_http_request_options_callback
            //   headers: sekiRequest.headers
        };

        if (sekiRequest.headers["content-type"]) {
            queryOptions["headers"]["content-type"] = sekiRequest.headers["content-type"];
        }

        var r = new Route(queryOptions);

        session.assert(r);

        var handlerMap = { // move to config? // bypass altogether
            "ProxyHandler": ProxyHandler,
            "GenericHandler": GenericHandler,
            "PageJsonHandler": PageJsonHandler,
            "TemplatingResponseHandler": TemplatingResponseHandler
            //     "JSONToParams" : JSONConverter.jsonToParams
        }

        var others = this.others;

        session.match(function(err) {

            if (err) {
                log.debug(err);
            } else {
                log.debug("*** RULES ***");
                log.debug("ROUTE = " + JSON.stringify(r.route, null, 4));

                var targetFunction = r.route["targetFunction"];

                if (handlerMap[targetFunction]) {
                
                    // 
                    //  log.debug("TARGET = "+targetFunction);
                    var handler = new handlerMap[targetFunction](); //GenericHandler
                    var responseHandler = r.route["responseHandler"];
                    log.debug("rules MATCH, responseHandler = " + responseHandler); // 

                    if (responseHandler) {
                        handler.handle(sekiRequest, sekiResponse, handlerMap[responseHandler], r.route);
                    } else {
                        var options = {
                            "path": r.route["path"]
                        };
                        handler.handle(sekiRequest, sekiResponse, options); //currently for ProxyHandler
                    }
                    return;
                }
                log.debug("--- NO MATCH ---");
                others(sekiRequest, sekiResponse);
            }
        });
        return;
    },

    "others": function(sekiRequest, sekiResponse) {

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
            //  return handler[sekiRequest.method](sekiRequest, sekiResponse);
            return handler[sekiRequest.method](sekiRequest, sekiResponse);
        }

        if (sekiRequest.method == "POST") { //// AUTHENTICATION
            if (sekiRequest.url == "/users/register") {
                var register = new RegistrationHandler();
                register.handle(sekiRequest, sekiResponse);
                return;
            }
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


            log.debug("caught GET");
            var handler = new GetHandler();
            handler.handle(sekiRequest, sekiResponse);
        }

        if (sekiRequest.method == "POST") {
            log.debug("caught POST");
            // var postHandler = Object.create(PostHandler);
            log.debug("calling PostHandler");
            var postHandler = new PostHandler();
            postHandler.handle(sekiRequest, sekiResponse);
        }
    }
};

module.exports = RequestHandler;
