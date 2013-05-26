tinyMCEPopup.requireLangPack();

var rdfaAbout = {
		init : function() {
		$("#aboutSt").val(tinyMCEPopup.editor.selection.getContent({format : 'text'}));
			//add auto suggest
			$("#aboutType").autocomplete({
				source : rnews_typeofs
			});
			$("#aboutTerm")
			.dialog(
					{
						width : 320,
						title : 'Resource Suggester',
						draggable : true,
						resizable : false,
						buttons : {
							"Suggest Resource" : function() {
								var f = document.forms[0];
								// var term =
								// tinyMCEPopup.editor.selection.getContent({format
								// : 'text'});
								var term = $("#aboutSt").val();
								// put a limitation to lenght of search term
								if (term.length < 70 && term) {
									// gets default value of URI
									// f.aboutURI.value =
									// tinyMCEPopup.getWindowArg('default_uri');
									var dataReceived;
									var dataReceived2;
									/* Gets called when request starts */
									$("#loading").ajaxStart(function(){
										$(this).css("display","inline");
									});
									/* Gets called when request complete */
									$("#loading").ajaxComplete(function(){
										$(this).css("display","none");
									});
									var data = "api=Sindice&query=" + term;
									dataReceived=suggestURI(proxy_url,data,false);
									data = "api=Alchemy&query=" + term;
									dataReceived2=connectEnricherAPI(proxy_url,data);

									var typeData;
									if (dataReceived2.entities.length) {
										typeData = dataReceived2.entities[0].type;
									}
									if (typeData) {
										// uses dbpedia as default namespace
										f.aboutType.value = "dbpedia:"
											+ typeData
									}
									var dataset = new Array();
									linkData = dataReceived.entries;
									$.each(linkData, function(i, item) {
										dataset[i] = item.link;
									});

									/*
									 * test data var programmingLang =
									 * ["ActionScript","AppleScript","Asp","BASIC","C","C++",
									 * "Clojure","COBOL","ColdFusion","Erlang","Fortran","Groovy","Haskell",
									 * "Java","JavaScript","Lisp","Perl","PHP","Python","Ruby","Scala","Scheme"];
									 * 
									 */
									if (dataset.length) {
										f.aboutURI.value = dataset[0];
									}
									$("#aboutURI").autocomplete({
										source : dataset
									});
								}
								$(this).dialog("close");
							},
							"Skip" : function() {
								$(this).dialog("close");
							}
						}
					})
		},
		alignNSs : function() {
			var ns = tinyMCEPopup.editor.dom.get('namespaces');
			if(ns){
				var rootEl = tinyMCEPopup.editor.dom.getRoot();
				//check to see if namespace div is the outerest element
				var parentNode=$(tinyMCEPopup.editor.getDoc()).find(ns).parent();
				if(parentNode[0]!=$(rootEl)[0]){
					parentNode[0].innerHTML=ns.innerHTML;
					ns.innerHTML='';
					ns.appendChild(parentNode[0]);
					rootEl.innerHTML='';
					rootEl.appendChild(ns);
				}
				tinyMCEPopup.editor.nodeChanged();
			}
		},
		insert : function() {
			var annotations =new Array();
			var f = document.forms[0];
			// get form inputs
			var aboutURI = f.aboutURI.value;
			var aboutType = f.aboutType.value;
			if (aboutURI) {
				annotations.push(Array("about",aboutURI));
			}
			if (aboutType) {
				annotations.push(Array("typeof",aboutType));
			}
			insert_annotation(tinyMCEPopup.editor,annotations,0);
			update_namespaces(tinyMCEPopup.editor,annotations)

			// ----------------------------------------------------------
			tinyMCEPopup.editor.nodeChanged();
			rdfaAbout.alignNSs();
			tinyMCEPopup.editor.execCommand('mceRdfaHighlight',false,'');
			// reload triple browser frame
			tinyMCEPopup.editor.execCommand('mceLoadTripleBrowser',false,'');
			tinyMCEPopup.close();
		}

};

tinyMCEPopup.onInit.add(rdfaAbout.init, rdfaAbout);
