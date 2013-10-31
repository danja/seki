var fs = require('fs');

var text = fs.readFileSync('mime.types', 'ascii');
lines = text.split(/[\r\n]+/);

var map = {};

lines.forEach(function(line) {

    var fields = line.replace(/\s*#.*|^\s*|\s*$/g, '').split(/\s+/);

    if (fields.length > 1) {

        var first = fields.shift();
        var parts = first.split(/\//);

        if (parts[1].substring(0, 2) != "x-" && parts[1].substring(0, 3) != "vnd") {

            for (var i = 0; i < fields.length; i++) {
                if (!map[fields[i]]) {
                    map[fields[i]] = first;
                }
            }
        }
    }

});
// console.log(map['rdf']);
console.log(map);
