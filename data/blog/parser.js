var n3 = require('n3');
var fs = require('fs');

// """<div><p>C:\\&gt;python ERROR [line: 531, col: 106] illegal escape sequence value: & (0x26)
// C:\\PIRILLO.EXE

if (process.argv.length !== 3)
  return console.error('Usage: n3parser-perf.js filename');

var filename = process.argv[2];

var TEST = '- Parsing file ' + filename;
console.time(TEST);

var count = 0;
new n3.Parser().parse(fs.createReadStream(filename), function (error, triple) {
  if(error) console.log("ERROR:"+error);
  if (triple) {
//	if(triple.object.substr(0,1) == "\"" || triple.object.substr(0,1) == "_") {
//    	
	var subject = formatSubject(triple.subject);
	var predicate = formatUri(triple.predicate);
	var object = formatObject(triple.object);
	console.log(subject, predicate, object, '.');
    count++;
  }
  else {
 //   console.timeEnd(TEST);
 //   console.log('* Triples parsed: ' + count);
 //   console.log('* Memory usage: ' + Math.round(process.memoryUsage().rss / 1024 / 1024) + 'MB');
  }
});

var formatSubject = function(raw) {
	if(raw.substr(0,1) == "_") return raw; // is bnode
	return formatUri(raw);
};

var formatUri = function(raw) {
	var uri = encodeURI(raw);
	return "<"+uri+">";
};

var formatObject = function(raw) {
	if(raw.substr(0,1) == "_") return raw; // is bnode
	if(raw.substr(0,1) == "\"") return formatLiteral(raw);
	return formatUri(raw);
};

var formatLiteral = function(raw) {
	if(raw.substr(raw.length-1,1) == "\"") return "\"\""+raw+"\"\""; // simple literal
// "2008-04-12T21:07:31+02:00"^^<http://www.w3.org/2001/XMLSchema#dateTime> 
	if(raw.substr(raw.length-1,1) == ">") {
		var uppities = raw.lastIndexOf("^^");
		var type = raw.substring(uppities, raw.length);
		var text = raw.substring(0, uppities);
		return "\"\""+text+"\"\""+type;
	}
// "Raw"@en 
	var at = raw.lastIndexOf("@");
	var lang = raw.substring(at, raw.length);
	var text = raw.substring(0, at);
	return "\"\""+text+"\"\""+lang;
};



