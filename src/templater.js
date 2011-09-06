//Define the factory
function templater(template) {

  // template is kept in this closure

  return {
    fillTemplate: function (replacementMap){
      
      for(var name in replacementMap) { // suppose it could be done with map() but I reckon this is clearer
        var reg = new RegExp("%"+name+"%","g");
        template = template.replace(reg, replacementMap[name]);
      }
      return template;
    }
  };
}

// Export this file as a module
module.exports = templater;
