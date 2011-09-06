var sys = require('sys');

var templater = require('./templater');
var htmlTemplates = require('./htmlTemplates');

var map = {"title": "TITLE", "content": "CONTENT", "nick": "NICK", "date": "DATE"};

var pageTemplate = templater(htmlTemplates.viewTemplate);


var page = pageTemplate.fillTemplate(map);
sys.log(page)

//var p = templater(html_templates.p2);
//var pp = p.fill_template({"what": "WHAT"});
//sys.log("PP="+pp)