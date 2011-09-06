var fs = require("fs");
var sys = require("sys");
var sax = require("sax");

var strict = true; // set to false for html-mode
var options =   {};

var element = "";
var inBinding = false;

var bindingName ="";
var bindingValue ="";
var bindingType ="";	

var saxStream = sax.createStream(strict, options); 

exports.createStream = function() {
  return saxStream;
};


saxStream.on("error", function (e) {
  // unhandled errors will throw, since this is a proper node
  // event emitter.
  console.error("error!", e);
  // clear the error
  this._parser.error = null;
  this._parser.resume();
});
saxStream.on("opentag", function (node) {
 
	element = node.name;
	// console.log("ELEMENT = "+element);
	 if(element == "results") this.bindings = {};
	if(element == "binding") {
		inBinding = true;
		bindingName = node.attributes.name;
	}
	if(inBinding && element != "binding") bindingType = element;
});

saxStream.ontext = function (text) {
	bindingValue = text;
	};
	
saxStream.on("closetag", function (nodename) {
	if(inBinding && nodename != "binding") {
	  // build the data
	  // with types - keep!
//		this.bindings[bindingName] = {};
//		this.bindings[bindingName].value = bindingValue;
//		this.bindings[bindingName].type = bindingType;
	  this.bindings[bindingName] = bindingValue;
		inBinding = false;
	}

	if(nodename == "results"){
	  sys.log("END RESULTS");
//	sys.log("VALS: "+JSON.stringify(this.bindings));
//		 sys.log("TITLE: "+JSON.stringify(bindings.title.value));
	}
})

