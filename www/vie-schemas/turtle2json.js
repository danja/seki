var fs = require('fs');

var filename = process.argv[2];
console.log("filename = "+filename);

var turtle = fs.readFileSync(filename, "utf8");
console.log("turtle = "+turtle);

var turtleParser = new (require('../../lib/node-rdf/lib/TurtleParser').Turtle);


turtleParser.parse(turtle, function(graph){
    console.log(JSON.stringify(graph)); 
});



