/*
 * Utilities for client access to remote Seki
 *
 * at /store
 * entries are each a named graph
 * 
 * Proxies SPARQL requests/response to/from remote endpoint
 *
 */
var fs = require('fs');
var http = require('http');
var config = require('../config/ConfigDefault').config;
var Log = require('log'),
    log = new Log(config.logLevel);
var qs = require("querystring");

var GenericClient = require("./GenericClient");
var client = new GenericClient();

// Constructor
function ProxySparql() {}

var auth = new Buffer("danja:sasha").toString('base64');
var queryPath = '/store' + config.client['queryEndpoint'];

var updateOptions = {
    hostname: config.server['host'],
    port: config.server['port'],
    path: '/store' + config.client['updateEndpoint'],
    method: 'POST',
    headers: {
        'Authorization': 'Basic ' + auth
    }
};

var queryOptions = {
    hostname: config.server['host'],
    port: config.server['port'],
    //   path: '/store'+config.client['queryEndpoint'],
    method: 'GET',
    headers: {
        'Authorization': 'Basic ' + auth
    }
};

// properties and methods
ProxySparql.prototype = {

    "fileUpdate": function(filename, callback) {
        //  log.debug("ProxySparql.fileUpdate called")
        this.update(fs.readFileSync(filename, 'utf8'), callback);
    },

    "update": function(sparql, callback) {
        //   log.debug("update called");
        client.call(updateOptions, sparql, callback);
    },

    "fileQuery": function(filename, callback) {
        //  log.debug("fileQuery called");
        this.query(fs.readFileSync(filename, 'utf8'), callback);
    },

    "query": function(sparql, callback) {
        //  log.debug("query called");
        var encoded = qs.escape(sparql);
        //  log.debug("***** encoded = "+encoded);
        queryOptions.path = queryPath + "?query=" + encoded;
        //  log.debug("***** QUERY options = "+JSON.stringify(queryOptions));
        client.call(queryOptions, '', callback);
    }
}


module.exports = ProxySparql;
