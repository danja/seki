<!doctype html>
 <html lang="en"> 
   <head>
    <title>${title}</title>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="description" content="${title}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- link rel="shortcut icon" href="/favicon.ico">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" -->
    <script src="/create/deps/jquery-1.7.1.min.js"></script>
    <script src="/create/deps/jquery-ui-1.8.18.custom.min.js"></script>
    <script src="/create/deps/underscore-min.js"></script>
    <script src="/create/deps/backbone-min.js"></script>
    <script src="/create/deps/vie-min.js"></script>

    <!-- Tags input is needed for the Tag widget -->
    <script src="/create/deps/jquery.tagsinput.min.js"></script>

    <!-- rdfQuery and annotate are only needed for the Hallo
    annotations plugin -->
    <script src="/create/deps/jquery.rdfquery.min.js"></script>
    <script src="/create/deps/annotate-min.js"></script>

    <script src="/create/deps/rangy-core-1.2.3.js"></script>
    <script src="/create/deps/hallo-min.js"></script>
    <script src="/js/create.js"></script>
    
    
    <script>
      jQuery(document).ready(function () {
        jQuery('body').midgardCreate({
//           url: function () {
//             return 'javascript:false;';
//           },
  url: function() { return '${uri}'; },
          metadata: {
            midgardTags: {}
          },
          collectionWidgets: {
            'default': 'midgardCollectionAdd',
            'skos:related': null
          },
          stanbolUrl: 'http://dev.iks-project.eu:8081'/*,
          language: 'pt_BR'*/
        });

        // Set a simpler editor for title fields
//         jQuery('body').midgardCreate('configureEditor', 'title', 'halloWidget', {
//           plugins: {
//             halloformat: {},
//             halloblacklist: {
//               tags: ['br']
//             }
//           }
//         });
        jQuery('body').midgardCreate('setEditorForProperty', 'dcterms:title', 'title');

//         jQuery('body').midgardCreate({
//             url: function() { return '${uri}'; }
//         });
        // Disable editing of author fields
     //   jQuery('body').midgardCreate('setEditorForProperty', 'dcterms:author', null);

      });
      // Fake Backbone.sync since there is no server to communicate with
//       Backbone.sync = function(method, model, options) {
//         if (console && console.log) {
//           console.log('Model contents', model.toJSONLD());
//         }
//         options.success(model);
//       };
    </script>
    <link rel="stylesheet" href="/create/examples/font-awesome/css/font-awesome.css" />
    <link rel="stylesheet" href="/create/themes/create-ui/css/create-ui.css"
    />
    <link rel="stylesheet" href="/create/themes/midgard-notifications/midgardnotif.css"
    />
    <link rel="stylesheet" href="/create/examples/demo.css" />
  </head>

  <body>
<div>
<a href="/admin/register.html">Register</a> <a href="/admin/login.html">login</a> 
</div>


    <div xmlns:sioc="http://rdfs.org/sioc/ns#" 
         xmlns:dcterms="http://purl.org/dc/terms/" 
         xmlns:um="http://purl.org/stuff/usermanagement#"
         
         about="http://hyperdata.org/${uri}">
      <article typeof="sioc:Post" about="http://hyperdata.org${uri}">
        <h1 id="title" property="dcterms:title">${title}</h1>
        <div id="content" property="sioc:content">${content}</div>
        <div id="login" property="um:fullname">${fullname}</div>
 
        <!--
        <ul rel="skos:related">
          <li about="urn:tag:Foo" property="rdfs:label">Foo</a>
        </ul> -->
      </article>
    </div>
</body>
</html>