var assert = require("assert");
var fs = require('fs');
var testHelpers = require("./testHelpers");

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

//append triples
// construct
// ask

	var ds;
	
module.exports = {
	    setUp: function (callback) {
	        ds = loadDataStrings();

	        callback();
	    },
	    tearDown: function (callback) {
	        // clean up
	        callback();
	    },
	    
	    getRDF: function (test) {
	    	//options.method = "GET";
	    	testHelpers.client("GET");


	    	assert.equal(ds.entryTurtle, ds.entryTurtle);
	        test.done();
	    }
};


function loadDataStrings(){
	return { "allEntriesQuery" : fs.readFileSync("data/allEntries.rq", 'utf-8'),
				"entryQuery" : fs.readFileSync("data/entry.rq", 'utf-8'),
				"entryResults" : fs.readFileSync("data/entry.srx", 'utf-8'),
				"entryTurtle" : fs.readFileSync("data/entry.ttl", 'utf-8'),
				"graphEntryQuery" : fs.readFileSync("data/graphEntry.rq", 'utf-8'),
				"insertEntryQuery" : fs.readFileSync("data/insertEntry.rq", 'utf-8')
}; 
}