var Nog = require('./nog'),
log = new Nog("DEBUG");

console.log("\nDEFAULTS\n");
log.debug("log.debug called");
log.info("log.info called");
log.warning("log.warn called");
log.error("log.error called");

var options = {
    "marker" : "", // start of line 
    "color" : false,
    "date": false,
    "filename" : false,
    "line_column" : false,
    "level" : false
};

log = new Nog("DEBUG",options);

console.log("\nCUSTOM/MINIMAL\n");
log.debug("log.debug called");
log.info("log.info called");
log.warning("log.warn called");
log.error("log.error called");

options = {
    "marker" : "*** ", // start of line 
    "color" : true,
    "date": true,
    "filename" : true,
    "line_column" : true,
    "level" : true
};

log = new Nog("DEBUG",options);

console.log("\nCUSTOM/EVERYTHING\n");
log.debug("log.debug called");
log.info("log.info called");
log.warning("log.warn called");
log.error("log.error called");
