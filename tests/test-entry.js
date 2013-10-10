var config = require('../config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);
var testCase  = require('nodeunit').testCase;
var fs = require("fs");

var Entry = require("../client-api/Entry");
var ProxySparql = require("../client-api/ProxySparql");
var TestHelpers = require("./TestHelpers");
var helpers = new TestHelpers();

var path = '/seki/ApiTest';


exports.testDeleteEntry = function(test){ // just to make sure it's cleared
    var callback = function(status, headers, body) {
        test.equal(status, 204, "checking status");
        test.done();
    }
    var proxy = new ProxySparql();
    proxy.fileUpdate('data/deleteEntry.rq', callback);
};


exports.testCreate = function(test){
    var callback = function(status, headers, body) {
        test.equal(status, 201, "checking status is 201 :Created");
        test.done();
    }
    var entry = new Entry();
    entry.fileCreate(path, 'data/entry.json', callback);
};

exports.testExists = function(test){
    var callback = function(status, headers, body) {
        test.equal(status, 200, "checking status is 201 :Created");
        var putTitle = helpers.getJsonTitleFile('data/entry.json');
        var gotTitle = helpers.getHtmlTitle(body);
      //  log.debug("title ="+gotTitle);
        test.equal(putTitle, gotTitle, "title should match");
        test.done();
    }
    var entry = new Entry();
    entry.get(path, callback);
 //   var entry = new Entry();
 //   entry.fileCreate('data/entry.json', callback);
};