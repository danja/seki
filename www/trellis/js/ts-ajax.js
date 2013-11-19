
function ts_save(targetURL, graphURI, turtle){
   // console.log("\n"+turtle+"\n");
    $.ajax({
        type: "PUT",
        url: targetURL,
        data: turtle,
        contentType: "text/turtle"
    })
    .done(function( msg ) {
        alert( "Data Saved: " + msg );
    });
}

function ts_load(url, callback){
    
    $.ajax({
        url: url,
        dataType: "text/turtle"
    })
    .done(function(turtle) {
       callback(turtle);
    });
}