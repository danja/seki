// var nodeunit  = require('nodeunit');
var reporter = require('nodeunit').reporters.
default;

// nodeunit.runFiles(["./test-proxy.js"], {});
// require("./test-proxy");
reporter.run([
    "./test-proxy.js",
    "./test-graph-turtle.js",
    "./test-page-turtle.js",
    "./test-page-json.js",
    "./test-page-html.js"
]);
