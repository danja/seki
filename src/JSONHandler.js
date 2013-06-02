//Constructor
function JSONHandler() {

}

// properties and methods
JSONHandler.prototype = {
		
  value1: "default_value",
  
  "GET": function() {
   // this.value2 = argument + 100;
	  console.log("JSONHandler.GET called");
  },
  
  "POST": function() {
      // this.value2 = argument + 100;
      console.log("JSONHandler.POST called");
  }
};

module.exports = JSONHandler;