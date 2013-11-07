function toTurtle(baseURI) {
    var turtle = "@prefix dc: <http://purl.org/dc/terms/> . \n";
    turtle += "@prefix ts: <http://hyperdata.org/trellis/> . \n\n";
   
    var callback = function($node) {
        var $entryNode = $node.children("dl");
        var id = $entryNode.attr("id");
        
    //    console.log("ID "+" "+ id);
    //    console.log("type "+$entryNode.prop("tagName"));
        var title = $entryNode.find(".ts-title").html();
        var parent = $node.parent().parent();
        var parentURI = baseURI;
        if(parent.hasClass("ts-root")) {
            parentURI += parent.attr("id");
        } else {
            parentURI += parent.children("dl").attr("id");
        }
 turtle += "<"+ baseURI+id + "> a ts:Node; \n";
 turtle += "   dc:title \""+ title + "\" ; \n";      
 turtle += "   ts:parent <"+ parentURI +"> .";
 turtle += "\n";
        
    }
   recurseTree($("ul:first"), callback);
   // .appendTo("#toArrayOutput").wrapAll("<ul>");
   console.log(turtle);
}

function getID($node) {
    
}



    function recurseTree($ul,callback){
        
       
       $ul.children("li").each(function( index ) {
           callback($(this)); 
           recurseTree($(this).children("ul"), callback);
          
      //     callback(this);
       });
    }
