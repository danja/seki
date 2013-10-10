var config = require('../config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);
var testCase  = require('nodeunit').testCase;

var ProxySparql = require("../client-api/ProxySparql");
var fs = require("fs");
//  sparqlUpdate(fs.readFileSync('data/deleteEntry.rq', 'utf8'));
// sparqlAsk(fs.readFileSync('data/askEntry.rq', 'utf8'), 'false');

exports.testDeleteInit = function(test){
    var callback = function(status, headers, body) {
        test.equal(status, 204, "checking status");
        test.done();
    }
    var proxy = new ProxySparql();
    proxy.fileUpdate('data/deleteEntry.rq', callback);
};

exports.testEntryNotExistsInit = function(test){
    var callback = function(status, headers, body) {
        test.equal(status, 200, "checking status");
        test.equal(body.indexOf("true"), -1, "body shouldn't contain 'true'");
        test.notEqual(body.indexOf("false"), -1, "body should contain 'false'");
        test.done();
    }
    var proxy = new ProxySparql();
    proxy.fileQuery('data/askEntry.rq', callback);
};


exports.testInsert = function(test){
    var callback = function(status, headers, body) {
        test.equal(status, 204, "checking status");
        test.done();
    }
    var proxy = new ProxySparql();
    proxy.fileUpdate('data/insertEntry.rq', callback);    
};


exports.testEntryExists = function(test){
    var callback = function(status, headers, body) {
        test.equal(status, 200, "checking status");
        test.notEqual(body.indexOf("true"), -1, "body should contain 'true'");
        test.equal(body.indexOf("false"), -1, "body should not contain 'false'");
        test.done();
    }
    var proxy = new ProxySparql();
    proxy.fileQuery('data/askEntry.rq', callback);
};

exports.testDelete = function(test){
    var callback = function(status, headers, body) {
        test.equal(status, 204, "checking status");
        test.done();
    }
    var proxy = new ProxySparql();
    proxy.fileUpdate('data/deleteEntry.rq', callback);
};

exports.testEntryNotExists = function(test){
    var callback = function(status, headers, body) {
        test.equal(status, 200, "checking status");
        test.equal(body.indexOf("true"), -1, "body shouldn't contain 'true'");
        test.notEqual(body.indexOf("false"), -1, "body should contain 'false'");
        test.done();
    }
    var proxy = new ProxySparql();
    proxy.fileQuery('data/askEntry.rq', callback);
};
