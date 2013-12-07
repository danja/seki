/*
 * Utilities for client access to remote Seki
 *
 * low-level access to remote HTTP server (typically the SPARQL store)
 *
 */

var http = require('http');
var config = require('../config/ConfigDefault').config;
var Nog = require('../lib/nog/nog'),
log = new Nog(config.logLevel);

// Constructor
function GenericClient() {}

// properties and methods
GenericClient.prototype = {
    "call": function(options, data, callback) {
        //   log.debug("GenericClient call called")
        //    log.debug("options = "+JSON.stringify(options));
        //      log.debug("data = "+data);
        options["agent"] = false; // see http://nodejs.org/api/http.html#http_http_request_options_callback
        var request = http.request(options, function(response) {
           //        log.debug("Doing Request");
            //          log.debug('STATUS: ' + response.statusCode);
            //          log.debug('HEADERS: ' + JSON.stringify(response.headers));
            response.setEncoding('utf8');
            var body = '';
            response.on('data', function(chunk) {
                //     log.debug("chunk "+chunk);
                body += chunk;
            });
            response.on("end", function(data) {
                if(data) {
                  body += data;
                }
          //      log.debug("body "+body);
                callback(response.statusCode, JSON.stringify(response.headers), body);
            });
        });
        request.on('error', function(e) {
            log.debug('problem with request: ' + e.message);
        });

        if (data && data != '') {
            //       log.debug("writing data");
            request.write(data);
        }
        request.end();
    }
}

module.exports = GenericClient;
