var jsonld = require('../lib/jsonld/jsonld');
require('../lib/jsonld/Future');

var config = require('./config/ConfigDefault').config;

// var jsonld = require('../../jsonld.js/js/jsonld');


// *          [base] the base IRI to use.
// *          [format] the format if output is a string:
// *            'application/nquads' for N-Quads.
// *          [loadContext(url, callback(err, url, result))] the context loader.

//Constructor
function JSONHandler() {
}

// properties and methods
JSONHandler.prototype = {
		
  value1: "default_value",
  
  "GET": function() {
   // this.value2 = argument + 100;
	  console.log("JSONHandler.GET called");
  },
  
  "POST": function() {
      // this.value2 = argument + 100;
      console.log("JSONHandler.POST called");
  },
  
  "PUT": function(sekiRequest, sekiResponse) {
      // this.value2 = argument + 100;
      console.log("JSONHandler.PUT called");
      var body = '';
      
      // request body may come in chunks, join them together
      sekiRequest.on('data', function(chunk) {
          body += chunk;
      });
      
      // now received body of request
      sekiRequest .on('end', function() { // need to choose graph - use map of URI templates?
              console.log("BODY = "+body);
           //   body = body.toString();
              var options = { "format" : 'application/nquads' };
              //  options.format = 'application/nquads';
              
              eval("var map = "+body);
              
              options.format = 'application/nquads';
              var processor = new jsonld.JsonLdProcessor();
              processor.normalize(map, options, callback);
              // .done(function(nquads) {
              //  console.log("NTRIPLES = "+nquads);
              // });
              // });
              
              function callback(err, data) {
                  console.log("err = "+err);
                  console.log("data = "+data);
                  console.log("norm = "+JSON.stringify(data));
                  

              }
 // }
});
  }
}

module.exports = JSONHandler;