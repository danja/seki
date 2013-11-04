var fs = require('fs');
var text2html = require("./text2html");

// ./dump_2012-03-26.txt   ./input-1.txt
fs.readFile('./salzburg.txt', 'utf8', function(err, data) {
  if (err)
    throw err;
  var result = text2html(data);
  fs.writeFile('./output.html', result,'utf8');
  console.log("\n\n\n");
  console.log(result);
  // console.log(data);
  
});

