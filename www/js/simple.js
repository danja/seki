$(function(){

var User = Backbone.Model.extend({
   url : "/users/cow",
   'foo': 'Foo!',
   'bar': 'Bar!',
   
 //  save: function() {
 //      console.log("save in model");
 //  }
   // url: '/status'
    
 //   sync: function(method, model, options) {
  //      options || (options = {});
  //          Backbone.sync.call(model, "update", model, options);
 //   }
    
});

var UserView = Backbone.View.extend({
    events: {'submit': 'save'},
    
    initialize: function() {
        _.bindAll(this, 'save');
    },
    
    save: function() {
        var arr = this.$el.serializeArray();
        var data = _(arr).reduce(function(acc, field) {
            acc[field.name] = field.value;
            return acc;
        }, {});
        this.model.save(data);
        return false;
    },
    
    post: function() {
       // e.preventDefault();
        console.log("SAVE CALLED");
   //     var arr = this.$el.serializeArray();
    //    var data = _(arr).reduce(function(acc, field) {
    //        acc[field.name] = field.value;
     //       return acc;
     //   }, {});
      // this.model.url = "/users/fish";
       
  //      this.model.save({
  //          'foo': 'Foo!',
  //          'bar': 'Bar!'
 //       });
        this.model.save();
        return false;
    }

    });

// $(document).ready(function() {
   // var user = new User();

    
   var x = $('#register');
   console.log(x);
    new UserView({el: $('form'), model:  new User() });
});

//var statuses = new Statuses();
//new NewStatusView({ el: $('#new-status'), collection: statuses });

// var userForm = new UserForm({el: this.$('form'), model: new User()});
// userForm.initialize;


  