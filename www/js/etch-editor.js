 rangy.init();
 rangy.createMissingNativeApi(); // to polyfill window.getSelection() in IE8
 (function() {
     var article = Backbone.Model.extend({
         defaults: {
             title: 'Default Title',
             content: 'Default content text'
         },
         url: "http://localhost:8888/pages"
     });
     
     var articleView = Backbone.View.extend({
         initialize: function() {
             _.bindAll(this, 'save')
             this.model.bind('save', this.save);
         },
         
         events: {
             'mousedown .editable': 'editableClick'
         },
         
         editableClick: etch.editableInit,
         
         save: function() {
             $('.etch-editor-panel').remove();
             var title = this.$('.title').text();
             var content = this.$('.content').text();
             
             this.model.save({
                 title: title,
                 content: content
             });
         }
         
     });
     
     $article = $('.article');
     var model = new article();
     var view = new articleView({
         model: model,
         el: $article[0],
         tagName: $article[0].tagName
     });
 })()