function remove_annotation(editor,selectedNode){
	var atts = editor.dom.getAttribs(selectedNode);
	for ( var i = 0; i < atts.length; i++) {
		if (atts[i].name == "about" || atts[i].name == "typeof" || atts[i].name == "property" || atts[i].name == "rel") {
			selectedNode.removeAttribute(atts[i].name);
		}
		var tmp=editor.dom.getOuterHTML(selectedNode);
		tmp=tmp.replace('<span>'+selectedNode.innerHTML+'</span>',selectedNode.innerHTML);
		editor.dom.setOuterHTML(selectedNode,tmp);
	}
	editor.nodeChanged();
}

function insert_annotation(editor,annotations,isHidden){
	var selectedContent = editor.selection.getContent();
	var selectedContentText=editor.selection.getContent({format : 'text'})
	var selectedNode = editor.selection.getNode();
	var nodeContent = selectedNode.innerHTML;
	// remove tinymce redundant data-mcs-href attribute
	nodeContent = nodeContent.replace(/\s(data-mce-href=)".*?"/g, "");
	nodeContent = nodeContent.replace(/\s(xmlns=)".*?"/g, "");
	// Annotation methods
	// if there is no need to add new tag
	if ((selectedContent == nodeContent) || (selectedContentText==$(selectedContent).html())) {
		// add annotation attributes
		$.each(annotations, function(index,value){
			// handles properties/rels with multiple values
			if(value[0]=="property" || value[0]=="rel"){
				if (editor.dom.getAttrib(selectedNode, value[0])) {
					editor.dom.setAttrib(selectedNode,value[0],value[1]+ " "+ editor.dom.getAttrib(selectedNode,value[0]));
				}else{
					editor.dom.setAttrib(selectedNode,value[0],value[1]);
				}	
			}else{
				editor.dom.setAttrib(selectedNode,value[0],value[1]);
			}
		});
		// if display none
		if (isHidden) {
			editor.dom.setAttrib(selectedNode, "style","display:none;");
		}
	} else {
		// -----------we need to add a new neutral html tag which involves
		// our annotation attributes
		// to do this we also need to check whether there is a paragraph or
		// not (to use DIV or SPAN)
		var temp = '';
		// if display none
		if (isHidden) {
			temp += "style= 'display:none' ";
		}
		$.each(annotations, function(index,value){
			temp += " "+value[0]+"=" + value[1];
		});
		var annotatedContent = "<span" + temp + ">" + selectedContent
		+ "</span>";
		if ((editor.selection.getRng().startContainer.data != editor.selection
				.getRng().endContainer.data)
				|| editor.selection.getRng().commonAncestorContainer.nodeName == "BODY") {
			annotatedContent = "<div" + temp + ">" + selectedContent
			+ "</div>";
		}
		editor.selection.setContent(annotatedContent);
		//editor.execCommand('mceInsertRawHTML', false,annotatedContent);
	}
	editor.nodeChanged();
}

function update_namespaces(editor,annotations){
	// check if it is a new namespace,if yes add it to namespaces automatically
	var ns =editor.dom.get('namespaces');
	var existingNS = new Array();
	if(ns){
		// get existing prefixes
		var atts = editor.dom.getAttribs(ns);
		for ( var i = 0; i < atts.length; i++) {
			if (atts[i].name != "id") {
				existingNS.push(atts[i].name.split(":")[1]);
			}
		}
	}	
	$.each(annotations, function(index,value){
		if(value[0]=="typeof" || value[0]=="property" || value[0]=="rel"){		
			// get user entered prefix
			var item, nsURI;
			if (value[1].split(":").length == 2) {
				item = value[1].split(":")[0];
			}
			// check if it alreay exist
			if ((existingNS.indexOf(item) != -1) || item == "stylesheet") {
			} else {
				// not exists
				// search in local repository and autoamtically add ns
				nsURI = popular_prefixes[item];
				if (nsURI) {
					if (ns) {
						editor.dom.setAttrib(ns, "xmlns:" + item,
								nsURI);
					} else {
						// add namespace elemenet
						var el = "<div id='namespaces' xmlns:" + item + "='" + nsURI + "'>";
						var rootEl = editor.dom.getRoot();
						rootEl.innerHTML = el + rootEl.innerHTML + "</div>";
					}
				}
			}
		}
	});
	editor.nodeChanged();
}
