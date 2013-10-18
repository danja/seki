var config = require('../config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);
var testCase  = require('nodeunit').testCase;

var ProxySparql = require("../client-api/ProxySparql");
var fs = require("fs");

exports.testDeleteInit = function(test){
    var callback = function(status, headers, body) {
        test.equal(status, 204, "checking status");
        test.done();
    }
    var proxy = new ProxySparql();
    proxy.fileUpdate('data/deletePage.rq', callback);
};

exports.testEntryNotExistsInit = function(test){
    var callback = function(status, headers, body) {
        test.equal(status, 200, "checking status");
        test.equal(body.indexOf("true"), -1, "body shouldn't contain 'true'");
        test.notEqual(body.indexOf("false"), -1, "body should contain 'false'");
        test.done();
    }
    var proxy = new ProxySparql();
    proxy.fileQuery('data/askPage.rq', callback);
};


exports.testInsert = function(test){
    var callback = function(status, headers, body) {
        test.equal(status, 204, "checking status");
        test.done();
    }
    var proxy = new ProxySparql();
    proxy.fileUpdate('data/insertPage.rq', callback);    
};


exports.testEntryExists = function(test){
    var callback = function(status, headers, body) {
        test.equal(status, 200, "checking status");
        test.notEqual(body.indexOf("true"), -1, "body should contain 'true'");
        test.equal(body.indexOf("false"), -1, "body should not contain 'false'");
        test.done();
    }
    var proxy = new ProxySparql();
    proxy.fileQuery('data/askPage.rq', callback);
};

exports.testDelete = function(test){
    var callback = function(status, headers, body) {
        test.equal(status, 204, "checking status");
        test.done();
    }
    var proxy = new ProxySparql();
    proxy.fileUpdate('data/deletePage.rq', callback);
};

exports.testEntryNotExists = function(test){
    var callback = function(status, headers, body) {
        test.equal(status, 200, "checking status");
        test.equal(body.indexOf("true"), -1, "body shouldn't contain 'true'");
        test.notEqual(body.indexOf("false"), -1, "body should contain 'false'");
        test.done();
    }
    var proxy = new ProxySparql();
    proxy.fileQuery('data/askPage.rq', callback);
};
