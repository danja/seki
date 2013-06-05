/*
 * creates initial graphs and loads default data
 * 
 * TODO add some samples of content
 */

var fs = require('fs'); 
var Log = require('log'), log = new Log('debug');
var config = require('./config/ConfigDefault').config;
var StoreClient = require("./StoreClient");
var sparqlTemplates = require('./templates/SparqlTemplates');
var freemarker = require('./templates/freemarker');
var SparqlUtils = require("./SparqlUtils");

function Bootstrap() {
    createGraphs();
    loadDefaultData();
}

module.exports = Bootstrap;

function createGraphs(){
    var graphLabels = config.graphLabels;

    graphLabels.map(function(graphLabel){ // does a foreach
        var graphURI = config.uriBase+"/"+graphLabel;
        deleteGraph(graphURI); // split these out later?
        createGraph(graphURI);
    });
}

function loadDefaultData(){ 
    var vocabFilenames = fs.readdirSync(config.vocabsDir);

    for(var i=0;i<vocabFilenames.length;i++){
        vocabFilenames[i] = config.vocabsDir+"/"+vocabFilenames[i];
    }

    var sampleFiles = fs.readdirSync(config.samplesDir);

    var defaultDataFiles = {
     //   "users" : ["../data/bootstrap/usermanagement.ttl"],
       "content" : ["../data/samples/delicious.ttl"]
     //   "vocabs" : ["../www/vocabs/usermanagement.ttl"]
    //    "vocabs" : vocabFilenames
//         foaf.ttl            project.ttl
//         sioc-access.ttl    sioc-types.ttl
//         doap.ttl       index.ttl           sioc-services.ttl  usermanagement.ttl
        
    }

    for(graphLabel in defaultDataFiles) {
        var graphURI = config.uriBase+"/"+graphLabel;
        defaultDataFiles[graphLabel].map(function(dataFile){ // does a foreach
            if(endsWith(dataFile, ".ttl") || endsWith(dataFile, ".turtle")){
                SparqlUtils.loadFile(graphURI, dataFile);
            }
        });
    }
}

// SELECT DISTINCT ?g WHERE { GRAPH ?g { } }

function createGraph(graphURI) {
    var sparql = "CREATE GRAPH <"+graphURI+">";
    doUpdate(sparql);
        log.info("created graph :  "+graphURI);
    }
    
    function deleteGraph(graphURI) {
        var sparql = "DROP GRAPH <"+graphURI+">";
        doUpdate(sparql);
        log.info("deleted graph :  "+graphURI);
    }
    
    var callback = function(res) {
     //   log.debug('STATUS: ' + res.statusCode);
        log.debug('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            log.debug('BODY: ' + chunk);
        });
    }
    
    function doUpdate(sparql){
        var options = {
            "path" : config.sparqlUpdateEndpoint,
            "method" : "POST"
        };

        var client = new StoreClient();
        client.send(options, sparql, callback);
    }



function endsWith(string, suffix) {
    return string.match(suffix+"$")==suffix;
}
