var fs = require('fs');

var Constants = require('../config/Constants');

var TurtleHandler = require('../handlers/TurtleHandler');
var config = require('../config/ConfigDefault').config;
var FileReader = require('./FileReader');


// Constructor
function Admin(sekiRequest, sekiResponse) {
    this.sekiRequest = sekiRequest;
    this.sekiResponse = sekiResponse;
}

// properties and methods
Admin.prototype = {

    value1: "default_value",

    "testCall": function() {
        console.log("Admin.testCall called");
    },
    "bake": function() { // perhaps this should spawn a separate OS process?

        // console.log("Admin.bake called");

        var handler = new TurtleHandler();
        handler.getGraphs(function(bindings) {
            // console.log(JSON.stringify(bindings, null, '\t'));
            var meta = "@prefix stuff: <http://purl.org/stuff> .\n\n";
            for (x in bindings) {
                // console.log(bindings[x].graph);
                var uri = bindings[x].graph;

                if (uri.indexOf(config.uriBase) == 0) {
                    meta += "<" + uri + "> a stuff:Graph .\n";

                    var filename = config.baked + uri.substring(config.uriBase.length);
                } else {
                    console.log("WARNING: graph " + uri + " not in current domain");
                    continue;
                }
                // console.log("filename = " + filename);
                // filename needs to be prefixed with __dirname ??
                var dirs = filename.split("/");
                //	console.log("dirs = " + dirs);
                var dir = "";
                for (var i = 0; i < dirs.length - 1; i++) {
                    dir += dirs[i];
                    console.log("trying to create dir " + dir);
                    fs.mkdir(dir); // NEED OPTIONS HERE??
                    dir += "/";
                }

                var options = {
                    flags: 'w',
                    encoding: 'utf8',
                    mode: 0666
                };
                var stream = fs.createWriteStream(filename + ".ttl", options);
                stream.on('error', function(e) {
                    console.log("Error writing to file : " + e);
                });
                stream.write("# Baked by Seki \n\n");

                var handler = new TurtleHandler();
                handler.GET(uri, stream); // includes a stream.end()
            }

            // write meta
            var stream = fs.createWriteStream(config.baked + "/meta.ttl",
                options);
            stream.on('error', function(e) {
                console.log("Error writing to metafile : " + e);
            });
            stream.write("# Graphs baked by Seki \n\n");
            stream.write(meta);
            stream.end();
        });

    },
    "unbake": function() { // perhaps this should spawn a separate OS process?
        // this.value2 = argument + 100;
        console.log("Admin.unbake called");

        var fileReader = new FileReader();
        fileReader.treeWalk(config.baked, function(file, next) {
            // console.log("File = " + file);
            var dot = file.lastIndexOf(".");
            if (dot != -1) {
                var type = Constants.typeForExtension[file.substring(dot)];

                // console.log("ext = " + file.substring(dot));
                if (type) {
                    //	console.log("type = " + type);
                    fs.readFile(file, 'utf8', function(err, data) {
                        if (err) {
                            console.error("Could not open file: %s", err);
                        } else {
                            var uri = config.uriBase + file.substring(config.baked.length, dot);

                            // PUT into store
                            // NB should switch onto the appropriate content handler
                            // currently preset for turtle
                            var handler = new TurtleHandler();

                            handler.PUT(uri, data,
                                function(statusCode, headers) {
                                    console.log("PUT returned a " + statusCode);
                                });
                        }
                    });
                }
            }
            next(false); // weird, but it works
        }, function(msg) {
            console.log("Done = " + msg);
        });
    }
};

module.exports = Admin;
