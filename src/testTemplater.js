/*
 * simple functional test of templater
 */
var templater = require('./templater');
var htmlTemplates = require('./htmlTemplates');

var map = {"title": "TITLE", "content": "CONTENT", "nick": "NICK", "date": "DATE"};

var pageTemplate = templater(htmlTemplates.viewTemplate);


var page = pageTemplate.fillTemplate(map);
console.log(page)

//var p = templater(html_templates.p2);
//var pp = p.fill_template({"what": "WHAT"});
//console.log("PP="+pp)