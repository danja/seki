var fs = require('fs');

//Constructor
function FileReader() {
}

// properties and methods
FileReader.prototype = {

	value1 : "default_value",

	"testCall" : function() {
		// this.value2 = argument + 100;
		console.log("FileReader.testCall called");
	},
	"treeWalk" : function(root, fileCb, doneCb) {
		treeWalk(root,fileCb,doneCb);
	}

};

// asynchronous tree walk
// root - root path
// fileCb - callback function (file, next) called for each file
// -- the callback must call next(falsey) to continue the iteration,
// or next(truthy) to abort the iteration.
// doneCb - callback function (err) called when iteration is finished
// or an error occurs.
//
// example:
//
// forAllFiles('~/',
// function (file, next) { sys.log(file); next(); },
// function (err) { sys.log("done: " + err); });

// based on
// http://grammerjack.blogspot.it/2010/12/asynchronous-directory-tree-walk-in.html
// Apache Licence 2.0

function treeWalk(root, fileCb, doneCb) {
	// this.value2 = argument + 100;
	console.log("FileReader.treeWalk called");

	// function forAllFiles(root, fileCb, doneCb) {
	fs.readdir(root, function processDir(err, files) {
		if (err) {
			console.log("TreeWalk error [1] :"+err);
			// fileCb(err);
		} else {
			console.log("files.length = "+files.length);
			if (files.length > 0) {
				var file = root + '/' + files.shift();
				console.log("file = "+file);
				fs.stat(file, function processStat(err, stat) {
					if (err) {
						console.log("TreeWalk error [2] :"+err);
						// doneCb(err);
					} else {
						if (stat.isFile()) {
							fileCb(file, function(err) {
								if (err) {
									console.log("TreeWalk error [3] :"+err);
									// doneCb(err);
								} else {
									processDir(false, files);
								}
							});
						} else {
							treeWalk(file, fileCb, function(err) {
								if (err) {
									console.log("TreeWalk error [4] :"+err);
									// doneCb(err);
								} else {
									console.log("calling processDir on "+files);
									processDir(false, files);
								}
							});
						}
					}
				});
			} else {
				doneCb(false);
			}
		}
	});
}
module.exports = FileReader;
