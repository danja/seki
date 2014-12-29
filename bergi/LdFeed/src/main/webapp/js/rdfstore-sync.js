define("rdfstore-sync", [], function() {
	var RdfstoreSync = {};

	//TODO: load resource via LDP with ETag into local storage
	//TODO: ldp and sparql version
	//TODO: log changes
	//TODO: upsync with ETag check

	RdfstoreSync.init = function(store) {
		
		/*var nodeToNT = function(node) {
		if(node.interfaceName == 'NamedNode')
			return '<' + node.nominalValue + '>';
		else if(node.interfaceName == 'BlankNode')
			return '_:' + node.nominalValue ;
		else
			return '\"\"\"' + node.nominalValue.replace(/\"/g, '\\"')  + '\"\"\"';//TODO: escape "
	};

	var graphToNT = function(graph) {
		var nt = "";

		graph.forEach(function(triple) {
			nt += nodeToNT(triple.subject) + ' ' + nodeToNT(triple.predicate) + ' ' + nodeToNT(triple.object) + '.\n';
		});

		return nt;
	};*/
		
		
		
		Crc32 = function() {
			this.crc = -1;
			this.table = Crc32.buildTable();
		};

		Crc32.prototype.append = function(data) {
			if(data != null) {
				for(var offset=0; offset<data.length; offset++)
					this.crc = (this.crc>>>8)^this.table[(this.crc^data[offset])&0xff];
			}

			return ~this.crc;
		};

		Crc32.buildTable = function() {
			var table = new Uint32Array(256);

			for(var i=0; i<256; i++) {
				var t = i;

				for(var j=0; j<8; j++)
					t = t&1 ? (t>>>1)^0xEDB88320 : t>>>1;

				table[i] = t;
			}

			return table;
		};

		var saveResourceData = function(url, resourceData) {
			//TODO: persist resource data 
		};

		var loadResourceData = function(url) {
			//TODO: load resource data
			return {};
		};

		var CHECKSUM_ALGO = 'checksum-alog';
		var CHECKSUM_ALGO_ETAG = 'ETag';
		var CHECKSUM_ALGO_CRC32 = 'crc32';
		var CHECKSUM = 'checksum'; 

		store.syncLdpLoad = function(url, callback) {
			//TODO: look for registered parser (mime types!)

			$.ajax(url).done(function(data) {				
				store.load("text/turtle", data, url, function(success, result) {
					var resourceData = {};

					if(ETag) {
						resourceData[CHECKSUM_ALGO] = CHECKSUM_ALGO_ETAG;
						resourceData[CHECKSUM] = ETag;
					} else {
						resourceData[CHECKSUM_ALGO] = CHECKSUM_ALGO_CRC32;
						resourceData[CHECKSUM] = (new Crc32()).append(data);
					}

					saveResourceData(resource);

					if(callback) callback(success);
				});
			});
		};

		store.syncLdpSave = function(url, force, callback) {
			var resourceData = loadResourceData(url);

			if(!force) {
				if(resourceData[CHECKSUM_ALGO] == CHECKSUM_ALGO_ETAG) {
					//TODO: head request
					if(resourceData[CHECKSUM] != ETag) callback(false);
				} else {
					//TODO: get request
					if(resourceData[CHECKSUM] != (new Crc32()).append(data)) callback(false);
				}
			}

			//TODO: build diff request
		};

		store.syncSparqlLoad = function(endpoint, url, callback) {
			
		};

		store.syncSparqlSave = function(endpoint, url, force, callback) {
			
		};

		store.subscribe(null, null, null, null, function(event, triples) {
			//TODO:
			if(event === "added") {
				//console.log(triples.length+" triples have been added");  
			} else if(event === "deleted") {
				//console.log(triples.length+" triples have been deleted");  
			} 
		});
	};

	return RdfstoreSync;
});