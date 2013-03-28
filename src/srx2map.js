/*
 * REPLACE WITH SRX2MAP_MULTI when HTML bits figured out
 * 
 * THIS VERSION ASSUMED ONLY ONE VALUE FOR EACH BINDING NAME
 * 
 * Parses SPARQL XML results, converts bindings to simple JSON mappings

 * 
 * see docs/hello.srx for example of XML format
 * 
 * sax is https://github.com/isaacs/sax-js
 * SAX-like XML parser
 * 
 * REPLACE WITH SRC2MAP_MULTI when HTML bits figured out
 * 
 */

// module imports
var fs = require("fs");
var sax = require("sax");

// sax settings
var strict = true; // set to false for html-mode
var options =   {};

// flag for position in XML <binding> ...here if true ... </binding>
var inBinding = false;

// values to extract from the XML
var element = "";
var bindingName ="";
var bindingValue ="";
var bindingType ="";	

// create a stream parser
var saxStream = sax.createStream(strict, options); 

// make it available to other scripts
exports.createStream = function() {
  return saxStream;
};

// minimal parse error handling
saxStream.on("error", function (e) {
  console.error("SAX parse error", e);
});

// handle an opening tag
// loosely corresponds to SAX startElement(...)
saxStream.on("opentag", function (node) {
 
	element = node.name;
	console.log("ELEMENT = "+element);
	
	// if results block starting, initialize container for results
	 if(element == "results") this.bindings = {};
	 
	 // get data from an individual binding
	if(element == "binding") {
		console.log("inBinding");
		inBinding = true;
		bindingName = node.attributes.name;
	}
	if(inBinding && element != "binding") bindingType = element;
	
});

// handle text data in element content 
// loosely corresponds to SAX characters(...)
saxStream.ontext = function (text) {
	bindingValue = text;
	};
	
//handle an opening tag
//loosely corresponds to SAX endElement(...)
saxStream.on("closetag", function (nodename) {
	console.log("inBinding = "+inBinding);
	if(inBinding && nodename != "binding") {
	  
	  // build the data
	  // with types - not used here, but keep in case needed later
//		this.bindings[bindingName] = {};
//		this.bindings[bindingName].value = bindingValue;
//		this.bindings[bindingName].type = bindingType;
	  
		console.log("NODENAME = "+nodename);
	  // put the result data into the JSON object
	  this.bindings[bindingName] = bindingValue;
		inBinding = false;
	}

	// end of results block, for debugging 
	// (sax-js hasn't got SAX startDocument/endDocument)
	if(nodename == "results"){
	//  console.log("END RESULTS");
//	console.log("VALS: "+JSON.stringify(this.bindings));
//		 console.log("TITLE: "+JSON.stringify(bindings.title.value));
	}
})

