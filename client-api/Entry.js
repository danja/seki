var fs = require('fs');
var http = require('http');
var config = require('../config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);
var qs = require("querystring");

var GenericClient = require("./GenericClient");
var client = new GenericClient();

var queryPath = '/store'+config.client['queryEndpoint'];
var auth = new Buffer("danja:sasha").toString('base64');

var createJSONOptions = {
    hostname: config.server['host'],
    port: config.server['port'],
    // path: '/store'+config.client['updateEndpoint'],
    method: 'POST',
    headers : {
        'Content-Type' : 'application/json',
        'Authorization' : 'Basic '+auth
    }
};

var updateJSONOptions = {
    hostname: config.server['host'],
    port: config.server['port'],
    // path: '/store'+config.client['updateEndpoint'],
    method: 'PUT',
    headers : {
        'Content-Type' : 'application/json',
        'Authorization' : 'Basic '+auth
    }
};

var createHTMLOptions = {
    hostname: config.server['host'],
    port: config.server['port'],
    // path: '/store'+config.client['updateEndpoint'],
    method: 'PUT',
    headers : {
        'Content-Type' : 'text/html',
        'Authorization' : 'Basic '+auth
    }
};

var getHTMLOptions = {
    hostname: config.server['host'],
    port: config.server['port'],
    // path: '/store'+config.client['updateEndpoint'],
    method: 'GET',
    headers : {
        'Accept' : 'text/html',
        'Authorization' : 'Basic '+auth
    }
};

var getJSONOptions = {
    hostname: config.server['host'],
    port: config.server['port'],
    // path: '/store'+config.client['updateEndpoint'],
    method: 'GET',
    headers : {
        'Accept' : 'application/json',
        'Authorization' : 'Basic '+auth
    }
};

// Constructor
function Entry() {
}

// properties and methods
Entry.prototype = {
    
    "fileCreateJSON" : function(path, filename, callback) {
   //     log.debug("fileCreate called")
        this.createJSON(path, fs.readFileSync(filename, 'utf8'), callback);
    },
    
    "createJSON" : function(path, json, callback) {
  //     log.debug("create called");
        createJSONOptions["path"] = path;
        client.call(createJSONOptions, json, callback);
    },
    
    "getJSON" : function(path, callback) {
        //  log.debug("get called with path = "+path);
        getJSONOptions["path"] = path;
        client.call(getJSONOptions, '', callback);
    },
    
    "fileUpdateJSON" : function(path, filename, callback) {
        //     log.debug("fileCreate called")
        this.updateJSON(path, fs.readFileSync(filename, 'utf8'), callback);
    },
    
    "updateJSON" : function(path, json, callback) {
        //     log.debug("create called");
        updateJSONOptions["path"] = path;
        client.call(updateJSONOptions, json, callback);
    },
    
    "fileCreateHTML" : function(path, filename, callback) {
        //     log.debug("fileCreate called")
        this.createHTML(path, fs.readFileSync(filename, 'utf8'), callback);
    },
    
    "createHTML" : function(path, html, callback) {
        //     log.debug("create called");
        createHTMLOptions["path"] = path;
        client.call(createHTMLOptions, html, callback);
    },
    
    "getHTML" : function(path, callback) {
   //  log.debug("get called with path = "+path);
        getHTMLOptions["path"] = path;
        client.call(getHTMLOptions, '', callback);
    },
}


module.exports = Entry;