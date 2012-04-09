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

	"treeWalk" : function(root, fileCb, doneCb) {
		// this.value2 = argument + 100;
		console.log("FileReader.treeWalk called");

		// function forAllFiles(root, fileCb, doneCb) {
		fs.readdir(root, function processDir(err, files) {
			if (err) {
				fileCb(err);
			} else {
				if (files.length > 0) {
					var file = root + '/' + files.shift();
					fs.stat(file, function processStat(err, stat) {
						if (err) {
							doneCb(err);
						} else {
							if (stat.isFile()) {
								fileCb(file, function(err) {
									if (err) {
										doneCb(err);
									} else {
										processDir(false, files);
									}
								});
							} else {
								forAllFiles(file, fileCb, function(err) {
									if (err) {
										doneCb(err);
									} else {
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

};

module.exports = FileReader;
