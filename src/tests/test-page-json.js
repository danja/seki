var config = require('../config/ConfigDefault').config;
var Log = require('log'),
    log = new Log(config.logLevel);
var testCase = require('nodeunit').testCase;
var fs = require("fs");

var config = require('../config/ConfigDefault').config;
var Nog = require('../lib/nog/nog'),
log = new Nog(config.logLevel);

var Page = require("../client-api/Page");
var ProxySparql = require("../client-api/ProxySparql");
var TestHelpers = require("./TestHelpers");
var helpers = new TestHelpers();

var createPath = '/pages';
var path = '/pages/ApiTest';


exports.testDeletePage = function(test) { // just to make sure it's cleared
   // log.debug("deleting via proxy");
    var callback = function(status, headers, body) {
        test.equal(status, 204, "checking status");
        test.done();
    }
    //var proxy = new ProxySparql();
   // proxy.fileUpdate('data/deletePage.rq', callback);
   var page = new Page();
   page.delete(path, callback);
};

exports.testCreate = function(test) { // changed from create - needs extending
    var callback = function(status, headers, body) {
        test.equal(status, 201, "checking status is 201 :Created");
        test.done();
    }
    var page = new Page();
    page.fileCreateJSON(createPath, 'data/page.json', callback);
};



exports.testUpdate = function(test) {
    var callback = function(status, headers, body) {
        test.equal(status, 201, "checking status is 201 :Created");
        test.done();
    }
    var page = new Page();
    page.fileUpdateJSON(path, 'data/page.json', callback);
};


exports.testExists = function(test) {
    var callback = function(status, headers, body) {
        test.equal(status, 200, "checking status is 200");
     //   var fileTitle = helpers.getJsonTitleFile('data/page.json');
    //    var webTitle = helpers.getJsonTitle(body);
    //    test.equal(fileTitle, webTitle, "title should match");
    //    test.done();
    }
    var page = new Page();
    page.readJSON(path, callback);
};


