var fs = require("fs");
// var jsdom = require('jsdom');
var RDFaParser = require('../lib/calli-rdfa/RDFaParser.js');

// var html = fs.readFileSync('./big-rdfa.html', 'utf8');

 var html = fs.readFileSync('../tests/data/entry.html', 'utf8');
// var p = new jsonld();
// rdfa-api

var jsdom = require("jsdom").jsdom;
var document = jsdom(html).documentElement;
// var window = document.parentWindow;

var callback = function (errors, window) {
    
    var cb = function(subject, property, value, datatype, lang) {
        console.log(cb);
    };
    
    var parser = new RDFaParser(document);

    parser.parse(window.document, cb)
    window.close();
    
}

jsdom.env(html, callback);