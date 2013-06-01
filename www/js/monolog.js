var Status = Backbone.Model.extend({
    url: '/status'
});

var Statuses = Backbone.Collection.extend({
    model: Status
});

var NewStatusView = Backbone.View.extend({
    events: {
        "submit form": "addStatus"
    },
    
    initialize: function(options) {
        this.collection.on("add", this.clearInput, this);
    },
    
    addStatus: function(e) {
        e.preventDefault();
        
        this.collection.create({ text: this.$('textarea').val() });
    },
    
    clearInput: function() {
        this.$('textarea').val('');
    }
});

var StatusesView = Backbone.View.extend({
    initialize: function(options) {
        this.collection.on("add", this.appendStatus, this);
    },
    
    appendStatus: function(status) {
        this.$('ul').append('<li>' + status.escape("text") + '</li>');
    }
});

$(document).ready(function() {
    var statuses = new Statuses();
    new NewStatusView({ el: $('#new-status'), collection: statuses });
    new StatusesView({ el: $('#statuses'), collection: statuses });
});