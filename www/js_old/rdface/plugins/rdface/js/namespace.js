tinyMCEPopup.requireLangPack();
var nsArr=new Array();
var rdfaNamespace = {
	init : function() {		
		// Get the selected contents as text and place it in the input
		// we can set a default namespace if there is no namespace
		var ns = tinyMCEPopup.editor.dom.get('namespaces');
		if (ns) {
			// get a list of existing namespaces
			var atts = tinyMCEPopup.editor.dom.getAttribs(ns);
			for ( var i = 0; i < atts.length; i++) {
				if (atts[i].name != "id") {
					nsArr.push(Array(atts[i].name.split(":")[1],atts[i].value));
				}
			}
		}
		this.makeList();
	},
	removeNS: function(key){
		$("#ns"+key).remove();
		$("#nsURI"+key).remove();
		$("#del"+key).remove();
		nsArr.splice(key,1)
		this.makeList();
		return false;
	},	
	makeList: function(){
		if(nsArr.length){
			var nsList="<table align='center'><tr><td><b>Name</b></td><td align='center'><b>URI</b></td></tr>";
			$.each(nsArr, function(key,val){
				nsList=nsList+'<tr><td><input id="ns'+key+'" name="ns'+key+'" type="text" class="text" size="10" value="'+nsArr[key][0]+'" DISABLED /></td><td><input id="nsURI'+key+'" name="nsURI'+key+'" type="text" class="text" size="40" value="'+nsArr[key][1]+'"/><a style="text-decoration:none;" href="#" id="del'+key+'" title="remove namespace" onclick="rdfaNamespace.removeNS('+key+');">&nbsp;<b>-</b></a></td></tr>';
			});
			//add new ns
			nsList=nsList+'<tr><td></td><td align="right"><a style="text-decoration:none;" href="#" title="add namespace" onclick="rdfaNamespace.new();">&nbsp;<b>+</b></a></td></tr>';
			nsList=nsList+"</table>";
			$("#nsList").html(nsList);
		}else{
			$("#nsList").html('<br/><center>No namespace exists.<a style="text-decoration:none;" href="#" title="add namespace" onclick="rdfaNamespace.new();"><b>Add a namespace</b></a></center>');
		}	
	},
	newNS : function() {	
		$('#nsURI').focus(function() {
			var ns=$("#nsName").val();
			if(ns && !$("#nsURI").val()){
				var nsURI=popular_prefixes[ns];
				if(nsURI){
					$("#nsURI").val(nsURI);
				}
			}
			});
		$("#newNS")
		.dialog(
				{
					width : 320,
					title : 'New Namespace',
					buttons : {
						"Add" : function() {
							var ns=$("#nsName").val();
							var nsURI=$("#nsURI").val();
							if(ns && nsURI){
							nsArr.push(Array(ns,nsURI));
							rdfaNamespace.makeList();
							}
							$("#nsName").val("");
							$("#nsURI").val("");
							$(this).dialog("close");
							},
						"Skip" : function() {
							$("#nsName").val("");
							$("#nsURI").val("");
							$(this).dialog("close");
						}
					}
				})	
	},
	findNS : function() {
		var ns = tinyMCEPopup.editor.dom.get('namespaces');
		var dataReceived;
		// get existing prefixes
		var atts = tinyMCEPopup.editor.dom.getAttribs(ns);
		var existingNS=new Array();
		var totalArr=new Array();
		for ( var i = 0; i < atts.length; i++) {
			if (atts[i].name != "id") {
				existingNS.push(atts[i].name.split(":")[1]);
				totalArr.push(Array(atts[i].name.split(":")[1],atts[i].value));
			}
		}	
		// get list of already in use attributes to catch name spaces for them
		var item,querySt,nsArr2=new Array();
		$.each($(tinyMCEPopup.editor.getDoc()).find('*[property]'), function(index, value) { 
			// handle attributes with multiple values
			var multiArr=$(this).attr('property').split(" ");
			if(multiArr.length >1){
				$.each(multiArr, function(index, value) { 
					item=multiArr[index].split(":")[0];
					if((nsArr2.indexOf(item) != -1)|| item=="stylesheet"){
					}else{
						nsArr2.push(item);
					}
				});	
			}else{
			var attArr=$(this).attr('property').split(":");
				if(attArr.length>1){
					item=$(this).attr('property').split(":")[0];
					if((nsArr2.indexOf(item) != -1)|| item=="stylesheet"){
					}else{
						nsArr2.push(item);
					}				
				}
				
			}
		});
		$.each($(tinyMCEPopup.editor.getDoc()).find('*[rel]'), function(index, value) { 
			// handle attributes with multiple values
			var multiArr=$(this).attr('rel').split(" ");
			if(multiArr.length>1){
				$.each(multiArr, function(index, value) { 
					item=multiArr[index].split(":")[0];
					if((nsArr2.indexOf(item) != -1)|| item=="stylesheet"){
					}else{
						nsArr2.push(item);
					}
				});	
			}else{
			var attArr=$(this).attr('rel').split(":");
				if(attArr.length>1){
					item=$(this).attr('rel').split(":")[0];
					if((nsArr2.indexOf(item) != -1)|| item=="stylesheet"){
					}else{
						nsArr2.push(item);
					}				
				}			
			}
		});	
		$.each($(tinyMCEPopup.editor.getDoc()).find('*[typeof]'), function(index, value) { 
			// handle attributes with multiple values
			var multiArr=$(this).attr('typeof').split(" ");
			if(multiArr.length>1){
				$.each(multiArr, function(index, value) { 
					item=multiArr[index].split(":")[0];
					if((nsArr2.indexOf(item) != -1)|| item=="stylesheet"){
					}else{
						nsArr2.push(item);
					}
				});	
			}else{
			var attArr=$(this).attr('typeof').split(":");
				if(attArr.length>1){
					item=$(this).attr('typeof').split(":")[0];
					if((nsArr2.indexOf(item) != -1)|| item=="stylesheet"){
					}else{
						nsArr2.push(item);
					}				
				}				
			}
		});	
		// first do a local search on popular namespaces
		// if not found on local search, do a remote search on external API
		var resultArr=new Array();
		var notFoundArr=new Array();
		$.each(nsArr2,function(key,val){
			var nsURI = popular_prefixes[nsArr2[key]];
			if(nsURI){
				// check if it already exists
				if(existingNS.indexOf(nsArr2[key]) != -1){
				// it includes the ns
				}else{				
					resultArr.push(Array(nsArr2[key],nsURI));
				}				
			}else{
				notFoundArr.push(nsArr2[key]);
			}
		});
		if(notFoundArr.length){
			querySt=notFoundArr.join();
			  /* Gets called when request starts */
			  $("#loading").ajaxStart(function(){
				  $(this).css("display","inline");
			  });
			  /* Gets called when request complete */
			  $("#loading").ajaxComplete(function(){
				  $(this).css("display","none");
			  });			
			$.ajax({
				type : "GET",
				async : false,
				url : "http://prefix.cc/"+querySt+".file.json",
				success : function(data) {
					dataReceived =  data;
				}
			});	
			var outputJSON=eval("(" + dataReceived + ")");
			if(!outputJSON){// alert("Error in receiving namespaces! Please
							// check the name of your in use prefixes");
			}else{
				$.each(outputJSON, function(i, item) {
					//only consider namesapces for which an URI found
					if(outputJSON[i]){
						// check if it already exists
						if(existingNS.indexOf(i) != -1){
						// it includes the ns
						}else{				
						resultArr.push(Array(i,outputJSON[i]));
						}
				    }
				});	
			}
		}
		// console.log(nsArr2);
		// console.log(notFoundArr);
		// console.log(resultArr);
		// console.log(totalArr.concat(resultArr));
		
		if(resultArr.length){
			var updateList=totalArr.concat(resultArr);
			nsArr=updateList;
			this.makeList();
		}else{
			nsArr=totalArr;
			this.makeList();
		}
	},
	save : function() {
		var inputSize=$('#nsList input[type="text"]').size()/2;
		// console.log(inputSize);
		var i=0;
		var ns = tinyMCEPopup.editor.dom.get('namespaces');
		var nString='';
		if(ns){
		    var attributes = $.map(ns.attributes, function(item) {
		        return item.name});
		    $.each(attributes, function(i, item) {
		        if(item !='id'){ns.removeAttribute(item);}
		        });
			for (i=0;i<inputSize;i++)
			{
				var nsName=$('#ns'+i).val();
				var nsURI=$('#nsURI'+i).val();
				tinyMCEPopup.editor.dom.setAttrib(ns, "xmlns:" + nsName, nsURI);	
			}			
		}else{
			for (i=0;i<inputSize;i++)
			{
				var nsName=$('#ns'+i).val();
				var nsURI=$('#nsURI'+i).val();
				nString=nString+" xmlns:" + nsName + "='" + nsURI+"'"; 
			}	
			var rootEl = tinyMCEPopup.editor.dom.getRoot();
			var el = "<div id='namespaces'"+ nString + ">";
			rootEl.innerHTML = el + rootEl.innerHTML + "</div>";			
		}
		tinyMCEPopup.editor.nodeChanged();
		tinyMCEPopup.editor.execCommand('mceRdfaHighlight',false,'');
		tinyMCEPopup.close();
	}
};

tinyMCEPopup.onInit.add(rdfaNamespace.init, rdfaNamespace);
