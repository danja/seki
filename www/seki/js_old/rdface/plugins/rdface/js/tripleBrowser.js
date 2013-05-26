tinyMCEPopup.requireLangPack();
var rdf;
var tripleBrowser = {
		init : function() {
			var rootEl = tinyMCEPopup.editor.dom.getRoot();
			$("#rdfaGraphContent").html(rootEl.innerHTML);
			rdf = $("#rdfaGraphContent").rdf();
			namespaceArr=this.getNamespaces();
			$.each(namespaceArr,function(index, value) {
				rdf.prefix(value[0], value[1]);
			});
			$("#rdfaGraphContent").html(rdf.databank + "<hr/>");
			var objectArr = new Array();
			var subject = '', object = '', predicate = '', nodeValue = '', predicateType = '';
			// console.log(rdf.databank);
			$
			.each(
					rdf.databank.tripleStore,
					function(index, value) {
						subject = rdf.databank.tripleStore[index].subject.value._string;
						predicate = rdf.databank.tripleStore[index].property.value._string;
						object = rdf.databank.tripleStore[index].object.value;
						nodeValue=tripleBrowser.getPredicateNodeType(rdf,index)['nodeValue'];
						predicateType=tripleBrowser.getPredicateNodeType(rdf,index)['predicateType'];
						// console.log(rdf.databank.tripleStore[index]);
						// console.log (predicateType);<div
						// xmlns:dbpedia="http://dbpedia.org/resource/"
						// id="namespaces"
						// xmlns:rnews="http://dec.iptc.org/rnews/0.1/">
						// console.log (nodeValue);
						// hanlde multiple value properties
						if(nodeValue && nodeValue.split(" ").length>1){
							nodeValue=nodeValue.split(" ");
						}
						// console.log(divSt);
						$("#rdfaGraphContent")
						.html(
								$("#rdfaGraphContent").html()+"<span id='triplein"+index+"'>"
								+ tripleBrowser.createRow(predicateType, nodeValue, index,false)+"</span>");
					});

		},
		deleteHighlight : function(i) {
			// $("#triple"+i).css("border", "2px solid #ffaa33");
		},
		deleteUnHighlight : function(i) {
			// $("#triple"+i).css("border", "");
		},
		editHighlight : function(i) {
			// $("#triple"+i).css("border", "2px solid #779999");
		},
		editUnHighlight : function(i) {
			// $("#triple"+i).css("border", "");
		},
		getNamespaces : function(){
			// get list of all in used namespaces
			// TODO: do this using rdfquery functions
			var ns = tinyMCEPopup.editor.dom.get('namespaces');
			// get existing atts
			var atts = tinyMCEPopup.editor.dom.getAttribs(ns);
			var namespaceArr = new Array();
			// add some default namespaces
			namespaceArr.push(Array("rdf",
			"http://www.w3.org/1999/02/22-rdf-syntax-ns#"));
			namespaceArr
			.push(Array("rdfs", "http://www.w3.org/2000/01/rdf-schema#"));
			for ( var i = 0; i < atts.length; i++) {
				if (atts[i].name != "id") {
					namespaceArr.push(Array(atts[i].name.split(":")[1],
							atts[i].value));
				}
			}
			return namespaceArr;
		},
		shortenURI: function(uri){
			var uri_short;
			if(uri._string){
				uri=uri._string;
			}
			//console.log(typeof uri);
			uri=uri+'';
			namespaceArr=this.getNamespaces();
			// shorten namespace address
			$.each(namespaceArr, function(i, value) {
				uri_short = uri.replace(
						namespaceArr[i][1],
						namespaceArr[i][0] + ":");
				if (uri_short != uri) {
					return false;
				}
			});
			return uri_short;
		},

		createRow : function(predicateType, nodeValue, index, editableFlag) {
			var object = rdf.databank.tripleStore[index].object.value;
			var subject = rdf.databank.tripleStore[index].subject.value;
			var predicate=rdf.databank.tripleStore[index].property.value._string;
			var predicate_short = this.shortenURI(predicate);
			var subject_short = this.shortenURI(subject);
			var object_short = this.shortenURI(object);
			var bgcolor = "";
			var actionButtons;
			var SOP;
			var output;
			if (index % 2 == 0) {
				bgcolor = "style='background-color:white' ";
			} else {
				bgcolor = '';
			}
			//handle multiple node values
			var nodeValueContent=nodeValue;
			if($.isArray(nodeValueContent)){
				nodeValueContent=nodeValueContent.join(" ");
			}
			var meta_annotation="about='"+encodeURIComponent(subject)+"' "+predicateType+"='"+nodeValueContent+"' content="+encodeURIComponent($.trim(object_short))+" ";
			var onMouse = "onmouseover=tripleBrowser.highlightEditor('"
				+ predicateType
				+ "','"
				+ nodeValue
				+ "',"
				+ index + ")";
			var outMouse = "onmouseout=tripleBrowser.unhighlightEditor('"
				+ predicateType
				+ "','"
				+ nodeValue
				+ "',"
				+ index + ")";
			var divSt = "<div id='triple" + index + "' "+meta_annotation
			+ bgcolor + onMouse + " " + outMouse + ">";
			if(editableFlag){
				var thirdBox;
				thirdBox='<TEXTAREA id="o'+index+'" name="o'+index+'" COLS=40 ROWS=2>'+object_short+'</TEXTAREA>';
				if(predicateType=="typeof"){
					thirdBox='<input id="o'+index+'" name="o'+index+'" type="text" class="text" size="40" value="'+object_short+'" />';
				}
				actionButtons='<span id="saveCancel'+index+'" style="float:right;"><img title="save" style="cursor:pointer;" src="img/save.gif" onclick=tripleBrowser.save("'+ predicateType
				+ '","'
				+ nodeValue
				+ '","'
				+ index+'") /><br/><img title="cancel" style="cursor:pointer;" src="img/cancel.png" onclick=tripleBrowser.cancel("'+ predicateType
				+ '","'
				+ nodeValue
				+ '","'
				+ index+'") /></span>';
				SOP='<table><tr><td><b>S:</b></td><td><input id="s'+index+'" name="s'+index+'" type="text" class="text" size="40" value="'+subject_short+'" /></td></tr><tr><td><b>P:</b></td><td><input id="p'+index+'" name="p'+index+'" type="text" class="text" size="40" value="'+predicate_short+'" /></td></tr><tr><td><b>O:</b></td><td>'+thirdBox+'</td></tr></table>';
				output=divSt+actionButtons+SOP+'<hr></div>';
			}else{
				actionButtons='<span id="editDel'+index+'" style="float:right;display:none;"><img title="edit" style="cursor:pointer;" src="img/edit.gif" onmouseover=tripleBrowser.editHighlight("'+ index +'") onmouseout=tripleBrowser.editUnHighlight("'+ index +'") onclick=tripleBrowser.edit("'+ predicateType
				+ '","'
				+ nodeValue
				+ '","'
				+ index+'") /><br/><img title="delete" style="cursor:pointer;" src="img/delete.gif" onmouseover=tripleBrowser.deleteHighlight("'+ index +'") onmouseout=tripleBrowser.deleteUnHighlight("'+ index +'") onclick=tripleBrowser.delete("'+ predicateType
				+ '","'
				+ nodeValue
				+ '","'
				+ index+'") /></span>';	
				SOP='<table><tr><td><b>S:</b></td><td><font color="#0a314d"><a style="text-decoration:none;" target="_blank" href="'+subject+'">'+subject_short+'</a></font></td></tr><tr><td><b>P:</b></td><td><font color="#5d3808">'+predicate_short+'</font></td></tr><tr><td><b>O:</b></td><td>'+object_short+'</td></tr></table>';
				output=divSt+actionButtons+SOP+'<hr></div>';
			}
			return output;
		},
		getPredicateNodeType: function(rdfDB, index){
			var output=new Array();
			if(rdfDB.top){
				$
				.each(
						rdfDB.databank.tripleStore[index].source.attributes,
						function(index2, value2) {
							if (rdfDB.databank.tripleStore[index].source.attributes[index2].name == "property") {
								output['nodeValue']  = rdfDB.databank.tripleStore[index].source.attributes[index2].nodeValue;
								output['predicateType'] = "property";
							}
							if (rdfDB.databank.tripleStore[index].source.attributes[index2].name == "typeof") {
								output['nodeValue']  = rdfDB.databank.tripleStore[index].source.attributes[index2].nodeValue;
								output['predicateType'] = "typeof";
							}
							if (rdfDB.databank.tripleStore[index].source.attributes[index2].name == "rel") {
								output['nodeValue']  = rdfDB.databank.tripleStore[index].source.attributes[index2].nodeValue;
								output['predicateType'] = "rel";
							}
						});	
			}else{
				$
				.each(
						rdfDB.matches[index].triples[0].source.attributes,
						function(index2, value2) {
							if (rdfDB.matches[index].triples[0].source.attributes[index2].name == "property") {
								output['nodeValue']  = rdfDB.matches[index].triples[0].source.attributes[index2].nodeValue;
								output['predicateType'] = "property";
							}
							if (rdfDB.matches[index].triples[0].source.attributes[index2].name == "typeof") {
								output['nodeValue']  = rdfDB.matches[index].triples[0].source.attributes[index2].nodeValue;
								output['predicateType'] = "typeof";
							}
							if (rdfDB.matches[index].triples[0].source.attributes[index2].name == "rel") {
								output['nodeValue']  = rdfDB.matches[index].triples[0].source.attributes[index2].nodeValue;
								output['predicateType'] = "rel";
							}
						});	
			}

			return output;
		},
		deleteTriple : function(predicateType, nodeValue, i) {
			var tmp;
			tinyMCEPopup.editor.windowManager.confirm("Are you sure that you want to delete this triple ?", function(s) {
				if (s){
					tripleBrowser.unhighlightEditor(predicateType, nodeValue, i);
					// check to see if other triples using this subject
					var subject = rdf.databank.tripleStore[i].subject.value._string;
					var rdf2 = rdf.prefix('foaf', 'http://xmlns.com/foaf/0.1/').prefix('rnews', 'http://dec.iptc.org/rnews/0.1/')
					.where('<'+subject+'> ?predicate ?object');
					// console.log(rdf);
					// console.log(rdf2);
					var size=rdf2.size()-1;
					var notif='';
					if(size>1){notif="There are "+size+" other triples sharing the same subject.Do you want to delete them as well?";}else{notif="There is one other triple sharing the same subject.Do you want to delete it as well?";}
					if(size>0){
						tinyMCEPopup.editor.windowManager.confirm(notif, function(r) {
							if (r){ // delete all the related
								$.each(rdf2, function(index, value){
									tmp=tripleBrowser.getPredicateNodeType(rdf2,index);
									tripleBrowser.deleteTriple(rdf2, tmp['predicateType'], tmp['nodeValue'], index,false);
								});
								tinyMCEPopup.editor.execCommand('mceLoadTripleBrowser', false, '');
								return null;
							}   
							else{
								tripleBrowser.deleteTriple(rdf, predicateType, nodeValue, i,true);
								tinyMCEPopup.editor.execCommand('mceLoadTripleBrowser', false, '');
								return null;
							}
						});	
					}else{
						tripleBrowser.deleteTriple(rdf, predicateType, nodeValue, i,false);
						tinyMCEPopup.editor.execCommand('mceLoadTripleBrowser', false, '');
					}
				} else{return null;}});	
		},	
		// haveRelatedTriples-> if there are related triples we don't have to
		// delete about attribute
		// TODO: remove SPAN,DIV tags with no property to clean up the codes
		// TODO: in some cases about attribute is not deleted!
		deleteTriple : function(rdfDB, predicateType, nodeValue, i, haveRelatedTriples) {
			var multipleValueFlag=false;
			var aboutNode,selected,predicate,predicate_short;
			// handle properties with multiple value
			if(nodeValue && nodeValue.split(',').length>1){
				multipleValueFlag=true;
				var tmp=nodeValue.split(',');
				nodeValue=tmp.join(' ');
				if(rdfDB.top){
					predicate=rdfDB.databank.tripleStore[i].property.value._string;
				}else{
					predicate=rdfDB[i].property.value._string;
				}
				predicate_short = this.shortenURI(predicate);
			}
			var subject;
			if(rdfDB.top){
				subject = rdfDB.databank.tripleStore[i].subject.value._string;
			}else{
				subject = rdfDB["matches"][0]["triples"][0].subject.value._string;
			}
			var object;
			// if it is a subset of main rdf db
			if(rdfDB.top){
				object = rdfDB.databank.tripleStore[i].object.value;
			}else{
				object = rdfDB[i].object.value;
			}
			var querySt = "*[" + predicateType + "='" + nodeValue + "']";
			// console.log(querySt);
			// check whether wee need to use object or not
			selected=$(tinyMCEPopup.editor.getDoc()).find(querySt);
			if (selected.size() > 1) {"*[" + predicateType + "='" + nodeValue + "']";
			// we need to check inline attributes like @rel or
			// property with
			// content
			// TODO: it acts only on href of exisitng element but we
			// need to
			// investigate other nested attributes related to rel
			if (predicateType == "rel") {
				$.each(selected, function(key, value) {
					if ($(value).attr('href') == object) {
						if(multipleValueFlag){
							$(value).attr(predicateType,tripleBrowser.removePropertyValue(predicate_short, nodeValue));
						}else{
							$(value).removeAttr(predicateType);
						}
						if(!haveRelatedTriples){
							aboutNode=tripleBrowser.findAboutNode($(value));
							aboutNode.removeAttr('about');
							$(tinyMCEPopup.editor.getDoc()).find("*[about='" + subject + "']").removeAttr('about');
						}
					}
				});
			}
			if (predicateType == "typeof") {
				$.each(selected, function(key, value) {
					if ($(value).attr('about') == subject) {
						if(multipleValueFlag){
							$(value).attr(predicateType,tripleBrowser.removePropertyValue(predicate_short, nodeValue));
						}else{
							$(value).removeAttr(predicateType);
						}
						if(!haveRelatedTriples){
							aboutNode=tripleBrowser.findAboutNode($(value));
							aboutNode.removeAttr('about');
							$(tinyMCEPopup.editor.getDoc()).find("*[about='" + subject + "']").removeAttr('about');
						}
					}
				});
			} else {
				$.each(selected, function(key, value) {
					if ($(value).attr('content')) {
						if ($(value).attr('content') == object) {
							if(multipleValueFlag){
								$(value).attr(predicateType,tripleBrowser.removePropertyValue(predicate_short, nodeValue));
								$(value).removeAttr('content');
							}else{
								$(value).removeAttr(predicateType);
								$(value).removeAttr('content');
							}
							if(!haveRelatedTriples){
								aboutNode=tripleBrowser.findAboutNode($(value));
								aboutNode.removeAttr('about');
								$(tinyMCEPopup.editor.getDoc()).find("*[about='" + subject + "']").removeAttr('about');
							}
						}								
					} else {
						// manage tinymce redundant hidden
						// attributes
						object = object.replace(/\s(data-mce-href=)".*?"/g, "");
						object = object.replace(/\s(xmlns=)".*?"/g, "");
						contentHTML=$(value).html();
						contentHTML = contentHTML.replace(/\s(data-mce-href=)".*?"/g, "");
						contentHTML = contentHTML.replace(/\s(xmlns=)".*?"/g, "");						
						if (contentHTML == object) {
							if(multipleValueFlag){
								$(value).attr(predicateType,tripleBrowser.removePropertyValue(predicate_short, nodeValue));
							}else{
								$(value).removeAttr(predicateType);
							}
							if(!haveRelatedTriples){
								aboutNode=tripleBrowser.findAboutNode($(value));
								aboutNode.removeAttr('about');
								$(tinyMCEPopup.editor.getDoc()).find("*[about='" + subject + "']").removeAttr('about');
							}
						}
					}
				});
			}
			} else {
				if(multipleValueFlag){
					selected.attr(predicateType,tripleBrowser.removePropertyValue(predicate_short, nodeValue));
					selected.removeAttr('content');
				}else{
					selected.removeAttr(predicateType).removeAttr('content');
					// remove redundant <spans
					var tmp=tinyMCEPopup.editor.dom.getOuterHTML(selected[0]);
					tmp=tmp.replace('<span style="">'+selected.html()+'</span>',selected.html());
					tinyMCEPopup.editor.dom.setOuterHTML(selected[0],tmp);
				}
				if(!haveRelatedTriples){
					aboutNode=tripleBrowser.findAboutNode(selected);
					aboutNode.removeAttr('about');
					$(tinyMCEPopup.editor.getDoc()).find("*[about='" + subject + "']").removeAttr('about');
				}
			}
		},
		deleteTriple : function(predicateType, nodeValue, i) {
			var tmp;
			tinyMCEPopup.editor.windowManager.confirm("Are you sure that you want to delete this triple ?", function(s) {
				if (s){
					tripleBrowser.unhighlightEditor(predicateType, nodeValue, i);
					// check to see if other triples using this subject
					var subject = rdf.databank.tripleStore[i].subject.value._string;
					var rdf2 = rdf.prefix('foaf', 'http://xmlns.com/foaf/0.1/').prefix('rnews', 'http://dec.iptc.org/rnews/0.1/')
					.where('<'+subject+'> ?predicate ?object');
					// console.log(rdf);
					// console.log(rdf2);
					var size=rdf2.size()-1;
					var notif='';
					if(size>1){notif="There are "+size+" other triples sharing the same subject.Do you want to delete them as well?";}else{notif="There is one other triple sharing the same subject.Do you want to delete it as well?";}
					if(size>0){
						tinyMCEPopup.editor.windowManager.confirm(notif, function(r) {
							if (r){ // delete all the related
								$.each(rdf2, function(index, value){
									tmp=tripleBrowser.getPredicateNodeType(rdf2,index);
									tripleBrowser.deleteTriple(rdf2, tmp['predicateType'], tmp['nodeValue'], index,false);
								});
								tinyMCEPopup.editor.execCommand('mceLoadTripleBrowser', false, '');
								return null;
							}   
							else{
								tripleBrowser.deleteTriple(rdf, predicateType, nodeValue, i,true);
								tinyMCEPopup.editor.execCommand('mceLoadTripleBrowser', false, '');
								return null;
							}
						});	
					}else{
						tripleBrowser.deleteTriple(rdf, predicateType, nodeValue, i,false);
						tinyMCEPopup.editor.execCommand('mceLoadTripleBrowser', false, '');
					}
				} else{return null;}});	
		},	
		// haveRelatedTriples-> if there are related triples we don't have to
		// edit about attribute
		editTriple : function(rdfDB, newSubject, newPredicate, newObject, i, haveRelatedTriples) {
			var tmp=tripleBrowser.getPredicateNodeType(rdfDB,i);
			var nodeValue=tmp['nodeValue'];
			var predicateType=tmp['predicateType'];
			// var nodeValue=newPredicate;
			var multipleValueFlag=false;
			var aboutNode,selected,predicate,predicate_short;
			// handle properties with multiple value
			if(nodeValue && nodeValue.split(',').length>1){
				multipleValueFlag=true;
				var tmp=nodeValue.split(',');
				nodeValue=tmp.join(' ');
				if(rdfDB.top){
					predicate=rdfDB.databank.tripleStore[i].property.value._string;
				}else{
					predicate=rdfDB[i].property.value._string;
				}
				predicate_short = this.shortenURI(predicate);
			}
			var subject;
			if(rdfDB.top){
				subject = rdfDB.databank.tripleStore[i].subject.value._string;
			}else{
				subject = rdfDB["matches"][0]["triples"][0].subject.value._string;
			}
			var object;
			// if it is a subset of main rdf db
			if(rdfDB.top){
				object = rdfDB.databank.tripleStore[i].object.value;
			}else{
				object = rdfDB[i].object.value;
			}
			var querySt = "*[" + predicateType + "='" + nodeValue + "']";
			// console.log(querySt);
			// check whether wee need to use object or not
			selected=$(tinyMCEPopup.editor.getDoc()).find(querySt);
			if (selected.size() > 1) {"*[" + predicateType + "='" + nodeValue + "']";
			// we need to check inline attributes like @rel or
			// property with
			// content
			// TODO: it acts only on href of exisitng element but we
			// need to
			// investigate other nested attributes related to rel
			if (predicateType == "rel") {
				$.each(selected, function(key, value) {
					if ($(value).attr('href') == object) {
						if(multipleValueFlag){
							$(value).attr(predicateType,tripleBrowser.editPropertyValue(predicate_short,newPredicate, nodeValue));
						}else{
							$(value).attr(predicateType,newPredicate);
						}
						if(!haveRelatedTriples){
							aboutNode=tripleBrowser.findAboutNode($(value));
							aboutNode.attr('about',newSubject);
							$(tinyMCEPopup.editor.getDoc()).find("*[about='" + subject + "']").attr('about',newSubject);
						}
						//to prevent from updating from enricher
						$(value).removeClass('automatic');
						$(value).removeClass('automaticExtra');
					}
				});
			}
			if (predicateType == "typeof") {
				$.each(selected, function(key, value) {
					if ($(value).attr('about') == subject) {
						if(multipleValueFlag){
							$(value).attr(predicateType,tripleBrowser.editPropertyValue(predicate_short,newObject, nodeValue));
						}else{
							$(value).attr(predicateType,newObject);
						}
						if(!haveRelatedTriples){
							aboutNode=tripleBrowser.findAboutNode($(value));
							aboutNode.attr('about',newSubject);
							$(tinyMCEPopup.editor.getDoc()).find("*[about='" + subject + "']").attr('about',newSubject);
						}
						//to prevent from updating from enricher
						$(value).removeClass('automatic');
						$(value).removeClass('automaticExtra');
					}
				});
			} else {
				$.each(selected, function(key, value) {
					if ($(value).attr('content')) {
						if ($(value).attr('content') == object) {
							if(multipleValueFlag){
								$(value).attr(predicateType,tripleBrowser.editPropertyValue(predicate_short,newPredicate, nodeValue));
								$(value).attr('content',newObject);
							}else{
								$(value).attr(predicateType,newPredicate);
								$(value).attr('content',newObject);
							}
							if(!haveRelatedTriples){
								aboutNode=tripleBrowser.findAboutNode($(value));
								aboutNode.attr('about',newSubject);
								$(tinyMCEPopup.editor.getDoc()).find("*[about='" + subject + "']").attr('about',newSubject);
							}
							//to prevent from updating from enricher
							$(value).removeClass('automatic');
							$(value).removeClass('automaticExtra');
						}								
					} else {
						// manage tinymce redundant hidden
						// attributes
						object = object.replace(/\s(data-mce-href=)".*?"/g, "");
						object = object.replace(/\s(xmlns=)".*?"/g, "");
						contentHTML=$(value).html();
						contentHTML = contentHTML.replace(/\s(data-mce-href=)".*?"/g, "");
						contentHTML = contentHTML.replace(/\s(xmlns=)".*?"/g, "");						
						if (contentHTML == object) {
							if(multipleValueFlag){
								$(value).attr(predicateType,tripleBrowser.editPropertyValue(predicate_short,newPredicate, nodeValue));
							}else{
								$(value).attr(predicateType,newPredicate);
							}
							if(!haveRelatedTriples){
								aboutNode=tripleBrowser.findAboutNode($(value));
								aboutNode.attr('about',newSubject);
								$(tinyMCEPopup.editor.getDoc()).find("*[about='" + subject + "']").attr('about',newSubject);
							}
							//to prevent from updating from enricher
							$(value).removeClass('automatic');
							$(value).removeClass('automaticExtra');
						}
					}
				});
			}
			} else {
				if(multipleValueFlag){
					selected.attr(predicateType,tripleBrowser.editPropertyValue(predicate_short,newPredicate, nodeValue));
					selected.attr('content',newObject);
				}else{
					selected.attr(predicateType,newPredicate).attr('content',newObject);
					// remove redundant <spans
					var tmp=tinyMCEPopup.editor.dom.getOuterHTML(selected[0]);
					tmp=tmp.replace('<span style="">'+selected.html()+'</span>',selected.html());
					tinyMCEPopup.editor.dom.setOuterHTML(selected[0],tmp);
				}
				if(!haveRelatedTriples){
					aboutNode=tripleBrowser.findAboutNode(selected);
					aboutNode.attr('about',newSubject);
					$(tinyMCEPopup.editor.getDoc()).find("*[about='" + subject + "']").attr('about',newSubject);
				}
				//to prevent from updating from enricher
				selected.removeClass('automatic');
				selected.removeClass('automaticExtra');
			}
		},
		edit : function(predicateType, nodeValue, i) {
			$("#triplein"+i).html(tripleBrowser.createRow(predicateType, nodeValue, i,true));
		},
		cancel : function(predicateType, nodeValue, i) {
			$("#triplein"+i).html(tripleBrowser.createRow(predicateType, nodeValue, i,false));
		},
		save : function(predicateType, nodeValue, i) {
			var object = rdf.databank.tripleStore[i].object.value;
			var subject = rdf.databank.tripleStore[i].subject.value;
			var predicate=rdf.databank.tripleStore[i].property.value._string;
			var predicate_short = this.shortenURI(predicate);
			var subject_short = this.shortenURI(subject);
			var object_short = this.shortenURI(object);
			// update triple
			var newSubject=$("#s"+i).val();
			var newPredicate=$("#p"+i).val();
			var newObject=$("#o"+i).val();
			if((newSubject==subject_short)&&(newPredicate==predicate_short)&&(newObject==object_short)){
				// no change applied, do nothing
				$("#triplein"+i).html(tripleBrowser.createRow(predicateType, nodeValue, i,false));
			}else{
				tripleBrowser.unhighlightEditor(predicateType, nodeValue, i);
				// check to see if other triples using this subject
				var rdf2 = rdf.prefix('foaf', 'http://xmlns.com/foaf/0.1/').prefix('rnews', 'http://dec.iptc.org/rnews/0.1/')
				.where('<'+subject+'> ?predicate ?object');
				var size=rdf2.size()-1;
				var notif='';
				if(size>1){notif="There are "+size+" other triples sharing the same subject.Do you want to apply your change to them as well?";}else{notif="There is one other triple sharing the same subject.Do you want to apply your change to it as well?";}
				if(size>0){
					if(newSubject!=subject){
						tinyMCEPopup.editor.windowManager.confirm(notif, function(r) {
							if (r){ // edit all the related
								$.each(rdf2, function(index, value){
									tripleBrowser.editTriple(rdf2, newSubject,newPredicate, newObject, index,false);
								});
								tinyMCEPopup.editor.execCommand('mceLoadTripleBrowser', false, '');
								return null;
							}   
							else{
								tripleBrowser.editTriple(rdf, newSubject,newPredicate, newObject, i,true);
								tinyMCEPopup.editor.execCommand('mceLoadTripleBrowser', false, '');
								return null;
							}
						});	
					}else{
						tripleBrowser.editTriple(rdf, newSubject,newPredicate, newObject, i,false);
						tinyMCEPopup.editor.execCommand('mceLoadTripleBrowser', false, '');
					}
				}else{
					tripleBrowser.editTriple(rdf, newSubject,newPredicate, newObject, i,false);
					tinyMCEPopup.editor.execCommand('mceLoadTripleBrowser', false, '');
				}	
			}

		},
		findAboutNode : function(node) {
			/*
			 * var output,atts,limit,i=false; limit=10; node=node[0]; while(!i &&
			 * limit){ limit--; var atts =
			 * tinyMCEPopup.editor.dom.getAttribs(node); for ( var j = 0; j <
			 * atts.length; j++) { if (atts[j].name == "about") { i=true;
			 * output=node; } } node=tinyMCEPopup.editor.dom.getParent(node);
			 * console.log(node); }
			 */
			return node;
		},
		// removes property from multiple value properties
		removePropertyValue : function(predicate_short, nodeValue) {
			var tmp=nodeValue.split(' ');
			tmp.splice(tmp.indexOf(predicate_short),1);
			var output=tmp.join(' ');
			return output;
		},
		editPropertyValue: function(predicate_short,newPredicate, nodeValue){
			var tmp=nodeValue.split(' ');
			tmp[tmp.indexOf(predicate_short)]=newPredicate;
			var output=tmp.join(' ');
			return output;
		},
		// gets predicate selector: querySt
		// gets index of object: i
		highlightEditor : function(predicateType, nodeValue, i) {
			// show edit and delete buttons
			$("#editDel"+i).css("display", "inline");
			// handle properties with multiple value
			if(nodeValue && nodeValue.split(',').length>1){
				var tmp=nodeValue.split(',');
				nodeValue=tmp.join(' ');
			}
			$("#triple"+i).css("background-color", "#eeff22");
			var querySt = "*[" + predicateType + "='" + nodeValue + "']";
			// console.log(querySt);
			// check whether wee need to use object or not
			if ($(tinyMCEPopup.editor.getDoc()).find(querySt).size() > 1) {
				var object = rdf.databank.tripleStore[i].object.value;
				// we need to check inline attributes like @rel or property with
				// content
				// TODO: it acts only on href of exisitng element but we need to
				// investigate other nested attributes related to rel
				if (predicateType == "rel") {
					$.each($(tinyMCEPopup.editor.getDoc()).find(querySt), function(key, value) {
						if ($(value).attr('href') == object) {
							$(value).css("background-color", "#eeff22");
						}
					});
				}
				if (predicateType == "typeof") {
					var subject = rdf.databank.tripleStore[i].subject.value._string;
					$.each($(tinyMCEPopup.editor.getDoc()).find(querySt), function(key, value) {
						if ($(value).attr('about') == subject) {
							$(value).css("background-color", "#eeff22");
						}
					});
				} else {
					$.each($(tinyMCEPopup.editor.getDoc()).find(querySt), function(key, value) {
						if ($(value).attr('content')) {
							if ($(value).attr('content') == object) {
								$(value).css("background-color", "#eeff22");
							}								
						} else {
							// manage tinymce redundant hidden attributes
							object = object.replace(/\s(data-mce-href=)".*?"/g, "");
							object = object.replace(/\s(xmlns=)".*?"/g, "");
							contentHTML=$(value).html();
							contentHTML = contentHTML.replace(/\s(data-mce-href=)".*?"/g, "");
							contentHTML = contentHTML.replace(/\s(xmlns=)".*?"/g, "");						
							if (contentHTML == object) {
								$(value).css("background-color", "#eeff22");
							}
						}
					});
				}
			} else {
				$(tinyMCEPopup.editor.getDoc()).find(querySt).css("background-color", "#eeff22");
			}
			// TODO: how to show/hide display none items?
		},
		unhighlightEditor : function(predicateType, nodeValue, i) {
			// hide edit and delete buttons
			$("#editDel"+i).css("display", "none");
			// handle properties with multiple value
			if(nodeValue && nodeValue.split(',').length>1){
				var tmp=nodeValue.split(',');
				nodeValue=tmp.join(' ');
			}	
			$("#triple"+i).css("background-color", "");
			var querySt = "*[" + predicateType + "='" + nodeValue + "']";
			// check whether wee need to use object or not
			if ($(tinyMCEPopup.editor.getDoc()).find(querySt).size() > 1) {
				var object = rdf.databank.tripleStore[i].object.value;
				// we need to check inline attributes like @rel or property with
				// content
				if (predicateType == "rel") {
					$.each($(tinyMCEPopup.editor.getDoc()).find(querySt), function(key, value) {
						if ($(value).attr('href') == object) {
							$(value).css("background-color", "");
						}
					});
				}
				if (predicateType == "typeof") {
					var subject = rdf.databank.tripleStore[i].subject.value._string;
					$.each($(tinyMCEPopup.editor.getDoc()).find(querySt), function(key, value) {
						if ($(value).attr('about') == subject) {
							$(value).css("background-color", "");
						}
					});
				} else {
					$.each($(tinyMCEPopup.editor.getDoc()).find(querySt), function(key, value) {
						if ($(value).attr('content')) {
							if ($(value).attr('content') == object) {
								$(value).css("background-color", "");
							}								
						} else {
							// manage tinymce redundant hidden attributes
							object = object.replace(/\s(data-mce-href=)".*?"/g, "");
							object = object.replace(/\s(xmlns=)".*?"/g, "");
							contentHTML=$(value).html();
							contentHTML = contentHTML.replace(/\s(data-mce-href=)".*?"/g, "");
							contentHTML = contentHTML.replace(/\s(xmlns=)".*?"/g, "");						
							if (contentHTML == object) {
								$(value).css("background-color", "");
							}
						}
					});
				}
			} else {
				$(tinyMCEPopup.editor.getDoc()).find(querySt).css("background-color", "");
			}
		}
}

tinyMCEPopup.onInit.add(tripleBrowser.init, tripleBrowser);
