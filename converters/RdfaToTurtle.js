var fs = require("fs");
// var jsdom = require('jsdom');
// var RDFaParser = require('../lib/calli-rdfa/RDFaParser.js');

// var html = fs.readFileSync('./big-rdfa.html', 'utf8');

 var html = fs.readFileSync('../tests/data/page.html', 'utf8');
// var p = new jsonld();
// rdfa-api

/*
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
*/



// ../www/js/jquery/jquery-1.10.2.js

/*
jsdom.env(html,
          [
          'jquery-1.10.2.js'
          ]
          , callback);
*/

var request = require('request'),
cheerio = require('cheerio');

var scripts = jquery.rdfa.js
depends on
jquery.uri.js
*  jquery.xmlns.js
*  jquery.curie.js
*  jquery.datatype.js
*  jquery.rdf.js


    var $ = cheerio.load(html);
    
    // Exactly the same code that we used in the browser before:
    $('article').each(function() {
        console.log($(this).text());
    });

/*
var jsdom = require("jsdom");

var jquery = fs.readFileSync("./jquery-1.10.2.js", "utf-8");

jsdom.env({
    url: "http://news.ycombinator.com/",
    scripts: [jquery],
    done: function (errors, window) {
        var $ = window.$;
        console.log("HN Links");
        $("td.title:not(:last) a").each(function() {
            console.log(" -", $(this).text());
        });
    }
});
*/

/*
var jsdom = require('jsdom');



// works "./jquery-1.10.2.js" http://code.jquery.com/jquery.js
jsdom.env(
    "http://nodejs.org/dist/",
    ["jquery-1.10.2.js"],
    function (errors, window) {
        console.log("there have been", window.$("a").length, "nodejs releases!");
    }
);
*/
/*
jsdom.env({
    html: html,
    src: [ 'jquery-1.10.2.js' ],
    done: function(err, window) {
        if (err) console.log("ERROR = "+JSON.stringify(err));
       callback(window);
    }
});

var callback = function (window) {
    
    var $ = window.jQuery;
    console.log("$ = "+$);
    console.log("QWE"+$('article').val());
    
 //   $('article').append("<div class='testing'>Hello World</div>");
 //   console.log($(".testing").text()); // outputs Hello World
};
// jsdom.env(html, callback);
*/
/*
jsdom.env(
    "http://nodejs.org/dist/",
    ["http://code.jquery.com/jquery.js"],
    function (errors, window) {
        console.log("there have been", window.$("a").length, "nodejs releases!");
    }
);
*/


/*
//////////
$('#info').rdf()
// or
// $.rdf.gleaners.push(rdfa);
check comments on rdfquery page - is jsdom example

jquery.rdfa.js
depends on
jquery.uri.js
*  jquery.xmlns.js
*  jquery.curie.js
*  jquery.datatype.js
*  jquery.rdf.js
//  var turtle = $('#content').rdf().databank.dump({ format: 'text/turtle' }),
//////////////////////////////////////



jsdom.env({
    html: "<html><body></body></html>",
    scripts: [
    'http://code.jquery.com/jquery-1.5.min.js'
    ]
}, function (err, window) {
    var $ = window.jQuery;
    
    $('body').append("<div class='testing'>Hello World</div>");
    console.log($(".testing").text()); // outputs Hello World
});

*/