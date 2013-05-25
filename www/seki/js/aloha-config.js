( function ( window, undefined ) {
	var Aloha = window.Aloha || ( window.Aloha = {} );
	
	Aloha.settings = {
		logLevels: { 'error': true, 'warn': true, 'info': true, 'debug': false, 'deprecated': true },
		errorhandling: false,
		ribbon: false,
		locale: 'en',
		floatingmenu: {
			width: 630,
			behaviour: 'topalign'
		},
		repositories: {
			linklist: {
				data: [
					{ name: 'Aloha Developers Wiki', url:'https://github.com/alohaeditor/Aloha-Editor/wiki', type:'website', weight: 0.50 },
					{ name: 'Aloha Editor - The HTML5 Editor', url:'http://aloha-editor.com', type:'website', weight: 0.90 },
					{ name: 'Aloha Demo', url:'http://www.aloha-editor.com/demos.html', type:'website', weight: 0.75 },
					{ name: 'Aloha Wordpress Demo', url:'http://www.aloha-editor.com/demos/wordpress-demo/index.html', type:'website', weight: 0.75 },
					{ name: 'Aloha Logo', url:'http://www.aloha-editor.com/images/aloha-editor-logo.png', type:'image', weight: 0.10 }
				]
			}
		},
		plugins: {
			format: {
				// all elements with no specific configuration get this configuration
				config: [  'b', 'i', 'p', 'sub', 'sup', 'del', 'title', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'removeFormat' ],
				editables: {
					// no formatting allowed for title
					'#top-text': []
				}
			}
		}
	};
} )( window );