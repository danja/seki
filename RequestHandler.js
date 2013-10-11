// top-level Seki handler

var nools = require("./lib/nools/index"); // rules engine
var config = require('./config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);

var Authenticator = require('./Authenticator');

var GetHandler = require('./GetHandler');
var PostHandler = require('./PostHandler');
var VieJsonHandler = require('./handlers/VieJsonHandler');
var GetBlogHandler = require('./handlers/GetBlogHandler');
var ProxyHandler = require('./ProxyHandler');
var TurtleHandler = require('./TurtleHandler');
var JSONHandler = require('./JSONHandler');

var  flow = nools.compile(__dirname + "/rules/routes.nools", {scope: {log : log, PostHandler: PostHandler}});
//Constructor
function RequestHandler() {

  //  this.reqres = {
  //      "sekiRequest" : sekiRequest,
  //      "sekiResponse" : sekiResponse
  //  };
 //   var ReqRes = flow.getDefined("ReqRes");
  //  this.reqres = new ReqRes(sekiRequest, sekiResponse);
}

RequestHandler.prototype = {

    "handle": function(sekiRequest, sekiResponse) {

   //     var sekiRequest = request;
  //      var sekiResponse = response;
        
        // works here
        sekiRequest.on('end', function() { log.debug("END EVENT!!!!!!!!!"); });
        sekiRequest.on('end', function() { log.debug("END EVENT!!!!!!!!!"); });
        
        log.debug("SEKI REQUEST HEADERS " + JSON.stringify(sekiRequest.headers));
    
        log.debug("REQUEST URL = " + sekiRequest.url);
        log.debug("REQUEST METHOD = " + sekiRequest.method);
        
        log.debug("\ngot past file server\n");
        
        // setup rules engine - need to move this outofscope
       // var 
        

        
        var RequestRouter = flow.getDefined("RequestRouter");
        var Route = flow.getDefined("Route");
        
        
        var session = flow.getSession();
        // can check :  session.print();
        
        var ReqRes = flow.getDefined("ReqRes");
        var reqres = new ReqRes(sekiRequest, sekiResponse);
        session.assert(reqres);
        
        var requestParams = {
            //    "headers" : sekiRequest.headers,
            "method" : sekiRequest.method,
            "path" :  sekiRequest.url
            // "accept" : request.headers["accept"];
            //     "contentType" : request.headers["content-type"];
            //     this.target = '';
        };
        
        // log.debug("headers"+JSON.stringify(requestParams["headers"]));
        log.debug("method"+requestParams["method"]);
        log.debug("path"+requestParams["path"]);
        
     //   session.assert(this.reqres);
      //  var reqres = this.reqres;
        
        var rr = new RequestRouter(requestParams);

        session.assert(rr);
        
        var r = new Route();
        session.assert(r);
        
        // https://github.com/C2FO/nools
        // try flow.getSession().matchUntilHalt(function(err){
        
        var message = "HELLO!";
        var handlerMap= { // move to config?
            "ProxyHandler" : ProxyHandler
        }
        
      //  var sekiRequest =  this.sekiRequest;
      //  var sekiResponse = this.sekiResponse;
     var others = this.others;
     
     //var getRequest = this.getRequest;
     /*
         // this is messing up request/response somehow... 
         session.match(function(err){
          
             if(err){
                 log.debug(err);
             }else{
                 log.debug("*** RULES DONE ***");
               //  log.debug("ROUTE = "+this.targetMap["target"]);
                // this.temp("BOOO");
                 
                 var target = r.route["target"];
                 // targetMap["target"];
                 
                 log.debug("r['route'] = "+JSON.stringify(r.route));
                 log.debug("r = "+JSON.stringify(r));                  
                 
                 if(handlerMap[target]) {
                     log.debug("this is a MATCH");
                     //        var handler = new this.handlerMap[target]();  
                     var options = { "path" : r.route["path"] };
                 //    log.debug("999SEKI REQUEST HEADERS " + JSON.stringify(getRequest().headers));
                 ;
                     log.debug("TARGET = "+target);
                     var handler = new handlerMap[target]();
                     // new ProxyHandler();
                     // this.t();
                     
                     log.debug("x SEKI REQUEST HEADERS " + JSON.stringify(sekiRequest.headers));
         //   log.debug("this.sekiRequest ================="+ this.sekiRequest);
                     // 
                 //    reqres.request.on('end', function() { log.debug("END EVENT!!!!!!!!!"); });           
                     
         handler.handle(sekiRequest, sekiResponse, options);
         
        
                     return;
             }
        //      else {
              log.debug("this NOT is a MATCH");
          //    ( new RequestHandler(this.sekiRequest, this.sekiResponse)).others();
             others(sekiRequest, sekiResponse);
        //  return;
        //     }
             }
             
         });
         
     //    this.others(sekiRequest, sekiResponse);
        return; // ???
        */
       
        
        if (sekiRequest.url.substring(0, 7) == "/store/") {
            var map = { 'path' : sekiRequest.url.substring(6) };
            var handler =  new handlerMap["ProxyHandler"](); // new ProxyHandler();
            handler.handle(sekiRequest, sekiResponse, map);
            
            return;
           
} else {
    this.others(sekiRequest, sekiResponse);
}

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