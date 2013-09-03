<!doctype html>

<html lang="en">
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>Seki Editor</title>
<link rel="stylesheet" href="/seki/css/jquery-ui.css" />
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

<script src="/seki/js/ace-src-noconflict/ace.js" type="text/javascript"
  charset="utf-8"
></script>

<script src="/seki/js/jquery-1.9.1.js"></script>
<script src="/seki/js/jquery-ui.js"></script>
<script type="text/javascript" src="/seki/js/rdface/tiny_mce.js"></script>

<!--  
<script type="text/javascript" src="/seki/js/rdface/jquery.DnR.js"></script>
<script type="text/javascript" src="/seki/js/rdface/dimensions.DnR.js"></script>
-->

<!-- Load popular prefixes -->
<script type="text/javascript" src="/seki/js/rdface/prefixes.js"></script>
<!-- Load DOM Manipulator-->
<script type="text/javascript" src="/seki/js/rdface/DOMManipulator.js"></script>



<script>
	$(function() {
		$("#tabs")
				.tabs(
						{
							beforeLoad : function(event, ui) {
								ui.jqXHR
										.error(function() {
											ui.panel
													.html("Need to be logged in and have appropriate permissions to use this tab");
										});
							}
						});
	});
</script>



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