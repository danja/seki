$(function(){
    
    var context = { 
       "@context": {
         "login": "http://purl.org/stuff/usermanagement#login",
         "password": "http://purl.org/stuff/usermanagement#password",
         "fullname": "http://purl.org/stuff/usermanagement#fullname",
         "email": "http://purl.org/stuff/usermanagement#email",
         "profile": "http://purl.org/stuff/usermanagement#profile"
    }
};

    var User = Backbone.Model.extend();
    
    var UserView = Backbone.View.extend({
        events: {'submit': 'save'},
        
        save: function() {
            var arr = this.$el.serializeArray();
            var data = _(arr).reduce(function(acc, field) {
                    acc[field.name] = field.value;
                    return acc; }, {});
                
                // TODO :swap out http://hyperdata.org     
            context["@id"] =  "http://hyperdata.org/users/"+data["login"];
            context["@type"] = "http://purl.org/stuff/usermanagement#User";

            this.model.set(context);
            this.model.set(data);
            this.model["url"] =  "/users/"+data["login"];
            
            this.model.id = this.model["url"]; // turns the method from POST to PUT
            
            this.model.save();
            return false;
        }
});

new UserView({el: $('form'), model:  new User() });
});



