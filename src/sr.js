var sr = {
  "head": {
    "vars": [ "s" , "p" , "o" ]
  } ,
  "results": {

    "bindings": [
      {
        "s": { "type": "uri" , "value": "http://hyperdata.org/seki/Hello" } ,
        "p": { "type": "uri" , "value": "http://purl.org/dc/elements/1.1/date" } ,
        "o": { "type": "literal" , "value": "2011-08-30T19:00Z" }
      } ,
      {
        "s": { "type": "uri" , "value": "http://hyperdata.org/seki/Hello" } ,
        "p": { "type": "uri" , "value": "http://xmlns.com/foaf/0.1/maker" } ,
        "o": { "type": "uri" , "value": "http://dannyayers.com/me#" }
      } ,
      {
        "s": { "type": "uri" , "value": "http://hyperdata.org/seki/Hello" } ,
        "p": { "type": "uri" , "value": "http://purl.org/dc/elements/1.1/title" } ,
        "o": { "type": "literal" , "value": "Hello World!" }
      } ,
      {
        "s": { "type": "uri" , "value": "http://hyperdata.org/seki/Hello" } ,
        "p": { "type": "uri" , "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" } ,
        "o": { "type": "uri" , "value": "http://rdfs.org/sioc/ns#Post" }
      } ,
      {
        "s": { "type": "uri" , "value": "http://hyperdata.org/seki/Hello" } ,
        "p": { "type": "uri" , "value": "http://rdfs.org/sioc/ns#content" } ,
        "o": { "type": "literal" , "value": "This is a test." }
      } ,
      {
        "s": { "type": "uri" , "value": "http://dannyayers.com/me#" } ,
        "p": { "type": "uri" , "value": "http://xmlns.com/foaf/0.1/nick" } ,
        "o": { "type": "literal" , "value": "danja" }
      } ,
      {
        "s": { "type": "uri" , "value": "http://hyperdata.org/seki/HelloAgain" } ,
        "p": { "type": "uri" , "value": "http://purl.org/dc/elements/1.1/date" } ,
        "o": { "type": "literal" , "value": "2011-08-30T19:10Z" }
      } ,
      {
        "s": { "type": "uri" , "value": "http://hyperdata.org/seki/HelloAgain" } ,
        "p": { "type": "uri" , "value": "http://xmlns.com/foaf/0.1/maker" } ,
        "o": { "type": "uri" , "value": "http://dannyayers.com/me#" }
      } ,
      {
        "s": { "type": "uri" , "value": "http://hyperdata.org/seki/HelloAgain" } ,
        "p": { "type": "uri" , "value": "http://purl.org/dc/elements/1.1/title" } ,
        "o": { "type": "literal" , "value": "Hello again" }
      } ,
      {
        "s": { "type": "uri" , "value": "http://hyperdata.org/seki/HelloAgain" } ,
        "p": { "type": "uri" , "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" } ,
        "o": { "type": "uri" , "value": "http://rdfs.org/sioc/ns#Post" }
      } ,
      {
        "s": { "type": "uri" , "value": "http://hyperdata.org/seki/HelloAgain" } ,
        "p": { "type": "uri" , "value": "http://rdfs.org/sioc/ns#content" } ,
        "o": { "type": "literal" , "value": "This is a second test." }
      } ,
      {
        "s": { "type": "uri" , "value": "http://hyperdata.org/seki/HelloThree" } ,
        "p": { "type": "uri" , "value": "http://purl.org/dc/elements/1.1/date" } ,
        "o": { "type": "literal" , "value": "2011-08-30T19:20Z" }
      } ,
      {
        "s": { "type": "uri" , "value": "http://hyperdata.org/seki/HelloThree" } ,
        "p": { "type": "uri" , "value": "http://xmlns.com/foaf/0.1/maker" } ,
        "o": { "type": "uri" , "value": "http://dannyayers.com/me#" }
      } ,
      {
        "s": { "type": "uri" , "value": "http://hyperdata.org/seki/HelloThree" } ,
        "p": { "type": "uri" , "value": "http://purl.org/dc/elements/1.1/title" } ,
        "o": { "type": "literal" , "value": "Hello Three!" }
      } ,
      {
        "s": { "type": "uri" , "value": "http://hyperdata.org/seki/HelloThree" } ,
        "p": { "type": "uri" , "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" } ,
        "o": { "type": "uri" , "value": "http://rdfs.org/sioc/ns#Post" }
      } ,
      {
        "s": { "type": "uri" , "value": "http://hyperdata.org/seki/HelloThree" } ,
        "p": { "type": "uri" , "value": "http://rdfs.org/sioc/ns#content" } ,
        "o": { "type": "literal" , "value": "This is a third test." }
      }
    ]
  }
}
var  sys = require("sys");
var jt = sr.results.bindings;

sys.log(jt[0].o.value)
sys.log(jt[0].o.type)
sys.log(sr.results.bindings[0].o.value)