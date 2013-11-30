/*
 * was done for create.js/VIE which used an out-of-date
 * version of JSON-LD
 * consider deleting
 */
var config = require('../config/ConfigDefault').config;
var Nog = require('../lib/nog/nog'),
log = new Nog(config.logLevel);

function LegacyJSONUtils() {}

// static method
LegacyJSONUtils.tweak = function(bodyMap) {
    log.debug("LegacyJSONUtils tweak called");

    for (var i = 0; i < bodyMap["@type"].length; i++) {
        if (bodyMap["@type"][i][0] == "<") {
            bodyMap["@type"][i] = bodyMap["@type"][i].substring(1, bodyMap["@type"][i].length - 1);
        }
    }


    var newMap = {};
    for (var key in bodyMap) {

        var newKey = key;
        var value = bodyMap[key];
        // log.debug("BEFORE = "+key+ " : "+bodyMap[key]);

        if (key[0] == "<") {
            //  log.debug("key HAS <");
            newKey = key.substring(1, key.length - 1);
        }

        // is adequate? consider literals
        if (bodyMap[key] && bodyMap[key][0] == "<") {
            value = bodyMap[key].substring(1, value.length - 1);
        }
        newMap[newKey] = value;
    };
    bodyMap = newMap;

    if (!bodyMap["@id"] && bodyMap["@subject"]) { // old JSON-LD workaround
        bodyMap["@id"] = bodyMap["@subject"];
    };
    return bodyMap;
}

module.exports = LegacyJSONUtils;
