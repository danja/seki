var fs = require('fs');
var util = require('util')
var Log = require('log'),
    log = new Log('debug');
var config = require('./config/ConfigDefault').config;

var sparqlTemplates = require('./templates/SparqlTemplates');
var freemarker = require('./templates/freemarker');
// var rdf = require('./lib/node-rdf/lib/rdf');

// replaceSimpleTree(null, first);
// graph1.forEach(function(triple) {
//     console.log(triple);
// });

// var client = new StoreClient();

function SparqlUtils() {
    //  log.debug("StoreClient = "+StoreClient);
}

SparqlUtils.extractPrefixes = function(turtle) {
    // log.debug("extractPrefixes TURTLE "+turtle);
    var prefixPattern = /(@)(prefix.+)(\.)/gmi;
    var matches;
    var prefixList = [];

    while (matches = prefixPattern.exec(turtle)) {
        prefixList.push(matches[2]);
    }
    var prefixes = prefixList.join("\n");
    var body = turtle.replace(/@prefix.+\./gmi, "");
    //                 log.debug("");
    //                 log.debug("PREFIXES = "+prefixes);
    //                 log.debug("");
    //                 log.debug("BODY = "+body);
    //                 log.debug("");
    return {
        "prefixes": prefixes,
        "body": body
    };
};

///////////////////////////////////
// TODO Refactor out common pieces
////////////////////////////////////
SparqlUtils.prototype = {

    "createGraph": function(graphURI) {
        var sparql = "CREATE SILENT GRAPH <" + graphURI + ">";
    },
    "turtleToInsert": function(graphURI, turtle) {
        // log.debug("turtleToInsert "+turtle);
        var turtleSplit = SparqlUtils.extractPrefixes(turtle);

        var replaceMap = {
            "graph": graphURI,
            "prefixes": turtleSplit.prefixes,
            "body": turtleSplit.body
        }
        var sparql = freemarker.render(sparqlTemplates.turtleInsertTemplate, replaceMap);
        return sparql;
    },

    "turtleToReplace": function(graphURI, resourceURI, turtle) {
        //   log.debug("turtleToReplace "+turtle);
        var turtleSplit = SparqlUtils.extractPrefixes(turtle);

        var replaceMap = {
            "graph": graphURI,
            "uri": resourceURI,
            "prefixes": turtleSplit.prefixes,
            "body": turtleSplit.body
        }
        var sparql = freemarker.render(sparqlTemplates.simpleReplaceTemplate, replaceMap);
        return sparql;
    },


    "resourceToDelete": function(graphURI, resourceURI) {
        log.debug("resourceToDelete " + resourceURI + " in graph " + graphURI);

        var replaceMap = {
            "graph": graphURI,
            "uri": resourceURI
        }
        var sparql = freemarker.render(sparqlTemplates.resourceDeleteTemplate, replaceMap);
        return sparql;
    },



    /*
     * a resource here means the set of triples <knownResource> ?p ?o
     */
    "resourceToReplace": function(graphURI, resourceURI, turtle) {
        var turtleSplit = SparqlUtils.extractPrefixes(turtle);

        var replaceMap = {
            "graph": graphURI,
            "uri": resourceURI,
            "prefixes": turtleSplit.prefixes,
            "body": turtleSplit.body
        };
        var sparql = freemarker.render(sparqlTemplates.simpleReplaceTemplate, replaceMap);
        return sparql;
    }
}
module.exports = SparqlUtils;
