function ts_toTurtle(baseURI, callback) {
    var turtle = "@prefix dc: <http://purl.org/dc/terms/> . \n";
    turtle += "@prefix ts: <http://hyperdata.org/trellis/> . \n\n";

    var ts_printout = function($node, kidCount, index, callback) {

        var $entryNode = $node.children("dl");
        var id = $entryNode.attr("id");
        var title = $entryNode.find(".ts-title").html();

        var parent = $node.parent().parent();
        var parentURI = baseURI;
        if (parent.hasClass("ts-root")) {
            parentURI += parent.attr("id");
        } else {
            parentURI += parent.children("dl").attr("id");
        }
        turtle += "<" + baseURI + "trellis/" + id + "> a ts:Node; \n";
        if(kidCount == 0){
            turtle += "  a ts:LeafNode; \n";
        }
        turtle += "   dc:title \"" + title + "\" ; \n";
        turtle += "   ts:index \"" + index + "\" ; \n";
        turtle += "   ts:parent <" + parentURI + "> .";
        turtle += "\n";
    }
    
    turtle += "<" + baseURI + $(".ts-root").attr("id") + "> a ts:RootNode . \n";

    ts_recurseTree($("ul:first"), ts_printout);

    callback(turtle);
}


function ts_recurseTree($ul, printout) {
    $ul.children("li").each(function(index) {
        var kids = $(this).children("ul");
        printout($(this), kids.length, index);
        if(kids.length) {
            ts_recurseTree(kids, printout);
        }
    });
}
