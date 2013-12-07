// model for a tree node
// (can't do JSON.stringify(list) because of parent ref)
//
function ListTree(title) {
	this.lists = new Array();
	this.title = title;

	this.addChild = function(object) {
		object.parent = this;
		this.lists.push(object);
	};
	this.lastChild = function() {
		var last = this.lists.pop();
		this.lists.push(last)
		return last;
	};

	// <li>A
	// <ul>
	// <li>B</li>
	// <li>C</li>
	// <li>D</li>
	// </ul>
	// </li>

	this.toHTML = function() {
		var html = "<ul>\n" + this.toHTMLsub() + "</ul>";
		return html;
	};
		
	this.toHTMLsub = function() {
		var html = "";
		html += "<li>" + this.title;
		if (this.lists.length > 0) {
			html += "\n<ul>"

			for ( var i = 0; i < this.lists.length; i++) {
			//	html += "<li>";
				// html += this.lists[i].title;
				html += this.lists[i].toHTMLsub();
			//	html += "</li>";
			}
			html += "</ul>\n";
		}
		html += "</li>\n";
		return html;
	};
}

// dummy tree
// called by test.js
/*
function text2html2(source) {
	var root = new ListTree("root");
	var child1 = new ListTree("child1");
	root.addChild(child1);
	var child2 = new ListTree("child2");
	root.addChild(child2);
	var result = root.toHTML();
	// console.log(JSON.stringify(root, null, '\t'));
	return result;
}
*/

// parses Workflowy format - maybe ok
// will called by test.js
function text2html(source) {
	var result = "";
	var inText = false;
	var indent = 0;
	var previousIndent = 0;

	var root = new ListTree("root");
	var current = root;
	var text = "";

	for ( var i = 0; i < source.length; i++) {
		var char = source.charAt(i);

		if (!inText && char != "-" && char == " ") {
			indent += .5;
			continue;
		}

		if (!inText && char == "-") {
			// indent++;
			inText = true;
			continue;
		}

		if (inText && char != "\n") {
			text += escape(char);
		}
		if (inText && char == "\n") { // read line
			// console.log("* text = " + text);
			inText = false;

			var diff = indent - previousIndent;
		//	console.log(previousIndent + " [" + diff + "] " + indent + " ");

			var newList = new ListTree(text);
            
            console.log("node "+text);
			if (current.parent) {
                console.log(current.title + " hasParent = " + current.parent.title);
			}
		//	console.log("current = " + current.title);
		//	console.log("new = " + newList.title);

		//	console.log("diff = " + diff);

			if (diff == 0) {
				current.addChild(newList);
				// previousList = newList;
			//	console.log("adding " + newList.title + " to " + current.title);
			}
			if (diff > 0) {
				var current = current.lastChild();

				current.addChild(newList);
				//console.log("last = " + current.title);
				//console.log("adding " + newList.title + " to " + current.title);
			}
			if (diff < 0) {
				for ( var j = 0; j < -diff; j++) {
				//	console.log("getting parent of " + current.title);
					current = current.parent;
				}
//				console.log("new list2 " + newList.title);
//				console.log("new current " + current.title);
//				console.log("adding " + newList.title + " to " + current.title);

				current.addChild(newList);
			}

			// parent.addChild(newList);
			// var newList = new ListTree();
			// console.log("adding text" + text);
			// newList.setTitle(text);
			// list.addChild(newList);
			// console.log(JSON.stringify(list));

			previousIndent = indent;
			indent = 0;
			text = "";
			continue;
		}

	}
	
    
  //  result = text2html(source);
    // result = root.toHTML();
    
	// result = JSON.stringify(root, null, 4);
	// result = parent.toHTML();
	// console.log(JSON.stringify(current, null, '\t'));
//	return result;
	// 
}

function escape(char) {
	if(char == "<") return "&lt;";
	if(char == ">") return "&gt;";
	if(char == "&") return "&amp;";	
	if(char == "\"") return "&quote;";	
	if(char == "'") return "&apos;";
	return char;
}


// make it available to other scripts
module.exports = text2html;