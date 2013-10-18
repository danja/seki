<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <link href="/css/bootstrap.css" rel="stylesheet" />
    <link href="/css/fontawesome/css/font-awesome.css" rel="stylesheet" />
    <link rel="stylesheet" href="/css/hallo.css" />
    <link rel="stylesheet" href="/css/seki-hallo.css" />
    <link type="text/css" href="/css/jquery-ui-1.8.16.custom.css" rel="stylesheet" />
    <script type="text/javascript" src="/js/jquery/jquery-1.10.2.js"></script>
    <script type="text/javascript" src="/js/jquery-ui-1.10.0.custom.min.js"></script>
    <script type="text/javascript" src="/js/rangy-core-1.2.3.js"></script>
    <script type="text/javascript" src="/js/hallo.js"></script>
    <!-- script src="/js/showdown.js"></script -->
    <!-- script src="/js/to-markdown.js"></script -->
    <script src="/js/editor.js"></script>
  </head>
  <body>
    <header>
    </header>

<!-- a href="/register.html">Register</a> <a href="/login.html">login</a --> 

<div id="content">
    <div xmlns:sioc="http://rdfs.org/sioc/ns#" 
         xmlns:dcterms="http://purl.org/dc/terms/" 
         xmlns:um="http://purl.org/stuff/usermanagement#"
         
         about="http://hyperdata.org/${uri}">
      <article typeof="sioc:Post" about="http://hyperdata.org${uri}">
        <span class="label">title:</span> <div id="title" class="editable" property="dcterms:title">${title}</div><!-- make this a link? -->
        <span class="label">content:</span> <div id="content" class="editable" property="sioc:content">${content}</div>
        <span class="label">login:</span> <div id="login" class="editable" property="um:login">${login}</div>
        <!-- div id="fullname" class="editable" property="um:fullname">${fullname}</div -->
      </article>
    </div>

</div><!-- end content -->

</br>

<form id="form">
  <input type="submit" value="Submit">
</form>

<!-- textarea id="source"></textarea -->

        <footer>
    </footer>
    
<script>
$('#form').submit(function () {
    var context = {
        "title": "http://purl.org/dc/terms/title", 
        "content": "http://rdfs.org/sioc/ns#content", 
        "login": "http://purl.org/stuff/usermanagement#login", 
        "fullname": "http://purl.org/stuff/usermanagement#fullname"
    };

    var data = { 
        "@context": context,
        "@type": "http://rdfs.org/sioc/ns#Post"
    };
    
    $(".editable").each(function(index, element){
    // console.log( $( this ).text() );
   //   console.log( $( this ).attr("id") );
        data[$(this).attr("id")] = $(this).html();
    });

    console.log("POSTing "+JSON.stringify(data));

    $.ajax({
        url: "${uri}",
        type: "PUT", 
        data: JSON.stringify(data),
     //   dataType: "application/json",
        contentType: "application/json",
        success: function(returnData) {
            alert("Success post");
             console.log("JSON = "+JSON.stringify(returnData));
},
                complete: function(returnData) {
        
             console.log("JSON = "+JSON.stringify(returnData));
                if (returnData.status == 201) { // may not be correct here
                    window.location = returnData.getResponseHeader('Location');
                };
        }
        
        
    });
   return false;  


});
</script>
  </body>
</html>
