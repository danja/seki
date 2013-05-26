<div id="page">
	<div id="aloha-loading"><span>Loading Aloha Editor</span> <img src="alohaeditor/aloha/demo/boilerplate/img/loading1.gif" title="Loading Aloha Editor ..."/></div>

	<div class="field-label">Title</div>
	<div id="title" class="field">${title}</div>
	<br />
	<div class="field-label">Content</div>
	<div id="content" class="field">${content}</div>	
	<br />
	<div class="field-label">URI</div>
	<div id="uri" class="field">http://hyperdata.org${uri}</div>	<!-- NASTY HACK -->
	<br />
	<div class="field-label">Nick</div>
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
			var title = $('#title').text();
			var content = $('#content').text();
			var nick = $('#nick').text();
			
			// textarea handling -- html id is "xy" and will be "xy-aloha" for the aloha editable
		//	if ( contentId.match(/-aloha$/gi) ) {
		//		contentId = contentId.replace( /-aloha/gi, '' );
		//	}
 
			var request = $.ajax({
				url: "${uri}",
				type: "POST",
				data: {
                    type : "post",
					title : title,
					content : content,
					uri : uri,
					nick : nick,
					uri : uri
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

