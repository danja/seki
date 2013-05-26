tinyMCEPopup.requireLangPack();
var rdfaSetting = {
		init : function() {	
			var f = document.forms[0];
			var selectedArray = new Array();
			//default
			if(!getCookie("NLPAPI")){
				f.NLPAPI[0].selected = true;
				return null;
			}
			selectedArray=getCookie("NLPAPI").split(",");
			var selObj = f.NLPAPI;
			var i;
			for (i=0; i<selObj.options.length; i++) {
				if (selectedArray.indexOf(selObj.options[i].value)!= -1) {
					selObj.options[i].selected=true;
				}
			}  
			if(!getCookie("combination")){
				f.combination[0].selected = true;
				return null;
			}
			selObj = f.combination;
			for (i=0; i<selObj.options.length; i++) {
				if (selObj.options[i].value== getCookie("combination")) {
					selObj.options[i].selected=true;
				}
			}  
		},
		insert : function() {
			var f = document.forms[0];
			// get form inputs
			var selectedArray = new Array();
			var selObj = f.NLPAPI;
			var i;
			var count = 0;
			for (i=0; i<selObj.options.length; i++) {
				if (selObj.options[i].selected) {
					selectedArray[count] = selObj.options[i].value;
					count++;
				}
			}
			var error=0;
			var errorMsg=document.getElementById("errorMsg");
			switch(f.combination.value){
			case "two":
				if(selectedArray.length<2){
					errorMsg.innerHTML="<font color='red'>You need to choose at least two APIs!</font>";
					error=1;
				}
				break;
			case "three":
				if(selectedArray.length<3){
					errorMsg.innerHTML="<font color='red'>You need to choose at least three APIs!</font>";
					error=1;
				}
				break;
			case "four":
				if(selectedArray.length<4){
					errorMsg.innerHTML="<font color='red'>You need to choose at least four APIs!</font>";
					error=1;
				}
				break;
			case "five":
				if(selectedArray.length<5){
					errorMsg.innerHTML="<font color='red'>You need to choose at least five APIs!</font>";
					error=1;
				}
				break;
			}
			// --------------------
			if(!error){
				// set a cookie
				setCookie("NLPAPI",selectedArray.join(','),30);
				setCookie("combination",f.combination.value,30);
				tinyMCEPopup.close();
			}
		}
}

tinyMCEPopup.onInit.add(rdfaSetting.init, rdfaSetting);
