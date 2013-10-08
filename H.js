 var config = require('./config/ConfigDefault').config;
 var Log = require('log'), log = new Log(config.logLevel);
 
 function H() {
    }
    
    // properties and methods
    H.prototype = {
        
        "handle" : function(message) {
           log.debug("MESSAGE = "+message);
        }
    }

module.exports = H;