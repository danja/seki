var config;
var defaultConfig = {

    dev: true, // if true, will halt on uncaught exception

    logLevel: "debug",

    graphLabels: ["meta", "users", "content", "vocabs", "foaf"],
    wwwDir: "../www", // static files
    vocabsDir: "./www/vocabs",
    samplesDir: "./data/samples",
    baked: "../baked",
    //		staticHost : "localhost",
    //		staticPort : 8889

    uriBase: "http://hyperdata.org", // used in the RDF

    handleLegacyJSON: false,

    /*
     * Settings for the Seki Server (this)
     */
    server: {
        host: "localhost",
        port: 8888,
    },


    /*
     * Settings for the remote SPARQL/HTTP server (typically Fuseki on
     * localhost)
     */
    client: {
        host: "localhost",
        port: 3030,
        graphEndpoint: "/seki/data",
        queryEndpoint: "/seki/query",
        queryMethod: "GET",
        updateEndpoint: "/seki/update",
        updateMethod: "POST"
        //  'Content-type': "text/turtle"
        // accept?
    },

    //   queryOptions : {
    //        "path" : "/seki/query",
    //        "method" : "GET"
    //    },
    //    updateOptions : {
    //        "path" : "/seki/update",
    //        "method" : "POST"
    //    },
    // features
    sourceHook: true,
    sourceHookPath: "/seki/x/",
    sourceHookScript: "hook"
};


try {
    config = require('./Config').config;

    for (prop in defaultConfig) { // copy defaults not defined in Config.js
        if (prop in config) {
            continue;
        }
        config[prop] = defaultConfig[prop];
    }

    console.log("Using Config.js");
    console.log(JSON.stringify(config));
} // fall back on config-default.js
catch (e) {
    config = defaultConfig;
    console.log("No Config.js so using ConfigDefault.js");
}



exports.config = config;
