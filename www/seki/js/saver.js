Aloha.ready(function() {
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
});