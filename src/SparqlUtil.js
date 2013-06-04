var rdf = require('../lib/node-rdf/index');

var first = "@prefix um: <http://purl.org/stuff/usermanagement#>. \
<http://hyperdata.org/users/danny> a um:User ; \
um:fullname \"Danny Ayers\"; \
um:login \"danny\"; \
um:password \"sasha\"; \
um:email \"danny.ayers@gmail.com\"; \
um:profile \"http://dannyayers.com/foaf.rdf\" .";

var second = "@prefix um: <http://purl.org/stuff/usermanagement#> . \
<http://hyperdata.org/users/danny> a um:User ; \
um:fullname \"Danny Ayers\"; \
um:login \"danny\";\
um:password \"sasha\"; \
um:email \"danny.ayers@gmail.com\"; \
um:profile \"http://dannyayers.com/foaf.rdf\" .";

replaceSimpleTree(null, first);
// graph1.forEach(function(triple) {
//     console.log(triple);
// });

function createGraph(graphURI) {
    var sparql = "CREATE SILENT GRAPH <"+graphURI+">";
}

/*
 * a simple tree is defined as a set of triples with common subject resource
 * 
 * needs error checks?
 */
function replaceSimpleTree(targetGraph, simpleTreeTurtle) {
    var inputGraph = new rdf.IndexedGraph();
    var parser = new rdf.TurtleParser();
    
    parser.parse(simpleTreeTurtle, null, null, null, inputGraph);

    var tripleArray = inputGraph.toArray();

    var rootResource = tripleArray[0].subject;
    
    var replaceMap = {
        
    }
    console.log(rootResource);
    
}