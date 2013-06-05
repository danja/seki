
// consider using 'request' module
var http = require('http');
var Constants = require('./config/Constants');
var config = require('./config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);

// Constructor
function StoreClient() {
}

// properties and methods
StoreClient.prototype = {
    
    "send" : function(options, sparql, callback) {

        log.debug("StoreClient.send");
        
     //   log.debug("callback = "+callback);
        
        for (var name in config.clientOptions) { // merge constants
            if(!options[name]) {
                options[name] = config.clientOptions[name]; 
            }
        }
      //  var respond = 
        
        var clientRequest = http.request(options, function(queryResponse) {
            //                                console.log('STATUS: ' + res.statusCode);
            //                                console.log('HEADERS: ' + JSON.stringify(res.headers));
            queryResponse.setEncoding('utf8');

            if(callback) callback(queryResponse);
        });
        

        // send the update query as POST parameters
        //                          clientRequest.write(qs.stringify({
        //                              "update" : sparql
        //                          }));
        clientRequest.write(sparql);
        
        //                          verbosity(queryPath);
        //                          verbosity(post_body);
        //                          verbosity(sparql);
        
        clientRequest.end();
        
        // handle the response from the SPARQL server
   //     clientRequest.on('response', doCallback(queryResponse));
        
     //   function doCallback(queryResponse){
        //    callback(queryResponse);
     //   }
        // handle the response from the SPARQL server
//         clientRequest.on('response',
//             function(queryResponse) {
//                     this.callback(queryResponse);
//             });
    }
}


module.exports = StoreClient;