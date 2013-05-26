Aloha.ready(function() {
	Aloha.require( ['aloha', 'aloha/jquery'], function( Aloha, $) { // $ was jQuery
		
		// save all changes after leaving an editable
		Aloha.bind('aloha-editable-deactivated', function(){
			var content = Aloha.activeEditable.getContents();
			var contentId = Aloha.activeEditable.obj[0].id;
			var pageId = window.location.pathname;
			var uri = $('#uri').text();
			
			console.log("Content = "+content);
			console.log("ContentID = "+contentId);
			console.log("pageId = "+pageId);
			console.log("uri = "+uri);
			
			// textarea handling -- html id is "xy" and will be "xy-aloha" for the aloha editable
			if ( contentId.match(/-aloha$/gi) ) {
				contentId = contentId.replace( /-aloha/gi, '' );
			}
 
			var request = $.ajax({
				url: "save.php",
				type: "POST",
				data: {
					content : content,
					contentId : contentId,
					pageId : pageId,
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
});