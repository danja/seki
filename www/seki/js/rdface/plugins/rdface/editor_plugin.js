(function() {
	tinymce.PluginManager.requireLangPack("rdface");
	tinymce
			.create(
					"tinymce.plugins.rdfacePlugin",
					{
						init : function(a, b) {
							// for rNews context menu
							a.plugins.contextmenu.onContextMenu.add(function(th, menu, event) {
								// added rNews options to context menu
								// Adds a submenu
								var rnews = menu.addMenu({title : 'rNews'});
								menu.add({title : 'Remove Annotation', onclick : function() {
									var selectedNode = a.selection.getNode();
									remove_annotation(a,selectedNode);
									a.execCommand('mceRdfaHighlight',false,'');
									a.execCommand('mceLoadTripleBrowser', false, '');
								}});
								menu.add({title : 'Reload Tooltips', onclick : function() {
									a.execCommand('mceRdfaHighlight',false,'');
								}});
								var types=  rnews.addMenu({title : 'Types'});
								var properties=  rnews.addMenu({title : 'Properties'});
								var urls=  rnews.addMenu({title : 'URLs'});
								rnews_typeofs=rnews_typeofs.sort(); 
								$.each(rnews_typeofs, function(index,value){
									types.add({title : value, onclick : function() {
										var aboutType=value;
										var annotations =new Array();	
										annotations.push(Array("typeof",aboutType));
										insert_annotation(a,annotations,0);
										update_namespaces(a,annotations);

										a.nodeChanged();
										a.execCommand('mceRdfaHighlight',false,'');
										// reload triple browser frame
										a.execCommand('mceLoadTripleBrowser',false,'');
									}});
								});
								rnews_properties=rnews_properties.sort();
								$.each(rnews_properties, function(index,value){
									properties.add({title : value, onclick: function(){
										var propertyLiteral =value ;
										var annotations =new Array();	
										annotations.push(Array("property",propertyLiteral));
										insert_annotation(a,annotations,0);
										update_namespaces(a,annotations);

										a.nodeChanged();
										//a.setContent(a.getContent());
										a.execCommand('mceRdfaHighlight',false,'');
										// reload triple browser frame
										a.execCommand('mceLoadTripleBrowser', false, '');
									}});
								});
								rnews_rels=rnews_rels.sort(); 
								$.each(rnews_rels, function(index,value){
									urls.add({title : value, onclick: function(){
										var propertyURI =value ;
										var annotations =new Array();	
										annotations.push(Array("rel",propertyURI));
										insert_annotation(a,annotations,0);
										update_namespaces(a,annotations);
										a.nodeChanged();
										a.execCommand('mceRdfaHighlight',false,'');
										// reload triple browser frame
										a.execCommand('mceLoadTripleBrowser', false, '');
									}});
								});
							});
							// --------------------------------------------------------------
							// console.log( "width: " +
							// $("#elm1").innerWidth());
							$('#tripleBrowser').css("left","790px").css("top",'9px');
							a.addCommand("mceRdfaNamespace", function() {
								a.windowManager.open({
									file : b + "/namespace.htm",
									width : 430 + parseInt(a.getLang(
											"rdfa.delta_width", 0)),
											height : 300 + parseInt(a.getLang(
													"rdfa.delta_height", 0)),
													inline : 1

								}, {
									plugin_url : b,
									default_namespace_name : "rnews",	
									default_namespace_uri : "http://dec.iptc.org/rnews/0.1/"	
								})
							});
							a.addCommand("mceRdfaAbout", function() {
								a.windowManager.open({
									file : b + "/about.htm",
									width : 420 + parseInt(a.getLang(
											"rdfa.delta_width", 0)),
											height : 195 + parseInt(a.getLang(
													"rdfa.delta_height", 0)),
													inline : 1
								}, {
									plugin_url : b,
									default_uri : "#"
								})
							});		
							a.addCommand("mceRdfaProperty", function() {
								a.windowManager.open({
									file : b + "/property.htm",
									width : 450 + parseInt(a.getLang(
											"rdfa.delta_width", 0)),
											height : 320 + parseInt(a.getLang(
													"rdfa.delta_height", 0)),
													inline : 1
								}, {
									plugin_url : b,
								})
							});		
							a.addCommand("mceRdfaGraph", function() {
								a.onNodeChange.add(function(d, c, e) {
									c.get('rdfGraph').setActive(true);
								})
								// reload triple browser
								$('#tripleBrowser').css('opacity',0.7).jqDrag();	
								$('#tripleBrowser').jqResize('.jqResize');
								document.getElementById("tripleFrame").contentDocument.location.reload(true);
								$('#tripleBrowser').css("display","inline");
								$('#closeIcon').click(function() {
									$('#tripleBrowser').css("display","none");
									a.onNodeChange.add(function(d, c, e) {
										c.get('rdfGraph').setActive(false);
									})
								});

							});	
							a.addCommand("mceLoadTripleBrowser", function() {
								// reload triple browser
								var flag=$('#tripleBrowser').is(':visible');
								if(flag){
									document.getElementById("tripleFrame").contentDocument.location.reload(true);
									//a.execCommand('mceRdfaHighlight',false,'');
								}
							});
					a.addCommand("mceRdfaHighlight", function() {
						// var rootEl = a.dom.getRoot();
						// alert(a.dom.getOuterHTML(rootEl));
						// apply tooltip style
						var xOffset = -10; // x distance from mouse
						var yOffset = 10; // y distance from mouse
						$.each($(a.getDoc()).find('*[property]'), function(index, value) { 
							$(this).mouseover(function(e) {
								// solve overlapping of tooltips, only
								// show innerest span
								e.stopPropagation();
								//highlight triple browser if visible
								var flag=$('#tripleBrowser').is(':visible');
								if(flag){
									var querySt = "*[property='" + $(this).attr('property') + "'][content="+encodeURIComponent($.trim($(this).html()))+"]";
									//get the top offset of the target anchor
									if($("#tripleFrame").contents().find(querySt)[0]){
										var target_offset = $("#tripleFrame").contents().find(querySt).offset();
										var target_top = target_offset.top;
										$("#tripleFrame").contents().find('html, body').animate({scrollTop:target_top}, 500);
										$("#tripleFrame").contents().find(querySt).css("background-color", "#eeff22");
									}
								}
								var top = (e.pageY + yOffset); var left = (e.pageX + xOffset);
								var tooltipl_txt="<ul style='list-style: none;text-align:left;margin:0 0 0 0;padding-left: 1em;text-indent: -1em;'>";
								if($(this).parent().attr('typeof')){
									tooltipl_txt=tooltipl_txt+"<li><b>"+$(this).parent().attr('typeof')+"</b></li>"+"<li>&nbsp;&nbsp;-"+$(this).attr('property')+"</li>";
								}else{
									tooltipl_txt=tooltipl_txt+"<li>"+$(this).attr('property')+"</li>";
								}
								tooltipl_txt=tooltipl_txt+"</ul>";
								$(this).append('<span id="property'+index+'" class="tooltip"><img id="arrow'+index+'" class="arrow"/>'+tooltipl_txt+'</span>');
								$(a.getDoc()).find('span#property'+index+' #arrow'+index).attr("src", b + "/img/arrow.png");
								$(a.getDoc()).find('span#property'+index).css("top", top+"px").css("left", left+"px");
							});
							$(this).mousemove(function(e) {
								var top = (e.pageY + yOffset);
								var left = (e.pageX + xOffset);
								$(a.getDoc()).find('span#property'+index+' #arrow'+index).attr("src", b + "/img/arrow.png");
								$(a.getDoc()).find('span#property'+index).css("top", top+"px").css("left", left+"px"); 
							});										
							$(this).mouseout(function() {
								$(a.getDoc()).find('span#property'+index).remove();
								//unhighlight triple browser if visible
								var flag=$('#tripleBrowser').is(':visible');
								if(flag){
									var querySt = "*[property='" + $(this).attr('property') + "'][content="+encodeURIComponent($.trim($(this).html()))+"]";
									$("#tripleFrame").contents().find(querySt).css("background-color", "");
								}
							});									
						});
						$.each($(a.getDoc()).find('*[rel]'), function(index, value) { 
							$(this).mouseover(function(e) {
								e.stopPropagation();
								var top = (e.pageY + yOffset); var left = (e.pageX + xOffset);
								var tooltipl_txt="<ul style='list-style: none;text-align:left;margin:0 0 0 0;padding-left: 1em;text-indent: -1em;'>";
								if($(this).parent().attr('typeof')){
									tooltipl_txt=tooltipl_txt+"<li><b>"+$(this).parent().attr('typeof')+"</b></li>"+"<li>&nbsp;&nbsp;-"+$(this).attr('rel')+"</li>";
								}else{
									tooltipl_txt=tooltipl_txt+"<li>"+$(this).attr('rel')+"</li>";
								}
								tooltipl_txt=tooltipl_txt+"</ul>";
								$(this).append('<span id="rel'+index+'" class="tooltip"><img id="arrow'+index+'" class="arrow"/>'+tooltipl_txt+'</span>');
								$(a.getDoc()).find('span#rel'+index+' #arrow'+index).attr("src", b + "/img/arrow.png");
								$(a.getDoc()).find('span#rel'+index).css("top", top+"px").css("left", left+"px");
								//highlight triple browser if visible
								var flag=$('#tripleBrowser').is(':visible');
								if(flag){
									var querySt = "*[rel='" + $(this).attr('rel') + "'][content="+encodeURIComponent($.trim($(this).html()))+"]";
									//get the top offset of the target anchor
									if($("#tripleFrame").contents().find(querySt)[0]){
										var target_offset = $("#tripleFrame").contents().find(querySt).offset();
										var target_top = target_offset.top;
										$("#tripleFrame").contents().find('html, body').animate({scrollTop:target_top}, 500);
										$("#tripleFrame").contents().find(querySt).css("background-color", "#eeff22");
									}
								}
							});
							$(this).mousemove(function(e) {
								var top = (e.pageY + yOffset);
								var left = (e.pageX + xOffset);
								$(a.getDoc()).find('span#rel'+index+' #arrow'+index).attr("src", b + "/img/arrow.png");
								$(a.getDoc()).find('span#rel'+index).css("top", top+"px").css("left", left+"px"); 
							});	
							$(this).mouseout(function() {
								$(a.getDoc()).find('span#rel'+index).remove();
								//unhighlight triple browser if visible
								var flag=$('#tripleBrowser').is(':visible');
								if(flag){
									var querySt = "*[rel='" + $(this).attr('rel') + "'][content="+encodeURIComponent($.trim($(this).html()))+"]";
									$("#tripleFrame").contents().find(querySt).css("background-color", "");
								}
							});									
						});
						$.each($(a.getDoc()).find('*[typeof]'), function(index, value) { 
							$(this).mouseover(function(e) {
								e.stopPropagation();
								var top = (e.pageY + yOffset); var left = (e.pageX + xOffset);
								$(this).append('<span id="typeof'+index+'" class="tooltip"><img id="arrow'+index+'" class="arrow"/><b>'+$(this).attr('typeof')+'</b></span>');
								$(a.getDoc()).find('span#typeof'+index+' #arrow'+index).attr("src", b + "/img/arrow.png");
								$(a.getDoc()).find('span#typeof'+index).css("top", top+"px").css("left", left+"px");
								//highlight triple browser if visible
								var flag=$('#tripleBrowser').is(':visible');
								if(flag){
									var querySt = "*[typeof='" + $(this).attr('typeof') + "'][about='"+encodeURIComponent($(this).attr('about'))+"']";
									//get the top offset of the target anchor
									if($("#tripleFrame").contents().find(querySt)[0]){
										var target_offset = $("#tripleFrame").contents().find(querySt).offset();
										var target_top = target_offset.top;
										$("#tripleFrame").contents().find('html, body').animate({scrollTop:target_top}, 500);
										$("#tripleFrame").contents().find(querySt).css("background-color", "#eeff22");
									}
								}
							});
							$(this).mousemove(function(e) {
								var top = (e.pageY + yOffset);
								var left = (e.pageX + xOffset);
								$(a.getDoc()).find('span#typeof'+index+' #arrow'+index).attr("src", b + "/img/arrow.png");
								$(a.getDoc()).find('span#typeof'+index).css("top", top+"px").css("left", left+"px"); 
							});	
							$(this).mouseout(function() {
								$(a.getDoc()).find('span#typeof'+index).remove();
								//unhighlight triple browser if visible
								var flag=$('#tripleBrowser').is(':visible');
								if(flag){
									var querySt = "*[typeof='" + $(this).attr('typeof') + "'][about='"+encodeURIComponent($(this).attr('about'))+"']";
									$("#tripleFrame").contents().find(querySt).css("background-color", "");
								}
							});									
						});						
					});		
							a.addCommand("mceRdfaEnrich", function() {
								//first we need to remove automatically generated annotations
								var tmp;
								$(a.getDoc()).find('.automatic').each(function(){
									tmp=$(this).find("span[property='rnews:name']").html();
									$(this).replaceWith(tmp);
								});
								//--------------------------------------------------------------
								a.windowManager.open({
									file : b + "/enrich.htm",
									width : 335 + parseInt(a.getLang(
											"rdfa.delta_width", 0)),
											height : 145 + parseInt(a.getLang(
													"rdfa.delta_height", 0)),
													inline : 1
								}, {
									plugin_url : b,
								})

							});
							a.addCommand("mceRdfaStat", function() {
								//first we need to remove automatically generated annotations
								var tmp;
								$(a.getDoc()).find('.automatic').each(function(){
									tmp=$(this).find("span[property='rnews:name']").html();
									$(this).replaceWith(tmp);
								});
								//--------------------------------------------------------------
								a.windowManager.open({
									file : b + "/stat.htm",
									width : 500 + parseInt(a.getLang(
											"rdfa.delta_width", 0)),
											height : 500 + parseInt(a.getLang(
													"rdfa.delta_height", 0)),
													inline : 1
								}, {
									plugin_url : b,
								})

							});
							a.addCommand("mceRdfaSetting", function() {
								a.windowManager.open({
									file : b + "/setting.htm",
									width : 400 + parseInt(a.getLang(
											"rdfa.delta_width", 0)),
											height : 350 + parseInt(a.getLang(
													"rdfa.delta_height", 0)),
													inline : 1
								}, {
									plugin_url : b,
								})
							});
							a.addButton("namespace", {
								title : "Namespaces",
								cmd : "mceRdfaNamespace",
								image : b + "/img/namespace.png"
							});
							a.addButton("about", {
								title : "Subject/Type Assignment",
								cmd : "mceRdfaAbout",
								image : b + "/img/about.png"
							});	
							a.addButton("property", {
								title : "Triple Insertion",
								cmd : "mceRdfaProperty",
								image : b + "/img/property.png"
							});			
							a.addButton("rdfGraph", {
								title : "Triple Browser",
								cmd : "mceRdfaGraph",
								image : b + "/img/graph.png"
							});
							a.addButton("rdfEnrich", {
								title : "Automatic Content Annotation",
								cmd : "mceRdfaEnrich",
								image : b + "/img/connect.png"
							});	
							a.addButton("setting", {
								title : "Settings",
								cmd : "mceRdfaSetting",
								image : b + "/img/setting.png"
							});	
							a.addButton("stat", {
								title : "Statistics",
								cmd : "mceRdfaStat",
								image : b + "/img/stat.png"
							});	
							a.onNodeChange.add(function(d, c, e) {
								//a.execCommand('mceRdfaHighlight',false,'');
								c.get('about').setDisabled( a.selection.isCollapsed() );
								c.get('property').setDisabled( a.selection.isCollapsed() );
							})
							a.onLoadContent.add(function(ed,o){
								a.execCommand('mceRdfaHighlight',false,'');
							});
							a.onSetContent.add(function(ed,o){
								a.execCommand('mceRdfaHighlight',false,'');
							});
						},
						createControl : function(b, a) {
							return null
						},
						getInfo : function() {
							return {
								longname : "RDFa Content Editor",
								author : "Ali Khalili",
								authorurl : "http://ali1k.wordpress.com",
								infourl : "http://aksw.org/Projects/RDFaCE",
								version : "0.2"
							}
						}
					});
	tinymce.PluginManager.add("rdface", tinymce.plugins.rdfacePlugin)
})();