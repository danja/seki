var html_templates = {
page_entry_template: "<!DOCTYPE html> \
<html> \
  <head> \
    <meta charset=\"utf-8\"> \
    <title>%title%</title> \
    <link rel=\"stylesheet\" href=\"style.css\"> \
  </head> \
  <body> \
<h1>%title%</h1> \
<p>%content%</p> \
<p>By : %nick%, %date%</p> \
</body> \
</html>"
};

module.exports = html_templates;