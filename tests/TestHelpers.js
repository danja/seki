var fs = require("fs");
var util = require("util");
var config = require('../config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);
var jsdom = require("jsdom");

// Constructor
function TestHelpers() {
}

// properties and methods
TestHelpers.prototype = {
        
"getJsonTitleFile" : function(filename) {
    var json = fs.readFileSync(filename, 'utf8');
    return this.getJsonTitle(json);
},

"getJsonTitle" : function(json) {
 //   log.debug("checking JSON "+json);
    var object = JSON.parse(json);
    return object["<http://purl.org/dc/terms/title>"];
},

"getHtmlTitleFile" : function(filename) {
    var html = fs.readFileSync(filename, 'utf8');
    return this.getHtmlTitle(html);
},

"getHtmlTitle" :function(html) {
   // var jsdom = require("jsdom");
  //  log.debug("checking HTML "+html);
    var doc = jsdom.jsdom(html);
    return doc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
  //  log.debug("TITLE = "+title);
}

}

module.exports = TestHelpers;


// sys.puts(sys.inspect(handler.dom, false, null));