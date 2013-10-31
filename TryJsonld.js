var jsonld = require('../lib/jsonld/jsonld');
require('../lib/jsonld/Future');

var data = {
    "@context": {
        "login": "http://purl.org/stuff/usermanagement#login",
        "password": "http://purl.org/stuff/usermanagement#password",
        "fullname": "http://purl.org/stuff/usermanagement#fullname",
        "email": "http://purl.org/stuff/usermanagement#email",
        "profile": "http://purl.org/stuff/usermanagement#profile"
    },

    "@id": "http://hyperdata.org/users/danny",
    "@type": "um:User",
    "um:login": "danny",
    "um:fullname": "Danny Ayers",
    "um:password": "sasha",
    "um:email": "danny.ayers@gmail.com",
    "um:profile": "http://dannyayers.com/foaf.rdf"
};



var options = {};
// { "format" : 'application/nquads' };
//  options.format = 'application/nquads';

options.format = 'application/nquads';
//jsonld.jsonld      var j = jsonld.jsonld();
var processor = new jsonld.JsonLdProcessor();
processor.normalize(data, options, callback);
// .done(function(nquads) {
//  console.log("NTRIPLES = "+nquads);
// });
// });

function callback(err, data) {
    console.log("err = " + err);
    console.log("data = " + data);
}
