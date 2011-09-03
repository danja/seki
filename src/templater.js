//Define the factory
function templater(template) {

  // template is kept in this closure

  return {
    fill_template: function (replacement_map){
      
      for(var name in replacement_map) {
        var reg = new RegExp("%"+name+"%","g");
        template = template.replace(reg, replacement_map[name]);
      }
      return template;
    }
  };
}

// Export this file as a module
module.exports = templater;
