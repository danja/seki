tinyMCEPopup.requireLangPack();
var rdfaProperty = {
	init : function() {
		var f = document.forms[0];
		// add auto suggest
			$("#propertyLiteral").autocomplete({
			source : rnews_properties
		});
		$("#propertyURI").autocomplete({
			source : rnews_rels
		});
		$("#contentDatatype").autocomplete({
			source : rnews_contenttypes
		});
		$("#propertyTerm")
		.dialog(
				{
					width : 350,
					title : 'Resource Suggester',
					draggable : true,
					resizable : false,
					buttons : {
						"Suggest Resource" : function() {
							var f = document.forms[0];
							// var term =
							// tinyMCEPopup.editor.selection.getContent({format
							// : 'text'});
							var term = $("#propertySt").val();
							// put a limitation to lenght of search term
							if (term.length < 70 && term) {
								var dataReceived;
								/* Gets called when request starts */
								$("#loading").ajaxStart(function(){
									$(this).css("display","inline");
								});
								/* Gets called when request complete */
								$("#loading").ajaxComplete(function(){
									$(this).css("display","none");
								});
								$.ajax({
									type : "POST",
									async: false,
									url : proxy_url,
									data : "api=Swoogle&query="+term,
									contentType: "application/x-www-form-urlencoded",
									success : function(data) {
										dataReceived =  data;
									},
									error: function(xhr, txt, err){ alert("xhr: " + xhr + "\n textStatus: " +
											txt + "\n errorThrown: " + err+ "\n url: " + url); },
								});
								var xmlDoc = $.parseXML(dataReceived);
								var resultNo=xmlDoc.getElementsByTagName("rdf:li").length;
								var term2=term.replace(' ','');
								if(resultNo){
									var prefixFound='';
									var prefixArr=new Array();
									$.each(xmlDoc.getElementsByTagName("wob:SemanticWebDocument"),function(key,value){
										var findAddr=0;
										var nsURL='';
										var address=$(value).attr("rdf:about");
										$.each(popular_prefixes,function(i,v){
										var tmp=v.split('http://')[1];
										var re = new RegExp(tmp.split('/')[0]);
										var m = re.exec(address);
										if (m != null) {
												prefixFound=i;
												if(prefixArr.indexOf(prefixFound+":"+term2) ==-1){
													prefixArr.push(prefixFound+":"+term2);
												}
												//console.log(i);
												//return false;
										}
										//if(prefixFound){
										// return false;
										//}
										//console.log(address);
										});
									});
									if(prefixFound){
									// add auto suggest
									$("#propertyLiteral").autocomplete({
										source : rnews_properties.concat(prefixArr)
									});
									f.propertyLiteral.value = prefixArr[0];
									}else{
									f.propertyLiteral.value = term2;
									}
								}else{
									f.propertyLiteral.value = term2;
								}
								
							}
							$(this).dialog("close");
						},
						"Skip" : function() {
							$(this).dialog("close");
						}
					}
				})	
	},

	insert : function() {
		var annotations =new Array();
		var f = document.forms[0];
		// get form inputs
		var propertyLiteral = f.propertyLiteral.value;
		var propertyURI = f.propertyURI.value;
		var contentLiteral = f.contentLiteral.value;
		var contentDatatype = f.contentDatatype.value;
		var contentURI = f.contentURI.value;

		if (propertyLiteral) {
			annotations.push(Array("property",propertyLiteral));
		}
		if (propertyURI) {
			annotations.push(Array("rel",propertyURI));
		}
		if (contentLiteral) {
			annotations.push(Array("content",contentLiteral));
		}
		if (contentDatatype) {
			annotations.push(Array("datatype",contentDatatype));
		}
		if (contentURI) {
			annotations.push(Array("resource",contentURI));
		}
		insert_annotation(tinyMCEPopup.editor,annotations,f.isHidden.checked);
		update_namespaces(tinyMCEPopup.editor,annotations)

		tinyMCEPopup.editor.nodeChanged();
		tinyMCEPopup.editor.execCommand('mceRdfaHighlight',false,'');
		// reload triple browser frame
		tinyMCEPopup.editor.execCommand('mceLoadTripleBrowser', false, '');
		tinyMCEPopup.close();

	}
};

tinyMCEPopup.onInit.add(rdfaProperty.init, rdfaProperty);
