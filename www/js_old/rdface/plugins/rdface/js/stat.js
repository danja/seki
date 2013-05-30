tinyMCEPopup.requireLangPack();
//-----------------------------
function getCookie(c_name)
{
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++)
	{
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name)
		{
			return unescape(y);
		}
	}
}

function drawHeatMap() {
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'API Name');
	for (i=0; i<selectedArray.length; i++) {
		data.addColumn('number', selectedArray[i]);
	}
	data.addRows(entities.length);
	$.each(entities, function(key, val) {
		data.setCell(key, 0, val['label']);
		for (i=0; i<selectedArray.length; i++) {
			var t=0;
			var counter=0;
			var counter2=0;
			if(selectedArray.length>2){
				if(val[selectedArray[i]][0]){
					for (j=0; j<selectedArray.length; j++) {
						if( i!=j && val[selectedArray[j]][1]){
							counter++;
							if(mapToVocabulary(val[selectedArray[i]][1])==mapToVocabulary(val[selectedArray[j]][1])){
								counter2++;
							}
						}
					}
					if (!counter){
						data.setCell(key, i+1, 0.9); 
						$("#results").append("<b>"+val['label']+"</b> by <b>"+selectedArray[i]+"</b> is known as <b>"+ mapToVocabulary(val[selectedArray[i]][1])+"</b>.<br>");
					}else{

						if(counter2){
							data.setCell(key, i+1, 1); 
						}else{
							data.setCell(key, i+1, 0.5); 
							$("#results").append("<b>"+val['label']+"</b> by <b>"+selectedArray[i]+"</b> is known as <b>"+ mapToVocabulary(val[selectedArray[i]][1])+"</b>.<br>");
						}

					}
				}else{
					data.setCell(key, i+1, 0);  
				}
			}else{
				if(val[selectedArray[i]][0]){
					for (j=0; j<selectedArray.length; j++) {
						if(val[selectedArray[j]][1] && mapToVocabulary(val[selectedArray[i]][1])!=mapToVocabulary(val[selectedArray[j]][1])){
							t=1;
						}
					}
				}
				if(t){
					$("#results").append("<b>"+val['label']+"</b> by <b>"+selectedArray[i]+"</b> is known as <b>"+ mapToVocabulary(val[selectedArray[i]][1])+"</b>.<br>");
					data.setCell(key, i+1, 0.5); 
				}else{
					data.setCell(key, i+1, val[selectedArray[i]][0]); 
				}
			}
		}
	}); 
	heatmap = new org.systemsbiology.visualization.BioHeatMap(document.getElementById('rdfaEnriched'));
	heatmap.draw(data, {startColor:{r:255,g:0,b:0,a:1},endColor:{r:0,g:255,b:0,a:1} });
} 
//-------------------------------
var entities= new Array();
var selectedArray = new Array();
var combination="no";
var rdfaStat = {
		init : function() {
			/* Gets called when request starts */
			$("#loading").ajaxStart(function() {
				$("#NLPAPI").html("External API(s): <b>"+getCookie("NLPAPI")+"</b><br>");
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
			}else{
				selectedArray=getCookie("NLPAPI").split(",");
			}
			if(getCookie("combination")){
				// set Alchemy as default API
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
				for (i=0; i<selectedArray.length; i++) {
					try
					{
					entity[i]=mapOutputToStandard(selectedArray[i],txt,proxy_url,exclude_arr);
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
						isThere=0;
						entityType=0;
						$.each(entity[i][1], function(key2, val2) {
							if (val2['label']==val['label']){
								isThere=1; 
								entityType=val2['type'];
							}
						});  
						val[selectedArray[i]]= new Array(isThere,entityType); 
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
						var countAgree=0;
						var temp_arr= new Array();
						for (i=0; i<selectedArray.length; i++) {
							if(val[selectedArray[i]][0]){
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
					});
					entities=entities_filtered;
				}
				$("#results").html("Total number of entities: <b>"+entities.length+"</b><br>");
				for (i=0; i<selectedArray.length; i++) {
					$("#results").append("<b>"+selectedArray[i] +"</b> found <b>"+ entity[i][1].length + "</b> entities.<br>");
				}
				google.setOnLoadCallback(drawHeatMap);	
				// ------------------------------------------------------------
				// Mapping to our desired vocabulary, here:rNews
				var entitiesRDFa = new Array();
				entitiesRDFa = makeRDFaTriples(entities);
				// -------------------------------------------------
				// enrich the text
				var enriched_text=enrichText(entities,entitiesRDFa,txt,tinyMCEPopup.editor);
				// -------------------------------------------------
				tinyMCEPopup.editor.setContent(nsStart+enriched_text+nsEnd);
				tinyMCEPopup.editor.nodeChanged();
				tinyMCEPopup.editor.execCommand('mceRdfaHighlight',false,'');
				tinyMCEPopup.editor.execCommand('mceLoadTripleBrowser', false, '');
			}else{
				$("#results").append("You must select multiple APIs for statistics!");
			}
		}

}

tinyMCEPopup.onInit.add(rdfaStat.init, rdfaStat);
