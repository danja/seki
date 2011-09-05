var sys = require('sys');

var templater = require('./templater');
var html_templates = require('./html_templates');

var map = {"title": "TITLE", "content": "CONTENT", "nick": "NICK", "date": "DATE"};

var page_entry = templater(html_templates.page_template);


var page = page_entry.fill_template(map);
sys.log(page)

//var p = templater(html_templates.p2);
//var pp = p.fill_template({"what": "WHAT"});
//sys.log("PP="+pp)