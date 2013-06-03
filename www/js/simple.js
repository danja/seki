$(function(){

var User = Backbone.Model.extend({
   url : "/users/cow"
   //,
 //  'foo': 'Foo!',
  // 'bar': 'Bar!',
});

var UserView = Backbone.View.extend({
    events: {'submit': 'save'},
    
  //  initialize: function() {
   //     _.bindAll(this, 'save');
  //  },
    
    save: function() {
        var arr = this.$el.serializeArray();
        var data = _(arr).reduce(function(acc, field) {
            acc[field.name] = field.value;
            return acc;
        }, {});
        this.model.save(data);
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



  