var fs = require('fs');
var http = require('http');
var config = require('../config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);
var qs = require("querystring");

// Constructor
function ProxySparql() {
}

var auth = new Buffer("danja:sasha").toString('base64');
var queryPath = '/store'+config.client['queryEndpoint'];

var updateOptions = {
    hostname: config.server['host'],
    port: config.server['port'],
    path: '/store'+config.client['updateEndpoint'],
    method: 'POST',
    headers : {
        'Authorization' : 'Basic '+auth
    }
};

var queryOptions = {
    hostname: config.server['host'],
    port: config.server['port'],
 //   path: '/store'+config.client['queryEndpoint'],
    method: 'GET',
    headers : {
        'Authorization' : 'Basic '+auth
    }
};

// properties and methods
ProxySparql.prototype = {
    
"fileUpdate" : function(filename, callback) {
  //  log.debug("ProxySparql.fileUpdate called")
    this.update(fs.readFileSync(filename, 'utf8'), callback);
},

"update" : function(sparql, callback) {
  //  log.debug("update called");
    this.client(updateOptions, sparql, callback);
},

"fileQuery" : function(filename, callback) {
 //   log.debug("fileQuery called");
    this.query(fs.readFileSync(filename, 'utf8'), callback);   
},
 
"query"  : function(sparql, callback) {
  //  log.debug("query called");
    var encoded = qs.escape(sparql);
  //  log.debug("***** encoded = "+encoded);
    queryOptions.path = queryPath + "?query="+encoded ;
 //   log.debug("***** QUERY options = "+JSON.stringify(queryOptions));
    this.client(queryOptions, '', callback);
},

"client" : function(options, data, callback) {
 //  log.debug("client called")
 //   log.debug("options = "+JSON.stringify(options));
 //   log.debug("data = "+data);
    var request = http.request(options, function(response) {
  //      log.debug("Doing Request");
    // console.log('STATUS: ' + response.statusCode);
   // console.log('HEADERS: ' + JSON.stringify(response.headers));
        response.setEncoding('utf8');
        var body ='';
        response.on('data', function (chunk) {
  //          log.debug("chunk "+chunk);
            body += chunk;
        });
        response.on("end", function(data){
            body += data;
           // log.debug("body "+body);
            callback( response.statusCode, JSON.stringify(response.headers), body);
        });
    });
    request.on('error', function(e) {
        log.debug('problem with request: ' + e.message);
    });
  //  log.debug("writing data")
    request.write(data);
    request.end();
  
}
}


module.exports = ProxySparql;