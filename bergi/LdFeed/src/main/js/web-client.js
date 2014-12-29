var express = require('express');
var path = require('path');

var app = express();
console.log(path.join(__dirname, '../webapp/'));
app.use(express.static(path.join(__dirname, '../webapp/')));
app.use(express.logger());

app.listen(3000);
