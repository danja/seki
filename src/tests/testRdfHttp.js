var assert = require("assert");
var fs = require('fs');
var testHelpers = require("./testHelpers");

//DELETE rdf
// GET rdf - should 404
// PUT rdf
// GET rdf
// GET sparql
// DELETE rdf
// GET rdf - 404

// POST sparql INSERT
// GET rdf
// GET sparql
// DELETE rdf

// append triples
// construct
// ask

var ds;

module.exports = {
	setUp : function(callback) {
		ds = loadDataStrings();

		callback();
	},
	tearDown : function(callback) {
		// clean up
		callback();
	},
	
	// does it have a Turtle representation?
	getRDF : function(test) {
		// options.method = "GET";
		testHelpers.client("GET", {'Accept': 'text/turtle' }, function(status, body) {
		//	body = body.toString().replace(/\s+/g, " ");
			console.log("STATUS=" + status);
		console.log("BODY=" + body);
			test.equal(status, 404, "Should be 404, was "+status);
			test.done();
		});
			//fs.write("data/x.ttl", body);
	//		fs.writeFile("data/x.ttl", body, function(err) {console.log(err);} );});
	
	
	
		
	}
};

function loadDataStrings() {
	return {
		"askEntryQuery" : fs.readFileSync("data/askEntry.rq", 'utf-8'),
		"allEntriesQuery" : fs.readFileSync("data/allEntries.rq", 'utf-8'),
		"entryQuery" : fs.readFileSync("data/entry.rq", 'utf-8'),
		"entryResults" : fs.readFileSync("data/entry.srx", 'utf-8'),
		"entryTurtle" : fs.readFileSync("data/entry.ttl", 'utf-8'),
		"graphEntryQuery" : fs.readFileSync("data/graphEntry.rq", 'utf-8'),
		"insertEntryQuery" : fs.readFileSync("data/insertEntry.rq", 'utf-8')
	};
}