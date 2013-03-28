/*
 * Simple templating engine
 */

// factory method
function templater(template) {

  // template is kept in this closure

  return {

    /*
     * replacementMap = { name: value ... } fillTemplate replaces every
     * occurrence of %name% in template with value
     */
    fillTemplate : function(replacementMap) {

      // suppose it could be done with map() but I reckon this is clearer
      for ( var name in replacementMap) {
    	//  console.log("Name = "+name+"    replacementMap[name] = "+replacementMap[name]);
        // regular expression, "g" means global (every occurrence)
        var reg = new RegExp("%" + name + "%", "g");
        template = template.replace(reg, replacementMap[name]);
      }
      return template;
    }
  };
}

// make it available to other scripts
module.exports = templater;
