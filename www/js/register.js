$(function(){
    var context = {
        "@context": {
            "name": "http://xmlns.com/foaf/0.1/name",
  "homepage": {
      "@id": "http://xmlns.com/foaf/0.1/homepage",
  "@type": "@id"
  }
    }
};

    var User = Backbone.Model.extend({
//         defaults: function() {
//             return {
//              //   context : {
//                 
//                     "@context": {
//                         "name": "http://xmlns.com/foaf/0.1/name",
//                         "homepage": {
//                             "@id": "http://xmlns.com/foaf/0.1/homepage",
//                             "@type": "@id"
//                  //       }
//                     
//                     }
//                 }
//             };
//         }

    });
    
    var UserView = Backbone.View.extend({
        events: {'submit': 'save'},
        
      //  initialize: function() {
       //      _.bindAll(this, 'save');
       //   },
        
        save: function() {
            
          
                var arr = this.$el.serializeArray();
                var data = _(arr).reduce(function(acc, field) {
                    acc[field.name] = field.value;
                    return acc;
                }, {});


                this.model.set(context);
                this.model.set(data);
            this.model["url"] =  "/users/"+data["login"];
            this.model.id = this.model["url"]; // turns the method from POST to PUT
          //  console.log("MODEL="+JSON.stringify(this.model));
              this.model.save();
            return false;
        }
        
        //   post: function() {
        // e.preventDefault();
        //       console.log("SAVE CALLED");
        //       this.model.save();
        //       return false;
        //  }
        
});

new UserView({el: $('form'), model:  new User() });
});



