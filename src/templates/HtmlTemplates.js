/*
 * Templates used to build HTML
 * parts like %this% will be replaced
 */

var htmlTemplates = {

	uriList : "<html xmlns='http://www.w3.org/1999/xhtml'> \
			    <head> \
			      <meta charset=\"utf-8\" /> \
			      <title>%title%</title> \
			    </head> \
			    <body> \
			  <h1>%title%</h1> \
			  <ul> \
			  		<li><a href=\"%uri%\">%uri%</a></li> \
			  				</ul>\
			  </body> \
			  </html> \
			  ",

	postViewTemplate : "<html xmlns='http://www.w3.org/1999/xhtml'> \
  <head> \
    <meta charset=\"utf-8\" /> \
    <title>%title%</title> \
  </head> \
  <body> \
<h1>%title%</h1> \
<p>%content%</p> \
<p>By : %nick%, %date%</p> \
</body> \
</html> \
",

	creativeTemplate : "<html xmlns='http://www.w3.org/1999/xhtml'> \
    <head><meta charset='utf-8' /> \
				<title>Create new page</title> \
				<style type='text/css'> \
					label {float:left; clear:left; width:12em; margin:0em 1em; text-align:right;} \
					input, textarea {margin:0.5em 0em; margin-left:13em; display:block; } </style> \
				</head> \
		    <body> \
		  <h1>Create new page</h1> \
<form action='/post' method='post'> \  <input type='hidden' value='post' name='type' /> \
  <label for='uri'>Item URI</label> \
  <input type='text' name='uri' id='uri' value='%uri%' /> \
  <label for='title'>Title</label> \
  <input type='text' name='title' id='title' /> \
  <label for='nick'>By</label> \
  <input type='text' name='nick' id='nick' /> \
  <label for='content'>Content</label> \
  <textarea name='content' id='content' rows='2' cols='20'></textarea> \
  <input type='submit' value='Submit' /> \
</form> \
		  </body> \
		  </html> \
		  "
};

// make it visible to other scripts
module.exports = htmlTemplates;