//Ontos predefined entities
var ontos_personURI = "http://www.ontosearch.com/2008/02/ontosminer-ns/domain/common/english#Person";
var ontos_organizationURI = "http://www.ontosearch.com/2008/02/ontosminer-ns/domain/common/english#Commercial_Organization";
var ontos_locationURI = "http://www.ontosearch.com/2008/02/ontosminer-ns/domain/common/english#Location";
var ontos_labelURI="http://sofa.semanticweb.org/sofa/v1.0/system#__LABEL_REL";
//Ontos position attributes
var ontos_annotation = "http://www.ontosearch.com/2007/12/annotation-ns#entity";
var ontos_startPosition = "http://www.ontosearch.com/2007/12/annotation-ns#plainStart";
var ontos_endPosition = "http://www.ontosearch.com/2007/12/annotation-ns#plainEnd";
vocabularies=new Array("rnews","foaf","dbpedia");
//Mapping to rNews, foaf vocabulary
function mapToVocabulary(p) {
	var output;
	switch (p) {
	// typeof
	case "person":
	case "PERSON":
	case "Person":
	case ontos_personURI:
		output = "rnews:Person";
		break;	
	case "organization":
	case "ORGANIZATION":
	case "CRIMINAL_ORGANIZATION":
	case "ENTERTAINMENT_ORG":
	case "GOVERNMENT_ORG":
	case "MEDIA_ORG":
	case "MILITARY_ORG":
	case "NON_GOVERNMENT_ORG":
	case "RELIGIOUS_ORG":
	case "COMMERCIAL_ORG":
	case "Company":
	case "Organization":
	case ontos_organizationURI:
		output = "rnews:Organization";
		break;	
	case "location":
	case "Location":
	case "CITY":
	case "COUNTRY":
	case "City":
	case "Country":
	case ontos_locationURI:
		output = "rnews:Place";
		break;	
	case "name":
	case "http://sofa.semanticweb.org/sofa/v1.0/system#__LABEL_REL":
		output = "rnews:name";
		break;
	//case "latitude":
		//output = "rnews:latitude";
		//break;
	//case "longitude":
		//output = "rnews:longitude";
		//break;
	case "http://www.ontosearch.com/2008/02/ontosminer-ns/domain/common/english#FirstName":
		output = "rnews:givenName";
		break;
	case "http://www.ontosearch.com/2008/02/ontosminer-ns/domain/common/english#FamilyName":
		output = "rnews:familyName";
		break;
	case "http://www.ontosearch.com/2008/02/ontosminer-ns/domain/common/english#Gender":
		output = "foaf:gender";
		break;
	default:
		output = null;
	} 
	return output;
}
//to replace only text contents not markups
var foundFlag=0;
function replaceText(oldText, newText, node){ 
	node = node || document.body; // base node 
	var childs = node.childNodes, i = 0;
	var temp;
	while(node = childs[i]){ 
		if (node.nodeType == 3){ // text node found, do the replacement
			if (node.textContent) {
				temp=node.textContent;
				if(!foundFlag){
					node.textContent = node.textContent.replace(oldText, newText);
				}
				if(temp!=node.textContent){
					foundFlag=1;
				}
			} else { // support to IE
				node.nodeValue = node.nodeValue.replace(oldText, newText);
			}
		} else { // not a text mode, look forward
			replaceText(oldText, newText, node); 
		} 
		i++; 
	} 
}
function connectEnricherAPI(url,request_data){
	var dataReceived;
	$.ajax({
		type : "POST",
		async: false,
		url : url,
		data : request_data,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success : function(data) {
			dataReceived =  data;
		},
		error: function(xhr, txt, err){ 
			//alert("xhr: " + xhr + "\n textStatus: " +txt + "\n errorThrown: " + err+ "\n url: " + url);
			dataReceived=0;
		},
	});
	return dataReceived;
}
//top: returns only the top entity not all
function suggestURI(proxy_url,request_data,top){
	var dataReceived=connectEnricherAPI(proxy_url,request_data);
	if(dataReceived){
		//dataReceived = eval("(" + dataReceived + ")");
		if(dataReceived['totalResults']){
			if(top){
				return dataReceived.entries[0].link;
			}else{
				return dataReceived;
			}
		}	
	}
	return null;
}
function mapOutputToStandard(api,txt,proxy_url,exclude_arr){
	var entities = new Array();
	switch(api){
	case "Alchemy":
		entities=mapAlchemyOutputToStandard(txt,proxy_url,exclude_arr);
		break;
	case "Extractiv":
		entities=mapExtractivOutputToStandard(txt,proxy_url,exclude_arr);
		break;
	case "Calais":
		entities=mapCalaisOutputToStandard(txt,proxy_url,exclude_arr);
		break;
	case "Ontos":
		entities=mapOntosOutputToStandard(txt,proxy_url,exclude_arr);
		break;	
	case "Evri":
		entities=mapEvriOutputToStandard(txt,proxy_url,exclude_arr);
		break;	
	case "Saplo":
		entities=mapSaploOutputToStandard(txt,proxy_url,exclude_arr);
		break;			
	case "DBpedia":
		entities=mapDBpediaOutputToStandard(txt,proxy_url,exclude_arr);
		break;	
	}
	return entities;
}
function makeRDFaTriples(entities) {
	var entitiesRDFa = new Array();
	$.each(entities, function(key, val) {
		var annotations=new Array();
		annotations.push(Array("rdf:type",mapToVocabulary(val["type"])));
		$.each(val["properties"], function(i, v) {
			if(mapToVocabulary(v[0])){
				annotations.push(Array(mapToVocabulary(v[0]),v[1]));
			}
		});
		entitiesRDFa.push(annotations);
	});
	return entitiesRDFa;
}

function enrichText(entities,entitiesRDFa,txt,editor) {
	//handle overwriting of triples
	//get the list of exisitng annotated entities and add them to block arr to prevent overwriting them
	var notOverwrite=new Array();
	$.each($(editor.getDoc()).find('span[typeof]'), function(index, value) {
		if(!$(this).hasClass("automatic")){
			notOverwrite.push(tinymce.trim($(this).text()));
		}
	});
	//-----------------------------
	var txt = editor.getContent();
	var ns =tinyMCEPopup.editor.dom.get('namespaces');
	if(ns){
		txt=ns.innerHTML;
	}
	var output= new Array();
	var enriched_text = txt;
	var extra_triples = '';
	var replaceByPos=0;
	var previousAnnContentLength=0;
	var prevStart=0;
	$.each(entities, function(key, val) {
		var selectedContent=val['label'];
		//var start=val['positions'][0]['start'];
		//var end=val['positions'][0]['end'];
		//var selectedContent=txt.substring(start, end);
		if(notOverwrite.indexOf(selectedContent)==-1){
			var subjectURI='';
			var dataReceived;
			if(val['uri']){
				subjectURI=val['uri'];
			}else{
				// get an URI
				var data = "api=Sindice&query=" + selectedContent;
				subjectURI=suggestURI(proxy_url,data,true);
			}
			var tmp2='';
			if (subjectURI){
				tmp2="about="+subjectURI;
			}
			var annotatedContent,extra_triples;
			extra_triples='';
			$.each(entitiesRDFa[key], function(ii, vv) {
				if (vv[0]=="rdf:type"){
					var temp = tmp2 + " typeof='"
					+ vv[1] + "'";
					annotatedContent = "<span class='automatic' " + temp + ">";

				}else{
					if(vv[0]=="rnews:name"){
						extra_triples = extra_triples + "<span property='rnews:name'>"+selectedContent+"</span>";
					}else{
						extra_triples = extra_triples + "<span property='" + vv[0]
						+ "' content='" + vv[1] + "'></span>";
					}
				}
			});
			annotatedContent=annotatedContent+extra_triples+"</span>";
			if(val["positions"]['start'] && val["positions"]['end']){
				replaceByPos=1;
				if(parseInt(val["positions"]['start'])>prevStart){
					enriched_text=enriched_text.substring(0,parseInt(val["positions"]['start'])+previousAnnContentLength)+annotatedContent+enriched_text.substring(parseInt(val["positions"]['end'])+previousAnnContentLength+1,enriched_text.length+1);
				}else{
					enriched_text=enriched_text.substring(0,val["positions"]['start'])+annotatedContent+enriched_text.substring(val["positions"]['end']+1,enriched_text.length+1);
				}
				previousAnnContentLength +=annotatedContent.length-selectedContent.length;
				prevStart=val["positions"]['start'];
				prevSelectedContent=selectedContent;
			}else{
				foundFlag=0;
				replaceText(selectedContent, annotatedContent, $(editor.getDoc()).find('body')[0]);
			}
		}
	});
	if(!replaceByPos){
		var tmp=$(editor.getDoc()).find('body').html();
		tmp=tmp.replace(/&lt;/g,"<");
		tmp=tmp.replace(/&gt;/g,">");
		enriched_text=tmp;
	}
	return enriched_text;
}
function mapAlchemyOutputToStandard(txt,proxy_url,exclude_arr){
	var excludeFlag=false;
	if(exclude_arr){
		excludeFlag=true;
	}
	var dataReceived;
	var data = encodeURIComponent(txt);
	data = "api=Alchemy&query=" + data;
	dataReceived=connectEnricherAPI(proxy_url,data);
	//terminate if an error occured
	if(!dataReceived)
		return 0;
	var entities = new Array();
	var entitiesComplete = new Array();
	// this step must be done manually for each NLP API
	$.each(dataReceived['entities'], function(key, val) {
		var entity = new Array();
		var positions=new Array();
		var properties=new Array();
		// separate desired entities
		if((val['type']=="Person")|| (val['type']=="City")|| (val['type']=="Country")|| (val['type']=="Organization")|| (val['type']=="Company")){
			entity["type"]=val['type'];
			entity["label"]=val['text'];
			entity["uri"]='';
			if(val['disambiguated']){
				entity["uri"]=val['disambiguated']['dbpedia'];
			}
			// add a property
			properties.push(Array("name",val['text']));
			//Alchemy does not return positions!
			entity["positions"]=positions;
			entity["properties"]=properties;
			entitiesComplete.push(entity);
			if(excludeFlag){
				if(exclude_arr.indexOf(entity['label']) ==-1){
					entities.push(entity);	
				}
			}else{
				entities.push(entity);
			}
		}
	});
	return Array(entities,entitiesComplete);
}
function mapExtractivOutputToStandard(txt,proxy_url,exclude_arr){
	var excludeFlag=false;
	if(exclude_arr){
		excludeFlag=true;
	}
	var dataReceived;
	var data = encodeURIComponent(txt);
	data = "api=Extractiv&query=" + data;
	dataReceived=connectEnricherAPI(proxy_url,data);
	//terminate if an error occured
	if(!dataReceived)
		return 0;	
	var entities = new Array();
	var entitiesComplete = new Array();
	// to prevent duplicates
	var labels=new Array();
	// this step must be done manually for each NLP API
	$.each(dataReceived['entities'], function(key, val) {
		var entity = new Array();
		var positions=new Array();
		var properties=new Array();
		// separate desired entities
		if((val['type']=="PERSON")|| (val['type']=="CITY")|| (val['type']=="COUNTRY")|| (val['type'].split("_")[1]=="ORG")|| (val['type'].split("_")[1]=="ORGANIZATION")){
			if(!val['pronoun']){
				// check duplicates
				if(labels.indexOf(val['text'])== -1){
					labels.push(val['text']);
					entity["type"]=val['type'];
					entity["label"]=val['text'];
					//positions["start"]=val['offset'];
					//positions["end"]=val['offset']+val['len']-1;
					entity["uri"]='';
					if(val['links']){
						entity["uri"]=val['links'][0];
					}
					// add a property
					properties.push(Array("name",val['text']));
					//Extractiv only returns positions by text content so ignores html content
					entity["positions"]=positions;
					entity["properties"]=properties;
					entitiesComplete.push(entity);	
					if(excludeFlag){
						if(exclude_arr.indexOf(entity['label']) ==-1){
							entities.push(entity);	
						}
					}else{
						entities.push(entity);
					}
				}
			}
		}
	});
	return Array(entities,entitiesComplete);
}
function mapCalaisOutputToStandard(txt,proxy_url,exclude_arr){
	var excludeFlag=false;
	if(exclude_arr){
		excludeFlag=true;
	}
	var dataReceived;
	var data = encodeURIComponent(txt);
	data = "api=Calais&query=" + data;
	dataReceived=connectEnricherAPI(proxy_url,data);
	//terminate if an error occured
	if(!dataReceived)
		return 0;
	var entities = new Array();
	var entitiesComplete = new Array();
	// this step must be done manually for each NLP API
	$.each(dataReceived, function(key, val) {
		var entity = new Array();
		var positions=new Array();
		var properties=new Array();
		if (val['_typeGroup']=="entities"){
			// separate desired entities
			if((val['_type']=="Person")|| (val['_type']=="City")|| (val['_type']=="Country")|| (val['_type']=="Company")|| (val['_type']=="Organization")){
				entity["type"]=val['_type'];
				entity["label"]=val['instances'][0]['exact'];
				entity["uri"]='';
				if(val['resolutions']){
					entity["uri"]=val['resolutions'][0]['id'];
					if(val['_type']=="Country"){
						properties.push(Array("latitude",val['resolutions'][0]['latitude']));
						properties.push(Array("longitude",val['resolutions'][0]['longitude']));
					}
				}
				$.each(val['instances'], function(i, v) {
					//positions["start"]=v['offset'];
					//positions["end"]=v['offset']+v['length']-1;
				});
				// add a property
				properties.push(Array("name",val['name']));
				entity["positions"]=positions;
				entity["properties"]=properties;
				entitiesComplete.push(entity);
				if(excludeFlag){
					if(exclude_arr.indexOf(entity['label']) ==-1){
						entities.push(entity);	
					}
				}else{
					entities.push(entity);
				}
			}
		}
	});
	return Array(entities,entitiesComplete);
}
function mapOntosOutputToStandard(txt,proxy_url,exclude_arr){
	var excludeFlag=false;
	if(exclude_arr){
		excludeFlag=true;
	}
	var data = JSON.stringify( {
		get : 'process',
		ontology : 'common.english',
		format : 'NTRIPLES',
		text : txt
	});
	data = encodeURIComponent(data);
	data = "api=Ontos&query=" + data;
	var dataReceived;
	dataReceived=connectEnricherAPI(proxy_url,data);
	//terminate if an error occured
	if(!dataReceived)
		return 0;	
	var results = dataReceived["result"];
	var entities = new Array();
	var entitiesComplete = new Array();
	// this step must be done manually for each NLP API
	$.each(results, function(key, val) {
		var entity = new Array();
		// separate desired entities
		if((val['o'] == ontos_personURI)|| (val['o'] == ontos_organizationURI)|| (val['o'] == ontos_locationURI)){
			entity["type"]=val['o'];
			entity["uri"]=val['s'];
			entities.push(entity);
		}
	});
	var entitiesAnn = new Array();
	var tmp;
	// find and store all relations related to predefined
	// entities
	// && find
	// annotation entity of them
	var del_arr=new Array();
	$.each(entities, function(i, v) {
		properties = new Array();
		var tempArr=new Array();
		$.each(results, function(key, val) {
			if (val['s'] == v["uri"] || val['o'] == v["uri"]) {
				// get annotation entity
				if (val['p'] == ontos_annotation) {
					entitiesAnn[i] = val['s'];
				}else{
					tmp=val['o'].replace(/(\^\^)<.*?>/g,"");
					tmp=tmp.substr(1, tmp.length - 2);
					if(tempArr.indexOf(val['p'])==-1){
						properties.push(Array(val['p'],tmp));
					}
					tempArr.push(val['p']);
					if(val['p'] ==ontos_labelURI){
						v["label"]=tmp;
					}
				}

			}
		});
		v["properties"]=properties;
	});
	$.each(entities, function(i, v) {
		var positions=new Array();
		$.each(results, function(key, val) {
			if (val['s'] == entitiesAnn[i]) {
				if (val['p'] == ontos_startPosition) {
					tmp=val['o'].replace(/(\^\^)<.*?>/g, "");
					//positions["start"]=tmp.substr(1, tmp.length - 2) ;
				}
				if (val['p'] == ontos_endPosition) {
					tmp=val['o'].replace(/(\^\^)<.*?>/g, "");
					//positions["end"] =tmp.substr(1, tmp.length - 2) ;
				}
			}
		});
		v["positions"]=positions;
		//v["uri"]='';
	});
	entitiesComplete=entitiesComplete.concat(entities);
	if(excludeFlag){
		clearEntities=new Array();
		$.each(entities, function(i, v) {
			if(exclude_arr.indexOf(v["label"]) ==-1){
				clearEntities.push(v);
			}
		});
		entities=clearEntities;
	}
	return Array(entities,entitiesComplete);
}
function mapEvriOutputToStandard(txt,proxy_url,exclude_arr){
	var excludeFlag=false;
	if(exclude_arr){
		excludeFlag=true;
	}
	var dataReceived;
	var data = encodeURIComponent(txt);
	data = "api=Evri&query=" + data;
	dataReceived=connectEnricherAPI(proxy_url,data);
	//terminate if an error occured
	if(!dataReceived)
		return 0;	
	var entities = new Array();
	var entitiesComplete = new Array();
	// this step must be done manually for each NLP API
	$.each(dataReceived['graph']['entities']['entity'], function(key, val) {
		var entity = new Array();
		var positions=new Array();
		var properties=new Array();
		// separate desired entities
		if((val['@href'].split("/")[1]=="person")|| (val['@href'].split("/")[1]=="location")|| (val['@href'].split("/")[1]=="organization")){
			entity["type"]=val['@href'].split("/")[1];
			entity["label"]=val['name']['$'];
			entity["uri"]='http://api.evri.com'+val['@href'];
			// add a property
			properties.push(Array("name",val['name']['$']));
			//Evri does not return positions of entities
			entity["positions"]=positions;
			entity["properties"]=properties;
			entitiesComplete.push(entity);
			if(excludeFlag){
				if(exclude_arr.indexOf(entity['label']) ==-1){
					entities.push(entity);	
				}
			}else{
				entities.push(entity);
			}
		}
	});
	return Array(entities,entitiesComplete);
}
function mapSaploOutputToStandard(txt,proxy_url,exclude_arr){
	var excludeFlag=false;
	if(exclude_arr){
		excludeFlag=true;
	}
	var dataReceived;
	var data = encodeURIComponent(txt);
	data = "api=Saplo&query=" + data;
	dataReceived=connectEnricherAPI(proxy_url,data);
	//terminate if an error occured
	if(!dataReceived)
		return 0;	
	var entities = new Array();
	var entitiesComplete = new Array();
	// this step must be done manually for each NLP API
	$.each(dataReceived['result']['tags'], function(key, val) {
		var entity = new Array();
		var positions=new Array();
		var properties=new Array();
		// separate desired entities
		if((val['category']=="person")|| (val['category']==="location")|| (val['category']==="organization")){
			entity["type"]=val['category'];
			entity["label"]=val['tag'];
			entity["uri"]='';
			// add a property
			properties.push(Array("name",val['tag']));
			//Evri does not return positions of entities
			entity["positions"]=positions;
			entity["properties"]=properties;
			entitiesComplete.push(entity);
			if(excludeFlag){
				if(exclude_arr.indexOf(entity['label']) ==-1){
					entities.push(entity);	
				}
			}else{
				entities.push(entity);
			}
		}
	});
	return Array(entities,entitiesComplete);
}
function mapDBpediaOutputToStandard(txt,proxy_url,exclude_arr){
	var excludeFlag=false;
	if(exclude_arr){
		excludeFlag=true;
	}
	var dataReceived;
	var data = encodeURIComponent(txt);
	data = "api=DBpedia&query=" + data;
	dataReceived=connectEnricherAPI(proxy_url,data);
	//terminate if an error occured
	if(!dataReceived)
		return 0;	
	var entities = new Array();
	var entitiesComplete = new Array();
	// this step must be done manually for each NLP API
	var includeArr=new Array();
	$.each(dataReceived['Resources'], function(key, val) {
		var entity = new Array();
		var positions=new Array();
		var properties=new Array();
		// separate desired entities
		var tmp=val['@types'];
		var personReg = new RegExp("Person");
		var orgReg = new RegExp("Organisation");
		var locationReg = new RegExp("Place");
		var m1 = personReg.exec(tmp);
		var m2 = orgReg.exec(tmp);
		var m3 = locationReg.exec(tmp);
		if ((m1 != null) || (m2 != null) || (m3 != null)) {
			if(includeArr.indexOf(val['@surfaceForm']) ==-1){
				includeArr.push(val['@surfaceForm']);
				if (m1 != null){
					entity["type"]="Person";
				}
				if (m2 != null){
					entity["type"]="Organization";
				}
				if (m3 != null){
					entity["type"]="Location";
				}
				entity["label"]=val['@surfaceForm'];
				entity["uri"]=val['@URI'];
				// add a property
				properties.push(Array("name",val['@surfaceForm']));
				positions["start"]=val['@offset'];
				positions["end"]=parseInt(val['@offset'])+val['@surfaceForm'].length-1;
				entity["positions"]=positions;
				entity["properties"]=properties;
				entitiesComplete.push(entity);
				if(excludeFlag){
					if(exclude_arr.indexOf(entity['label']) ==-1){
						entities.push(entity);	
					}
				}else{
					entities.push(entity);
				}
			}
		}
	});
	return Array(entities,entitiesComplete);
}