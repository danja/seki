// var nodeunit  = require('nodeunit');
var reporter = require('nodeunit').reporters.
default;

// nodeunit.runFiles(["./test-proxy.js"], {});
// require("./test-proxy");
reporter.run([

    "./test-page-turtle.js",
    "./test-page-json.js",
    "./test-proxy.js"

]);
