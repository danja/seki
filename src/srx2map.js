var fs = require("fs");
var  sys = require("sys");
var sax = require("sax");



var strict = true; // set to false for html-mode
var options =   {};

var element = "";
var in_binding = false;

var binding_name ="";
var binding_value ="";
var binding_type ="";	

var saxStream = sax.createStream(strict, options); 

exports.create_stream = function() {
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
	 if(element == "results") this.bindings = {};
	if(element == "binding") {
		in_binding = true;
		binding_name = node.attributes.name;
	}
	if(in_binding && element != "binding") binding_type = element;
});

saxStream.ontext = function (t) {
	binding_value = t;
	};
	
saxStream.on("closetag", function (nodename) {
	if(in_binding && nodename != "binding") {
	  // build the data
	  // with types - keep!
//		this.bindings[binding_name] = {};
//		this.bindings[binding_name].value = binding_value;
//		this.bindings[binding_name].type = binding_type;
	  this.bindings[binding_name] = binding_value;
		in_binding = false;
	}

	if(nodename == "results"){
	  sys.log("END RESULTS");
//	sys.log("VALS: "+JSON.stringify(this.bindings));
//		 sys.log("TITLE: "+JSON.stringify(bindings.title.value));
	}
})

