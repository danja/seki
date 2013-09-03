<!doctype html>
<!--[if lt IE 7 ]> <html lang="en" class="no-js ie6"> <![endif]-->
<!--[if IE 7 ]>    <html lang="en" class="no-js ie7"> <![endif]-->
<!--[if IE 8 ]>    <html lang="en" class="no-js ie8"> <![endif]-->
<!--[if IE 9 ]>    <html lang="en" class="no-js ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html lang="en" class="no-js"> <!--<![endif]-->
<head>
    <title>Seki</title>

    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="description" content="Seki">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- link rel="shortcut icon" href="/favicon.ico">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" -->

    <!--
        Load the CSS styles for Aloha Editor
    -->
    <!-- link rel="stylesheet" href="alohaeditor/aloha/css/aloha-common-extra.css" type="text/css" -->

    <style>
        /* Basic Styling for Sidebar */
        .aloha-sidebar {
          display: none;
        }

        .aloha-panel {
          border: 1px solid #000;
        }

        .aloha-panel-title {
          background-color: #000;
          color: #fff;
          padding: 5px 10px;
        }

        .aloha-panel-content {
        padding: 5px 10px;
        }
    </style>

    <!--
        All configuration for Aloha Editor for this demo is stored in js/aloha-config.js
        It can also be placed inline here before loading Aloha Editor itself.
    -->
  </head>
  <body>
<div id="page">

<!-- temp workaround -->
<div id = "menu">
<ul>
<li>post view</li>
</ul>
</div>

    <div id="aloha-loading"><span>Loading Aloha Editor</span> <img src="alohaeditor/aloha/demo/boilerplate/img/loading1.gif" title="Loading Aloha Editor ..."/></div>

    <h2 id="title" class="field">${title}</h2>
    <br />
    <div id="content" class="field">${content}</div>    
    <br />
    <div id="uri" class="field">http://hyperdata.org${uri}</div>    <!-- NASTY HACK -->
    <br />
    <div id="nick" class="field">${nick}</div>

</div>
    <script type="text/javascript">
        Aloha.ready( function(){
            Aloha.Sidebar.right.hide();
            var $ = Aloha.jQuery;
            // register all editable areas

            $('#title').aloha();
            $('#content').aloha();
            $('#uri').aloha();
            $('#nick').aloha();
            
        // hide loading div
        $('#aloha-loading').hide();
        $('#aloha-loading span').html('Loading Plugins');
////////////////////////////
    Aloha.require( ['aloha', 'aloha/jquery'], function( Aloha, $) { // $ was jQuery
        
        // save all changes after leaving an editable
        Aloha.bind('aloha-editable-deactivated', function(){
            // var content = Aloha.activeEditable.getContents();
            // var contentId = Aloha.activeEditable.obj[0].id;
            // var pageId = window.location.pathname;
            var uri = $('#uri').text();
            var title = $('#title').html();
            var content = $('#content').html();
            var nick = $('#nick').text();
            
            // textarea handling -- html id is "xy" and will be "xy-aloha" for the aloha editable
        //  if ( contentId.match(/-aloha$/gi) ) {
        //      contentId = contentId.replace( /-aloha/gi, '' );
        //  }
 
            var request = $.ajax({
                url: "${uri}",
                type: "POST",
                data: {
                    type : "post",
                    title : title,
                    content : content,
                    uri : uri,
                    nick : nick
                },
                dataType: "html"
            });
 
            request.done(function(msg) {
                $("#log").html( msg ).show().delay(800).fadeOut();
            });
 
            request.error(function(jqXHR, textStatus) {
                alert( "Request failed: " + textStatus );
            });
        });
        
    });
    ////////////////////////////////////////
            });
            
            
        </script>

    <!--[if lt IE 7 ]>
    <script src="js/libs/dd_belatedpng.js"></script>
    <script> DD_belatedPNG.fix('img, .png_bg');</script>
    <![endif]-->

</body>
</html>