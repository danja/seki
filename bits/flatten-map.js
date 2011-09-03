// not tried

var x ={
"title":{"value":"Hello World!","type":"literal"},
"content":{"value":"This is a test.","type":"literal"},
"date":{"value":"2011-08-30T19:00Z","type":"literal"},
"nick":{"value":"danja","type":"literal"}
}

function flatten(json){
  var nj = {},
      walk = function(j){
          var jp;
          for(var prop in j){
              jp = j[prop];
              if(jp.toString() === "[object Object]"){
                  walk(jp);
              }else{
                  nj[prop] = jp;
              }
          }
      };
  walk(json);
  return nj;
}


