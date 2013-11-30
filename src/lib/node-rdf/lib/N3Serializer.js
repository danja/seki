var serializer = exports;

serializer.N3 = function() {};
serializer.N3.prototype.serialize = function(graph) {
	var n3 = "";

	graph.forEach(function(triple) {
		n3 += triple.toString() + '\n';
	});

	return n3;
};
