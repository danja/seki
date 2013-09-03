var config = require('./config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);

// Constructor
function GetJsonHandler() {
    
}

// properties and methods
GetJsonHandler.prototype = {
    
    "handle" : function(sekiRequest, sekiResponse) {
        log.debug("GetJsonHandler.handle called");
    }
}

module.exports = GetJsonHandler;