var request = require('request');
var fs = require('fs');
var config = require('../config/ConfigDefault').config;
var querystring = require("querystring");

var path = '/store'+config.client['queryEndpoint'];

var query = fs.readFileSync('data/askEntry.rq', 'utf8');

query =   querystring.escape(query);

path = 'http://localhost:8081'+path+"?query="+query;

console.log('\n\nQUERY = '+path);

request(path, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body) // Print the google web page.
    } else {
        console.log(error)  ;
    }
});