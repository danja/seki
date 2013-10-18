var config = require('../config/ConfigDefault').config;
var Log = require('log'), log = new Log(config.logLevel);
var StoreClient = require("../StoreClient");
var url = require("url");
var util = require("util");
var LegacyJSONUtils = require("./LegacyJSONUtils");
var Utils = require("./Utils");

//Constructor
function CreateHandler() {
}

// properties and methods
CreateHandler.prototype = {
    "handle": function(sekiRequest, sekiResponse) {
        // this.value2 = argument + 100;
        console.log("CreateHandler. called");
    }
}

module.exports = CreateHandler;