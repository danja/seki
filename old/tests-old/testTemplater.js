/*
 * simple functional test of templater
 */

exports.testTemplater = function(test){
	
var assert = require("assert");
var testHelpers = require("./testHelpers");

var templater = require('../templates/Templater');
var htmlTemplates = require('../templates/HtmlTemplates');

var map = {"title": "TITLE", "content": "CONTENT", "nick": "NICK", "date": "DATE"};

var correct = "<html xmlns='http://www.w3.org/1999/xhtml'><head><meta charset=\"utf-8\" /><title>TITLE</title></head><body><h1>TITLE</h1><p>CONTENT</p><p>By : NICK, DATE</p></body></html>";

var pageTemplate = templater(htmlTemplates.postViewTemplate);
var page = pageTemplate.fillTemplate(map);
page = testHelpers.normalizeXmlSpaces(page);

 console.log(correct);
 console.log(page);

test.equal(correct, page);
test.done();

};
