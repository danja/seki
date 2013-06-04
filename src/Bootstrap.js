/*
 * creates initial graphs and loads default data
 * 
 * TODO add some samples of content
 */

var fs = require('fs'); 
var Log = require('log')
, log = new Log('debug');

var config = require('./config/ConfigDefault').config;

function Bootstrap() {
    createGraphs();
    loadDefaultData();
}

module.exports = Bootstrap;

function createGraphs(){
    var graphLabels = config.graphLabels;

    graphLabels.map(function(graphLabel){ // does a foreach
        createGraph(graphLabel);
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
        "vocabs" : vocabFilenames
    }

    for(graphLabel in defaultDataFiles) {
        var graphURI = config.uriBase+"/"+graphLabel;
        defaultDataFiles[graphLabel].map(function(dataFile){ // does a foreach
            if(endsWith(dataFile, ".ttl") || endsWith(dataFile, ".turtle")){
                loadFile(graphURI, dataFile);
            }
        });
    }
}


    function createGraph(graphLabel) {
        var graphURI = config.uriBase+"/"+graphLabel;
        log.info("creating graph :  "+graphURI);
    }

    function loadFile(graphURI, file) {
        log.info("loading data file "+file+" into graph "+graphURI);
    }

function endsWith(string, suffix) {
    return string.match(suffix+"$")==suffix;
}
