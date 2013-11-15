
function ts_save(targetURL, graphURI, turtle){
    console.log("\n"+turtle+"\n");
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