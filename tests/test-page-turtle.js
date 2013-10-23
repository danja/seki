var config = require('../config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);
var testCase  = require('nodeunit').testCase;
var fs = require("fs");

var config = require('../config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);

var Page = require("../client-api/Page");
var ProxySparql = require("../client-api/ProxySparql");
var TestHelpers = require("./TestHelpers");
var helpers = new TestHelpers();

var createPath = '/pages';
var path = '/pages/ApiTest';



exports.testDeleteInit = function(test){ // just to make sure it's cleared
    var callback = function(status, headers, body) {
        test.equal(status, 204, "checking status");
        test.done();
    }
    var page = new Page();
    page.delete(path, callback);
};


exports.testCreate = function(test){ // changed from create - needs extending
    var callback = function(status, headers, body) {
        test.equal(status, 201, "checking status is 201 :Created");
        test.done();
    }
    var page = new Page();
    page.fileCreateTurtle(createPath, 'data/page.ttl', callback);
};


exports.testRead = function(test){ // callback( response.statusCode, JSON.stringify(response.headers), body);
    var page = new Page();
    log.debug("TEST READ");
    page.readTurtle(path, 
            function(status, headers, body) {
                test.equal(status, 200, "checking status is 200 : Ok");
                log.debug("\n*BODY = "+body+"||||");
                helpers.readTurtleTitle(body, function(readTitle){
                                       log.debug("\n\n*** readTitle = "+readTitle);
                                        helpers.readTurtleTitleFile('data/page.ttl', function(titleInFile){
                                          //     log.debug("\n\n*** readTitle = "+readTitle);
                                         //  });
                                           
                                           log.debug("\n\n*** titleInFile = "+titleInFile);
                                                test.equal(readTitle, titleInFile, "title should match");
                                              test.done();

                                       });         
                                    });  
            });
}

/*
exports.testUpdate = function(test){ 
    var callback = function(status, headers, body) {
        test.equal(status, 303, "checking status is 303 :Created");
        test.done();
    }
    var page = new Page();
    page.fileUpdateTurtle(path, 'data/newpage.ttl', callback);
};

exports.testReadUpdated = function(test){
    var callback = function(status, headers, body) {
        test.equal(status, 200, "checking status is 201 :Created");
        var putTitle = helpers.readJsonTitleFile('data/page.json');
        var gotTitle = helpers.readHtmlTitle(body);
        //  log.debug("title ="+gotTitle);
        test.equal(putTitle, gotTitle, "title should match");
        test.done();
    }
    var page = new Page();
    page.readHTML(path, callback);
};
*/
exports.testDeletePage = function(test){ 
    var callback = function(status, headers, body) {
        test.equal(status, 204, "checking status");
        test.done();
    }
    var page = new Page();
    page.delete(path, callback);
};


// exports.testConfirmDeletedPage = function(test){ // do a GET/READ 