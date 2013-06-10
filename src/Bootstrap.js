/*
 * creates initial graphs and loads default data
 * 
 * TODO add some samples of content
 */

var fs = require('fs'); 
var config = require('./config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);
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
       "users" : ["../data/bootstrap/usermanagement.ttl"],
       "content" : ["../data/samples/delicious.ttl"],
    //    "vocabs" : ["../www/vocabs/sioc-types.ttl"]
      "vocabs" : vocabFilenames,
      "misc" : ["../www/vocabs/commontag.ttl"] // for experimentation
       //      sioc.ttl  sioc-types.ttl 
        
    }
  //  var sparqlUtils = new SparqlUtils();
  var client = new StoreClient();
  //  log.debug("UTILSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS");
    for(graphLabel in defaultDataFiles) {
        var graphURI = config.uriBase+"/"+graphLabel;
        defaultDataFiles[graphLabel].map(function(dataFile){ // does a foreach
            if(endsWith(dataFile, ".ttl") || endsWith(dataFile, ".turtle")){
                
                client.loadFile(graphURI, dataFile);
            }
        });
    }
}

// SELECT DISTINCT ?g WHERE { GRAPH ?g { } }

function createGraph(graphURI) {
    var sparql = "CREATE GRAPH <"+graphURI+">";
    doUpdate(sparql);
    sparql = "INSERT DATA { GRAPH <"+graphURI+"> { <"+graphURI+"> a   <http://jena.hpl.hp.com/2005/11/Assembler#Model> } }";
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
//         var options = {
//             "path" : config.sparqlUpdateEndpoint,
//             "method" : "POST"
//         };

       var client = new StoreClient();
       client.send(config.updateOptions, sparql, callback);
    }



function endsWith(string, suffix) {
    return string.match(suffix+"$")==suffix;
}
