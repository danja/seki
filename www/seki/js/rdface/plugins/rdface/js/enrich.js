tinyMCEPopup.requireLangPack();
var entities= new Array();
var selectedArray = new Array();
var combination="no";
var rdfaStat = {
		init : function() {
			/* Gets called when request starts */
			$("#loading").ajaxStart(function() {
				$("#NLPAPI").html("External API(s): <b>"+(getCookie("NLPAPI")?getCookie("NLPAPI"):"Alchemy")+"</b><br>");
				$(this).css("display", "inline");
			});
			/* Gets called when request complete */
			$("#loading").ajaxComplete(function() {
				$(this).css("display", "none");
			});
			var txt = tinyMCEPopup.editor.getContent();
			// add namespaces 
			// add namespaces 
			var ns =tinyMCEPopup.editor.dom.get('namespaces');
			var tmp='';
			var nsStart;
			var nsEnd;
			if(ns){
				txt=ns.innerHTML;
			}
			$.each(vocabularies, function(key, val) {
				var nsURI = popular_prefixes[val];
				tmp += " xmlns:" + val + "='" + nsURI+ "'";
			});
			nsStart = "<div id='namespaces'" +tmp+ ">";
			nsEnd="</div>";
			if(!getCookie("NLPAPI")){
				// set Alchemy as default API
				selectedArray.push("Alchemy");
				setCookie("NLPAPI","Alchemy",30);
			}else{
				selectedArray=getCookie("NLPAPI").split(",");
			}
			if(getCookie("combination")){
				combination=getCookie("combination");
			}
			var API_name;
			if(selectedArray.length==1){
				API_name=selectedArray[0];
			}else{
				API_name="multiple";
			}
			var entity= new Array();
			if(API_name=="multiple"){
				// chain the output result of different APIs
				var i,exclude_arr=false;
				//errors in APIS
				var error_index=new Array();
				for (i=0; i<selectedArray.length; i++) {
					try
					{
						entity[i]=mapOutputToStandard(selectedArray[i],txt,proxy_url,exclude_arr);
						if(!entity[i]){
							$("#results").append("->Error in receiving information from <font color='red'>"+selectedArray[i]+"</font>!<br> ");
							error_index.push(i);
							continue;
						}
						$("#results").append("Information received from <font color='green'>"+selectedArray[i]+"</font><br> ");
						entities=entities.concat(entity[i][0]);
						exclude_arr=new Array();
						$.each(entities, function(key, val) {
							exclude_arr.push(val['label']);
						});
					}
					catch(err)
					{
						//Handle errors
						$("#results").append("->Error in receiving information from <font color='red'>"+selectedArray[i]+"</font>!<br> ");
						return false;
					}
				}
				// do some statistics
				var isThere,entityType;
				for (i=0; i<selectedArray.length; i++) {
					$.each(entities, function(key, val) {
					if(error_index.indexOf(key)==-1){
						isThere=0;
						entityType=0;
						if(error_index.indexOf(i)==-1){
							$.each(entity[i][1], function(key2, val2) {
								if (val2['label']==val['label']){
									isThere=1; 
									entityType=val2['type'];
								}
							});  
							val[selectedArray[i]]= new Array(isThere,entityType); 
						}
					}
				});
				}
				//apply combination strategy
				if(combination!="no"){
					var agreementNo;
					switch(combination){
					case "two":
						agreementNo=2;
						break;
					case "three":
						agreementNo=3;
						break;
					case "four":
						agreementNo=4;
						break;
					case "five":
						agreementNo=5;
						break;
					}
					var entities_filtered= new Array();
					var location_count,org_count,person_count;
					$.each(entities, function(key, val) {
					if(error_index.indexOf(key)==-1){
						var countAgree=0;
						var temp_arr= new Array();
						for (i=0; i<selectedArray.length; i++) {
							if((error_index.indexOf(i)==-1) && val[selectedArray[i]][0]){
								temp_arr.push(mapToVocabulary(val[selectedArray[i]][1]));
							}
						}
						location_count=0;
						org_count=0;
						person_count=0;
						$.each(temp_arr, function(k, v) {
							if(v=="rnews:Location"){
								location_count++;
							}
							if(v=="rnews:Person"){
								person_count++;
							}
							if(v=="rnews:Organization"){
								org_count++;
							}
						});
						if(location_count>agreementNo-1 || person_count>agreementNo-1 || org_count>agreementNo-1){
							entities_filtered.push(val);
						}
					}
					});
					entities=entities_filtered;
				}
			}else{
				if(API_name=="Alchemy"){
					entities=mapOutputToStandard(API_name,txt,proxy_url,false)[0];
				}
				if(API_name=="Extractiv"){
					entities=mapOutputToStandard(API_name,txt,proxy_url,false)[0];
				}
				if(API_name=="Calais"){
					entities=mapOutputToStandard(API_name,txt,proxy_url,false)[0];
				}

				if(API_name=="Ontos"){
					entities=mapOutputToStandard(API_name,txt,proxy_url,false)[0];
				}	
				if(API_name=="Evri"){
					entities=mapOutputToStandard(API_name,txt,proxy_url,false)[0];
				}
				if(API_name=="Saplo"){
					entities=mapOutputToStandard(API_name,txt,proxy_url,false)[0];
				}				
				if(API_name=="DBpedia"){
					entities=mapOutputToStandard(API_name,txt,proxy_url,false)[0];
				}
			}
			// ------------------------------------------------------------
			// Mapping to our desired vocabulary, here:rNews
			var entitiesRDFa = new Array();
			//console.log(entities);
			entitiesRDFa = makeRDFaTriples(entities);
			// -------------------------------------------------
			// enrich the text
			var enriched_text=enrichText(entities,entitiesRDFa,txt,tinyMCEPopup.editor);
			// -------------------------------------------------
			tinyMCEPopup.editor.setContent(nsStart+enriched_text+nsEnd);
			tinyMCEPopup.editor.nodeChanged();
			tinyMCEPopup.editor.execCommand('mceRdfaHighlight',false,'');
			tinyMCEPopup.editor.execCommand('mceLoadTripleBrowser', false, '');
			tinyMCEPopup.close();
		}

}

tinyMCEPopup.onInit.add(rdfaStat.init, rdfaStat);
