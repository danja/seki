/* 
 * # Top-level Seki handler
 */
var nools = require("../lib/nools/index"); // rules engine
var config = require('../config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);

var Authenticator = require('../Authenticator');

var GenericHandler = require('./GenericHandler');
var CreateHandler = require('./CreateHandler');
// var JSONConverter = require('./JSONConverter');

var GetHandler = require('./GetHandler');
var PostHandler = require('./PostHandler');
var VieJsonHandler = require('./VieJsonHandler');
var GetBlogHandler = require('./GetBlogHandler');
var ProxyHandler = require('./ProxyHandler');
var TurtleHandler = require('./TurtleHandler');

var RegistrationHandler = require('./RegistrationHandler');

var notAuthHeaders = {
    "Host": config.sekiHost + ":" + config.sekiPort,
    'Content-Type': 'text/plain',
    'WWW-Authenticate': 'Basic realm="Secure Area"'
};

var  flow = nools.compile(__dirname + "/../rules/routes.nools", {scope: {log : log, PostHandler: PostHandler}});

function RequestHandler() {
}

RequestHandler.prototype = {

    "handle": function(sekiRequest, sekiResponse) {
        
        // works here
   //     sekiRequest.on('end', function() { log.debug("END EVENT!!!!!!!!!"); });
        
  //      log.debug("SEKI REQUEST HEADERS " + JSON.stringify(sekiRequest.headers));
    
        log.debug("REQUEST URL = " + sekiRequest.url);
 //       log.debug("REQUEST METHOD = " + sekiRequest.method);
        
        log.debug("\ngot past file server\n");
        
        // setup rules engine - move this outer scope?
 
        var RequestRouter = flow.getDefined("RequestRouter");
        var Route = flow.getDefined("Route");

        var session = flow.getSession(); // session isaninstance of flow
        // can check :  session.print();

        var accept = sekiRequest.headers["accept"] ? sekiRequest.headers["accept"] : '';
        var requestParams = {
            //    "headers" : sekiRequest.headers,
            "method" : sekiRequest.method,
            "path" :  sekiRequest.url,
            "headers" : sekiRequest.headers,
            "accept" : accept,
            "contentType" : sekiRequest.headers["content-type"]
            //     this.target = '';
        };
        
        // log.debug("headers"+JSON.stringify(requestParams["headers"]));
        log.debug("*** requestParams "+JSON.stringify(requestParams));
        
        var rr = new RequestRouter(requestParams);

        session.assert(rr);
        
        var r = new Route();
        session.assert(r);

        var handlerMap= { // move to config? // bypass altogether
            "ProxyHandler" : ProxyHandler,
            "GenericHandler" : GenericHandler,
            
            "CreateHandler" : CreateHandler,
       //     "JSONToParams" : JSONConverter.jsonToParams
        }
        
     var others = this.others;

         session.match(function(err){
          
             if(err){
                 log.debug(err);
             }else{
                 log.debug("*** RULES DONE ***");
                 var targetFunction = r.route["targetFunction"];
                 log.debug("TARGET = "+targetFunction);
                 log.debug("r['route'] = "+JSON.stringify(r.route));
                 log.debug("r = "+JSON.stringify(r));                  
                 
                 if(handlerMap[targetFunction]) {
                     log.debug("this is a MATCH");
                     var options = { "path" : r.route["path"] };
                     log.debug("TARGET = "+targetFunction);
                     var handler = new handlerMap[targetFunction]();
                     var responseHandler = r.route["responseHandler"];
                     log.debug("responseHandler = "+responseHandler);
                     if(responseHandler) {                
                         handler.handle(sekiRequest, sekiResponse, handlerMap[responseHandler]);
                     } else {            
                        handler.handle(sekiRequest, sekiResponse, options);
                     }
                     return;
             }
              log.debug("this NOT is a MATCH");
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
            if(sekiRequest.url == "/users/register") {
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