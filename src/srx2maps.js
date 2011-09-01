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

//var binding_values = {};
//var binding_types = {};
var bindings = {};

// stream usage
// takes the same options as the parser
var saxStream = require("sax").createStream(strict, options)
saxStream.on("error", function (e) {
  // unhandled errors will throw, since this is a proper node
  // event emitter.
  console.error("error!", e)
  // clear the error
  this._parser.error = null
  this._parser.resume()
})
saxStream.on("opentag", function (node) {
	// sys.log("tag name = "+node.name);
	element = node.name;
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
		bindings[binding_name] = {};
		bindings[binding_name].value = binding_value;
		bindings[binding_name].type = binding_type;
//		binding_values[binding_name] = binding_value;
//		binding_types[binding_name] = binding_type;
		in_binding = false;
	}

	if(nodename == "results"){
		sys.log("VALS: "+JSON.stringify(bindings));
		 sys.log("TITLE: "+JSON.stringify(bindings.title.value));
		// sys.log(JSON.stringify(binding_types));
	}
})

saxStream.onend = function () {
	sys.log("END");
	sys.log("VALS: "+JSON.stringify(binding_values));
	sys.log(JSON.stringify(binding_types));
	};
// pipe is supported, and it's readable/writable 
// same chunks coming in also go out.
fs.createReadStream("../xml/hello.srx")
  .pipe(saxStream)
//  .pipe(fs.createReadStream("file-copy.xml"))
