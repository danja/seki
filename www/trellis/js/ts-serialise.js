function ts_toTurtle(baseURI, callback) { // TODO use node-n3/browserify
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
        /* not needed ?
        if(kidCount == 0){
            turtle += "  a ts:LeafNode; \n";
        } */
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
        if (kids.length) {
            ts_recurseTree(kids, printout);
        }
    });
}

/*
 * { subject: 'http://example.org/cartoons#Tom',
 p redicate: 'http://www.w3.org/19*99/02/22-rdf-syntax-ns#type',
 object: 'http://example.org/cartoons#Cat',
 context: 'n3/contexts#default' }
 
 var mickey = store.find(':Mickey', null, null)[0];
 console.log(mickey.subject, mickey.predicate, mickey.object, '.');
 */
function ts_renderHTML(turtle, containerElement) {
    //  var parser = new n3.Parser();
    var divNode = $("#ts-entry-template");
    // .clone(true)
    var store = new require('n3').Store();

    var parser = new require('n3').Parser();
    parser.parse(turtle,
        function(error, triple) {
            if (error) {
                console.log("Parser error : " + error);
            }
            if (triple) {
                store.add(triple.subject, triple.predicate, triple.object);
                if (triple.predicate == 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type') {
                //    console.log("O = " + triple.object);
                }
            } else {
                buildTree(store);
                console.log("Parsed.")
            }
        });
    var buildTree = function(store) {
        var root = store.find(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://hyperdata.org/trellis/RootNode')[0].subject;
        var ul = $('<ul/>').appendTo(containerElement);
        var buildChildren = function(nodeURI, container) {
            var children = store.find(null, 'http://hyperdata.org/trellis/parent', nodeURI);
            //   console.log("children = "+JSON.stringify(children));
            var sortedChildren = new Array(children.length);
            for (var i = 0; i < children.length; i++) {
                // console.log(children[i]);
                var sortedIndexString = store.find(children[i].subject, 'http://hyperdata.org/trellis/index', null)[0].object;

                var sortedIndex = sortedIndexString.substring(1, sortedIndexString.length - 1);
                // console.log("sortedIndex = " + sortedIndex);
                sortedChildren[sortedIndex] = children[i].subject;
            }
            for (var i = 0; i < sortedChildren.length; i++) {
                var text = store.find(sortedChildren[i], 'http://purl.org/dc/terms/title', null)[0].object;
                text = text.substring(1, text.length - 1); // strip quotes
              //  var newContainer = container.append("<li>"+text+"</li>");
                var node = divNode.clone(true);
                var split = sortedChildren[i].split("/");
                var nid = split[split.length-1];
                // console.log("nid = "+nid);
                $(node).find("#nid-template").attr("id", nid);
                $(node).find(".ts-title").append(text);
               // .setAttr("id", sortedChildren[i]);
              //  var li = container.append("<li/>");
              //  li.append(node);
                var li = $('<li class="ts-open" />').appendTo(container);
                li.append(node);
            }
        }

        buildChildren(root, ul);

        //  console.log("store = "+JSON.stringify(store));
    }
}
