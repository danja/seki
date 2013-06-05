var fs = require('fs'); 
var Log = require('log'), log = new Log('debug');
var config = require('./config/ConfigDefault').config;
var StoreClient = require("./StoreClient");
var sparqlTemplates = require('./templates/SparqlTemplates');
var freemarker = require('./templates/freemarker');
var rdf = require('../lib/node-rdf/index');

// replaceSimpleTree(null, first);
// graph1.forEach(function(triple) {
//     console.log(triple);
// });


var SparqlUtils  = {

    "createGraph" : function(graphURI) {
    var sparql = "CREATE SILENT GRAPH <"+graphURI+">";
},

/*
 * pushes Turtle data into named graph
 * pull this out into a general utility!
 */
"loadFile" : function(graphURI, file) {
    
    var turtle = fs.readFileSync(file, 'utf8');
    
    var turtleSplit = this.extractPrefixes(turtle)
    
    var replaceMap = {
        "graph" : graphURI,
        "prefixes" : turtleSplit.prefixes,
        "body" : turtleSplit.body
    }
    var sparql = freemarker.render(sparqlTemplates.generalInsertTemplate, replaceMap);
    
    fs.writeFileSync(file+"_dodgy.ttl", sparql);
    // log.debug("SPARQL = \n"+sparql);
    var client = new StoreClient();
    var options = {
        "path" : config.sparqlUpdateEndpoint,
        "method" : "POST"
    };
    var callback = function(res) {
        //   log.debug('STATUS: ' + res.statusCode);
        //  log.debug('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            log.debug('BODY: ' + chunk);
        });
   //     log.info("done.\n");
    }
    log.info("\nLoading data file "+file+" into graph "+graphURI);
    client.send(options, sparql, callback);
},

"extractPrefixes" : function(turtle) {
    var prefixPattern = /(@)(prefix.+)(\.)/gmi;
    var matches;
    var prefixList = [];
    
    while (matches = prefixPattern.exec(turtle)) {
        prefixList.push(matches[2]);
    }
    var prefixes = prefixList.join("\n");
    var body = turtle.replace(/@prefix.+\./gmi,"");
    
    
    //         log.debug("");
    //         log.debug("PREFIXES = "+prefixes);
    //         log.debug("");
    //         log.debug("BODY = "+body);
    //         log.debug("");
    return { "prefixes" : prefixes,
    "body" : body };
    },

/*
 * a simple tree is defined as a set of triples with common subject resource
 * 
 * needs error checks?
 */
"replaceSimpleTree" :function(targetGraph, simpleTreeTurtle) {
    var inputGraph = new rdf.IndexedGraph();
    var parser = new rdf.TurtleParser();
    
    parser.parse(simpleTreeTurtle, null, null, null, inputGraph);

    var tripleArray = inputGraph.toArray();

    var rootResource = tripleArray[0].subject;
    
    var replaceMap = {
        
    }
    console.log(rootResource);
    
}
}
module.exports = SparqlUtils;