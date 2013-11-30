var config = require('./config/ConfigDefault').config;
var Nog = require('../lib/nog/nog'),
log = new Nog(config.logLevel);
//var htmlTemplates = require('../templates/HtmlTemplates');
var saxer = require('./srx2map_multi');
var freemarker = require('../templates/freemarker');

// Constructor
function ResponseServer() {

}

// properties and methods
ResponseServer.prototype = {

    "serve": function(sekiResponse, queryResponse, viewTemplate, headers) {
        if (!viewTemplate) {
            viewTemplate = htmlTemplates.contentTemplate;
        };

        var stream = saxer.createStream();

        sekiResponse.pipe(stream);

        queryResponse.on('data', function(chunk) {
            //  console.log("CHUNK: " + chunk);
            stream.write(chunk);
        });

        queryResponse.on('end', function() {

            stream.end();

            var bindings = stream.bindings;

            log.debug("bindings " + JSON.stringify(bindings));

            log.debug("viewTemplate = " + viewTemplate);
            sekiResponse.writeHead(200, headers);

            var body = freemarker.render(viewTemplate, bindings);

            //    log.debug("viewTemplate = "+viewTemplate);
            //    log.debug("bindings = "+JSON.stringify(bindings));
            sekiResponse.end(body);

        });
    }
}

module.exports = ResponseServer;
