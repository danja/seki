var config = require('../config/ConfigDefault').config;
var Nog = require('../lib/nog/nog'),
log = new Nog(config.logLevel);

//Constructor
function Authenticator() {

}

// properties and methods
Authenticator.prototype = {

    // HTTP Basic Authentication
    // http://en.wikipedia.org/wiki/Basic_access_authentication
    "Basic": function(request) {
        var header = request.headers['authorization'] || '', // get the header
            token = header.split(/\s+/).pop() || '', // and the encoded auth
            // token
            auth = new Buffer(token, 'base64').toString(), // convert from base64
            parts = auth.split(/:/), // split on colon
            username = parts[0],
            password = parts[1];

        if (username == "danja" && password == "sasha") {
            return true;
        }
        return false;
    },

    // Dummy methods for testing
    "T": function(request) { // always true
        // this.value2 = argument + 100;
        log.debug("Auth.true called");
        return true;
    },

    "F": function(request) { // always false
        console.log("Auth.false called");
        return false;
    }
};

module.exports = Authenticator;
