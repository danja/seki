Trellis.save = function(targetURL, graphURI, turtle) {
    // console.log("\n"+turtle+"\n");
    $.ajax({
        type: "PUT",
        url: targetURL,
        data: turtle,
        contentType: "text/turtle"
    })
        .done(function(msg) {
            alert("Data Saved: " + msg);
        });
}

Trellis.load = function(url, callback) {

    $.ajax({
        url: url,
        dataType: "text/turtle"
    })
        .done(function(turtle) {
            callback(turtle);
        });
}

/*
 * data manipulation
 */
Trellis.toTurtle = function(baseURI, callback) { // TODO use node-n3/browserify
    var turtle = "@prefix dc: <http://purl.org/dc/terms/> . \n";
    turtle += "@prefix ts: <http://hyperdata.org/trellis/> . \n\n";

    var ts_printout = function($node, kidCount, index, callback) {
        // console.log("$Node = " + $node.html());
        var divNodes = $node.find("> div");

        // console.log("$entryNode = " + $entryNode.html());

        var $entryNode = $(divNodes[1]);

        var id = $entryNode.attr("id");

        var title = $entryNode.find("span[property='title']").text();

        console.log("title = " + title);

        var created = $entryNode.find("span[property='created']").text();

        var parent = $node.parent().parent();
        var parentURI = baseURI + "trellis/";
        if (parent.hasClass("ts-root")) {
            parentURI += parent.attr("id");
        } else {
            parentURI += parent.children(".ts-entry").attr("id");
        }

        turtle += "<" + baseURI + "trellis/" + id + "> a ts:Node; \n";
        /* not needed ?
        if(kidCount == 0){
            turtle += "  a ts:LeafNode; \n";
        } */
        turtle += "   dc:title \"" + title + "\" ; \n";
        turtle += "   dc:created \"" + created + "\" ; \n";
        turtle += "   ts:index \"" + index + "\" ; \n";
        turtle += "   ts:parent <" + parentURI + "> .";
        turtle += "\n";
    }

    turtle += "<" + baseURI + "trellis/" + $(".ts-root").attr("id") + "> a ts:RootNode . \n";

    var startNode = $("#trellis > div > ul");
    // console.log("start node = " + startNode.html());

    Trellis.recurseTree(startNode, ts_printout); // ul:first ts-root

    callback(turtle);
}

Trellis.recurseTree = function($ul, printout) {
    $ul.children("li").each(function(index) {
        var kids = $(this).children("ul");
        printout($(this), kids.length, index);
        if (kids.length) {
            Trellis.recurseTree(kids, printout);
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
Trellis.renderHTML = function(turtle, containerElement) {
    //  var parser = new n3.Parser();
    var divNode = $("#nid-template");
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
                buildTree(store, containerElement, divNode);
                console.log("Parsed.")
                Trellis.initDragDrop();
            }
        });

    var buildTree = function(store, containerElement, template) {
        // console.log("build tree");
        var root = store.find(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://hyperdata.org/trellis/RootNode')[0].subject;

        var rootSplit = root.split("/");
        var rootId = rootSplit[rootSplit.length - 1];
        containerElement = $('<div/>').appendTo(containerElement).attr("id", rootId);
        containerElement.addClass("ts-root");

        var buildChildren = function(nodeURI, container) {

            // console.log("build children nodeURI=" + nodeURI + "  container=" + container.html());
            var children = store.find(null, 'http://hyperdata.org/trellis/parent', nodeURI);
            if (children.length) {
                container.addClass("ts-open");
                var container = $('<ul />').appendTo(container);

            } else {
                return;
            }

            // console.log("children = " + JSON.stringify(children));
            var sortedChildren = new Array(children.length);
            for (var i = 0; i < children.length; i++) {
                // console.log(children[i]);
                var sortedIndexString = store.find(children[i].subject, 'http://hyperdata.org/trellis/index', null)[0].object;

                var sortedIndex = sortedIndexString.substring(1, sortedIndexString.length - 1);
                // console.log("sortedIndex = " + sortedIndex);
                sortedChildren[sortedIndex] = children[i].subject;
            }
            for (var i = 0; i < sortedChildren.length; i++) {
                var current = sortedChildren[i];
                var text = store.find(current, 'http://purl.org/dc/terms/title', null)[0].object;
                // console.log("TEXT = "+text);
                text = text.substring(1, text.length - 1); // strip quotes
                //  var newContainer = container.append("<li>"+text+"</li>");
                var created = store.find(current, 'http://purl.org/dc/terms/created', null)[0].object;
                created = created.substring(1, created.length - 1);

                var newDiv = template.clone(true);
                newDiv.removeClass("hidden");
                //   $(newDiv).find(".ts-title").append(text);
                $(newDiv).find("span[property='title']").append(text);
                $(newDiv).find("span[property='created']").append(created);


                var split = sortedChildren[i].split("/");
                var nid = split[split.length - 1];
                $(newDiv).attr("id", nid);
                // console.log("nid = " + nid);

                var li = $('<li />').appendTo(container); //  class="ts-open"
                li.append("<div class='dropzone ui-droppable'></div>");
                li.append(newDiv);
                buildChildren(sortedChildren[i], li);
            }
        }

        buildChildren(root, containerElement);

        //  console.log("store = "+JSON.stringify(store));
    }
}
