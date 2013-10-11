var fs = require('fs');
var http = require('http');
var config = require('../config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);
var qs = require("querystring");

var GenericClient = require("./GenericClient");
var client = new GenericClient();

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
   //     log.debug("fileCreate called")
        this.create(path, fs.readFileSync(filename, 'utf8'), callback);
    },
    
    "create" : function(path, json, callback) {
  //     log.debug("create called");
        createOptions["path"] = path;
        client.call(createOptions, json, callback);
    },
    
    "get" : function(path, callback) {
   //  log.debug("get called with path = "+path);
        getOptions["path"] = path;
        client.call(getOptions, '', callback);
    },
}


module.exports = Entry;