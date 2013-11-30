var fs = require("fs");
var util = require("util");
var config = require('../config/ConfigDefault').config;
var Nog = require('../lib/nog/nog'),
log = new Nog(config.logLevel);
var jsdom = require("jsdom");
// var rdf = require('../lib/node-rdf/lib/rdf');


// Constructor
function TestHelpers() {}

// properties and methods
TestHelpers.prototype = {

    /*
    "readTurtleFile" : function(filename, callback) {
        var turtle = fs.readFileSync(filename, 'utf8');
        return this.readTurtle(turtle, callback);
    },
    
    "readTurtle" :function(turtle, callback) {
        var parser = new TurtleParser(); // new environment
        
    },
    */

    "readTurtleTitleFile": function(filename, callback) {
        //    log.debug("readTurtleTitleFile");
        var turtle = fs.readFileSync(filename, 'utf8');
        return this.readTurtleTitle(turtle, callback);
    },

    "readTurtleTitle": function(turtle, callback) {
        //  log.debug("readTurtleTitle="+turtle);

        var turtleParser = new(require('../lib/node-rdf/lib/TurtleParser').Turtle);


        turtleParser.parse(turtle, function(graph) {
            //   console.log(JSON.stringify(graph)); 

            graph.forEach(function(triple) {
                //  console.log("RESULTS ="+JSON.stringify(triple)); 
                if (triple.predicate.value == "http://purl.org/dc/elements/1.1/title") {
                    //  console.log("TITLE ="+triple.object.value); 
                    callback(triple.object.value);
                    return;
                };
            });
        });
    },

    "getJsonTitleFile": function(filename) {
        var json = fs.readFileSync(filename, 'utf8');
        return this.getJsonTitle(json);
    },

    "getJsonTitle": function(json) {
        //   log.debug("checking JSON "+json);
        var object = JSON.parse(json);
        return object["<http://purl.org/dc/terms/title>"];
    },

    "getHtmlTitleFile": function(filename) {
        var html = fs.readFileSync(filename, 'utf8');
        return this.getHtmlTitle(html);
    },

    "getHtmlTitle": function(html) {
        // var jsdom = require("jsdom");
        
        
        var patt = new RegExp("<title>(.*?)</title>");
        var title = patt.exec(html);
       
   //     var doc = jsdom.jsdom(html);
        
        
        log.debug("checking HTML "+html);
    //    var el = doc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
        log.debug("title = "+title);
        return title;
        //  log.debug("TITLE = "+title);
    }

}

module.exports = TestHelpers;


// sys.puts(sys.inspect(handler.dom, false, null));
