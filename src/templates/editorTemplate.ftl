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
	<link rel="stylesheet" href="alohaeditor/aloha/css/aloha-common-extra.css" type="text/css">

	<!-- style>
		/* Basic Styling for Sidebar */
		.aloha-sidebar {
		  position: fixed;
		  right: 0;
		  top: 0;
		  width: 250px;
		  height: 100%;
		  border: 1px solid #000;
		  border-width: 0 0 0 1px;
		  background-color: #fff;
		  padding: 10px;
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
	</style -->

	<!--
		All configuration for Aloha Editor for this demo is stored in js/aloha-config.js
		It can also be placed inline here before loading Aloha Editor itself.
	-->
	
	<script src="alohaeditor/aloha/demo/boilerplate/js/aloha-config.js"></script>
	<script src="alohaeditor/aloha/lib/require.js"></script>
	<script src="alohaeditor/aloha/lib/vendor/jquery-1.7.2.js"></script>
	    <script src="/seki/js/ace-src-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>
	<script>

	$(function($) {
		$("#tabs").tabs({
				beforeLoad : function(event, ui) {
					ui.jqXHR.error(function(jqXHR, ajaxOptions, thrownError) {
						ui.panel.html("Need to be logged in and have appropriate permissions to use this tab ("+jqXHR.status+" "+thrownError+")");
							});
							
							}
						});
	});
</script>
    <script>
	  // Passing jQuery into Aloha explicitly is not necessary since
	  // newer versions of jQuery will make a call to define which will
	  // be picked up in aloha.js
	 //  Aloha.settings.jQuery = $.noConflict(true);
    </script>
	<!--
		Load the Aloha Editor library.
		The plugin list could also be added to the configuration.
	-->
	<!-- Don't commit the sourceview plugin to the list of enabled plugins! -->
	<script src="alohaeditor/aloha/lib/aloha.js"
		data-aloha-plugins="common/ui,
				    common/format,
				    common/table,
				    common/list,
				    common/link,
				    common/highlighteditables,
				    common/undo,
				    common/contenthandler,
				    common/paste,
				    common/characterpicker,
				    common/commands,
				    common/block,
				    common/image,
				    common/abbr,
				    common/horizontalruler,
				    common/align,
				    common/dom-to-xhtml,
				extra/ribbon,
				    extra/wai-lang,
				    extra/toc,
				    extra/textcolor,
				    extra/formatlesspaste,
				    extra/hints,
				    extra/headerids,
				    extra/listenforcer,
				    extra/metaview,
				    extra/numerated-headers,   
				    extra/flag-icons,
				    extra/linkbrowser,
				    extra/imagebrowser,
				    extra/cite"></script>

	<!-- Include the fake-jquery to make sure that Aloha works even if
		the user includes his own global jQuery after aloha.js. -->
	<script src="alohaeditor/aloha/demo/boilerplate/fake-jquery.js"></script>
    <!-- script src="alohaeditor/aloha/demo/boilerplate/ribbon-example.js"></script -->
	<link rel="stylesheet" href="css/post.css">
	<script src="alohaeditor/aloha/demo/boilerplate/js/aloha-boilerplate.js"></script>
	<!-- script src="js/saver.js"></script -->
<link rel="stylesheet" href="/seki/css/style.css" />
<style>
#outer {
	height: 500px;
}

#hidden-textarea {
display: none
}

#editor {
	/*     position: absolute;  */
	/*                 top: 0;    */
	/*                  right: 0;    */
	/*                   bottom: 0;    */
	/*                   left: 0;    */
	position: absolute;
	/*  border-style:solid; */
	display: block;
	/* display:block; */
	top: 100px;
	left: 20px;
	bottom: 100px;
	right: 20px;
  

	/*         top:  0px; */
	/*     left: 280px; */
	/*     bottom: 0px; */
	/*     right: 0px; */
}
</style>

</head>
<body>

  <div id="tabs">
    <ul>
      <li><a href="${uri}?mode=content">View</a></li>
      <li><a href="${uri}?mode=editHTML">Content Editor</a></li>
      <li><a href="${uri}?mode=editSource">Source Editor</a></li>
    </ul>
  </div>
</body>
</html>
