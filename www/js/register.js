var User = Backbone.Model.extend({
    url: '/register',
    paramRoot: 'user',
    defaults: {
        'fullname': '',
        'email': '',
        'password': ''
    }
});

var NewUserView = Backbone.View.extend({
    // events: {
    //    "submit form": "addUser"
   // },
    
 //   initialize: function(options) {
 //       this.collection.on("add", this.clearInput, this);
 //   },
    
    initialize: function() {
        _.bindAll(this, 'register');        
    },
    
  //  addUser: function(e) {
  //      e.preventDefault();
        
  //      this.collection.create({ text: this.$('textarea').val() });
  //  },
    
   // clearInput: function() {
   //     this.$('textarea').val('');
  //  }
    
    events: {
        'submit f': 'register'
    },
    
    register: function(e){
        e.preventDefault();
        
        var login = this.$('input[name=login]').val();
        var fullname = this.$('input[name=fullname]').val();
        var email = this.$('input[name=email]').val();
        var password = this.$('input[name=password]').val();
        
        this.$('input[type=submit]').attr('disabled', 'disabled');
        
        var self = this;
        $.ajax({
            type: 'PUT',
            url: '/json/user',
            dataType: 'json',
            data: { username: username, password: password, email: email },
            success: function(data) {
                App.user = data;
                self.$('input[type=submit]').removeAttr('disabled');
                self.$('.account_info').html('Changes saved');
                setTimeout(function() {
                    self.$('.account_info').html('');
                }, 3000);
            },
            error: function() {
                window.location = '/';
            }
        });
    },
});

$(document).ready(function() {

  //  var users = new Users();
   // new NewUserView({ el: $('#new-user'), collection: users });
   //  new UsersView({ el: $('#users'), collection: users });
});