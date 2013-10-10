var fs = require('fs');
var http = require('http');
var config = require('../config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);
var qs = require("querystring");

var queryPath = '/store'+config.client['queryEndpoint'];
var auth = new Buffer("danja:sasha").toString('base64');

var createOptions = {
    hostname: config.server['host'],
    port: config.server['port'],
    // path: '/store'+config.client['updateEndpoint'],
    method: 'PUT',
    headers : {
        'Content-Type' : 'application/json',
        'Authorization' : 'Basic '+auth
    }
};

var getOptions = {
    hostname: config.server['host'],
    port: config.server['port'],
    // path: '/store'+config.client['updateEndpoint'],
    method: 'GET',
    headers : {
  //      'Content-Type' : 'application/json',
        'Authorization' : 'Basic '+auth
    }
};

// Constructor
function Entry() {
}

// properties and methods
Entry.prototype = {
    
    "fileCreate" : function(path, filename, callback) {
      //  log.debug("fileCreate called")
        this.create(path, fs.readFileSync(filename, 'utf8'), callback);
    },
    
    "create" : function(path, json, callback) {
      //  log.debug("create called");
        createOptions["path"] = path;
        this.client(createOptions, json, callback);
    },
    
    "get" : function(path, callback) {
     //   log.debug("get called");
        getOptions["path"] = path;
        this.client(getOptions, '', callback);
    },
    
    "client" : function(options, data, callback) {
      //  log.debug("Entry client called")
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
    //    log.debug("writing data")
        request.write(data);
        request.end();
        
    }
}


module.exports = Entry;