/* rename this to Config.js for custom settings */

/* you should see a .gitignore file in same dir containing just */
/* Config.js */
var config = {

    dev: true, // if true, will halt on uncaught exception

    logLevel: "debug",

    graphLabels: ["meta", "users", "content", "vocabs", "foaf"],
    wwwDir: "../www", // static files
    vocabsDir: "../www/vocabs",
    samplesDir: "../data/samples",
    baked: "../baked",
    //      staticHost : "localhost",
    //      staticPort : 8889

    uriBase: "http://hyperdata.org", // used in the RDF

    /*
     * Settings for the Seki Server (this)
     */
    server: {
        host: process.env.OPENSHIFT_NODEJS_IP,
        port: process.env.OPENSHIFT_NODEJS_PORT
    },


    /*
     * Settings for the remote SPARQL/HTTP server (typically Fuseki on
     * localhost)
     *
     * host: "fuseki-hyperdata.rhcloud.com"
     * port: 80,
process.env.OPENSHIFT_NODEJS_IP
     */
    client: {
        host: process.env.OPENSHIFT_NODEJS_IP,
        port: 15000,
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

exports.config = config;
