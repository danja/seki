/*
 * Templates used to build HTML
 * parts like %this% will be replaced
 * 
 *  * TODO remove ...Template from names
 */

var fs = require('fs'); // filesystem module

function load(filename) {
    // synchronous
    var template = fs.readFileSync(filename, "utf8");
    return template;
}

var htmlTemplates = {
    pageTemplate: (function() {
        // console.log("loading HTML editor template "+__dirname);
        var path = require('path').resolve(__dirname, 'pageTemplate.ftl');
        // console.log("path : "+path);
        var template = load(path);
        //console.log("TEMPLATE : "+template);
        return template;
    })(),

    blogViewTemplate: (function() {
        // console.log("loading HTML editor template "+__dirname);
        var path = require('path').resolve(__dirname, 'blogViewTemplate.ftl');
        // console.log("path : "+path);
        var template = load(path);
        //console.log("TEMPLATE : "+template);
        return template;
    })(),

    blogArticleTemplate: (function() {
        // console.log("loading HTML editor template "+__dirname);
        var path = require('path').resolve(__dirname, 'blogArticleTemplate.ftl');
        // console.log("path : "+path);
        var template = load(path);
        //console.log("TEMPLATE : "+template);
        return template;
    })(),

    editorTemplate: (function() {
        // console.log("loading editor template "+__dirname);
        var path = require('path').resolve(__dirname, 'editorTemplate.ftl');
        // console.log("path : "+path);
        var template = load(path);
        // console.log("TEMPLATE : "+template);
        return template;
    })(),

    htmlEditorTemplate: (function() {
        // console.log("loading HTML editor template "+__dirname);
        var path = require('path').resolve(__dirname, 'contentEditorForm.ftl');
        // console.log("path : "+path);
        var template = load(path);
        //console.log("TEMPLATE : "+template);
        return template;
    })(),

    sourceEditorTemplate: (function() {
        // console.log("loading source editor template "+__dirname);
        var path = require('path').resolve(__dirname, 'sourceEditorForm.ftl');
        console.log("path : " + path);
        var template = load(path);
        //	console.log("TEMPLATE : "+template);
        return template;
    })(),

    // ( function(){} )();

    uriList: "<html xmlns='http://www.w3.org/1999/xhtml'> \
			    <head> \
			      <meta charset=\"utf-8\" /> \
			      <title>${title}</title> \
			    </head> \
			    <body> \
			  <h1>${title}</h1> \
			  <ul> \
			  <#list uris as uri> \
			  <li><a href=\"${uri}\">${uri}</a></li> \
			  </#list>  \
			  </ul>\
			  </body> \
			  </html> \
			  ",

    _postViewTemplate: "<html xmlns='http://www.w3.org/1999/xhtml'> \
  <head> \
    <meta charset=\"utf-8\" /> \
    <title>${title}</title> \
  </head> \
  <body> \
<h1>${title}</h1> \
<p>${content}</p> \
<p>By : ${nick}, ${date}</p> \
</body> \
</html> \
",

    _contentTemplate: "<h1>${title}</h1> \
<p>${content}</p> \
<p>By : ${nick}, ${date}</p> \
",

    creativeTemplateHeader: "<html xmlns='http://www.w3.org/1999/xhtml'> \
    <head><meta charset='utf-8' /> \
				<title>Create new page</title> \
				<style type='text/css'> \
					label {float:left; clear:left; width:12em; margin:0em 1em; text-align:right;} \
					input, textarea {margin:0.5em 0em; margin-left:13em; display:block; } </style> \
				</head> \
		    <body> \
		  <h1>Create new page</h1> \
		  ",

    creativeTemplateFooter: "</body> \
          </html> \
          "
};

// make it visible to other scripts
module.exports = htmlTemplates;
