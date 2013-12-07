var config = require('../config/ConfigDefault').config;
var testCase = require('nodeunit').testCase;
var fs = require("fs");

var async = require("async");

var config = require('../config/ConfigDefault').config;
var Nog = require('../lib/nog/nog'),
log = new Nog(config.logLevel);

var NamedGraph = require("../client-api/NamedGraph");
var ProxySparql = require("../client-api/ProxySparql");
var TestHelpers = require("./TestHelpers");
var helpers = new TestHelpers();

// var createPath = '/graphs';
var path = '/graphs/ApiTest';


exports.testDeleteInit = function(test) { // just to make sure it's cleared
    var callback = function(status, headers, body) {
        test.equal(status, 204, "checking status is 204");
        test.done();
    }
    var graph = new NamedGraph();
    graph.delete(path, callback);
};

exports.testCreate = function(test) { // this is POSTing to /graphs - is actually needed?
    var callback = function(status, headers, body) {
        test.equal(status, 201, "checking status is 201 :Created");
        test.done();
    }
    var graph = new NamedGraph();
    graph.fileCreateTurtle(path, 'data/page.ttl', callback);
};



// this is GETing from /graphs - is actually needed?
exports.testRead = function(test) { // callback( response.statusCode, JSON.stringify(response.headers), body);
    //  log.debug("starting testRead");
    read(test, 'data/page.ttl');
    test.done();
   // log.debug("end of first READ *********************************************");
}



exports.testUpdate = function(test) {
    var callback = function(status, headers, body) {
        test.equal(status, 201, "checking status is 201 :Created");
        test.done();
    }
    var graph = new NamedGraph();
    graph.fileUpdateTurtle(path, 'data/newpage.ttl', callback);
}


exports.testUpdated = function(test) { // callback( response.statusCode, JSON.stringify(response.headers), body);
    read(test, 'data/newpage.ttl');
    test.done();
}



var read = function(test, dataFile) {
    var graph = new NamedGraph();
    //  log.debug("READ");
    var titleInFile = '';
    var webTitle = '';
    var turtle = '';
    
    async.series([
    
    function(callback) { // get the title from the file
    //    log.debug("dataFile = "+dataFile);
        helpers.readTurtleTitleFile(dataFile, function(titleF) {
       //        log.debug("\n\n* titleInFile = " + titleF);
            titleInFile = titleF;
        });
        callback(null);
    },
    
    function(callback) { // read the turtle from web
        var cb = function(status, headers, body) {
     //         log.debug("GETing turtle CALLBACK");
            test.equal(status, 200, "checking status is 200 : Ok");
     //           log.debug("\n*BODY = " + body + "||||");
            turtle = body;
            callback(null);
        };
    //    log.debug("GETing turtle path = "+path);
        graph.readTurtle(path, cb);
    },
    
    function(callback) { // read the title from the turtle
        var cb = function(titleW) {
            webTitle = titleW;
       //         log.debug("\n\n*** webTitle = " + webTitle);
            //       log.debug("\n\n*** titleInFile = " + titleInFile);
            callback(null);
        };
        //      log.debug("\n\n+++ readTitle = "+readTitle);
        helpers.readTurtleTitle(turtle, cb);
    },
    
    function(callback) {
      //  log.debug("\n\n*** webTitle = " + webTitle);
      //  log.debug("\n\n* titleInFile = " + titleInFile);
        test.equal(webTitle, titleInFile, "title should match");
        // test.done(); !!!!!
      callback(null);
    }
    ]);
    
}