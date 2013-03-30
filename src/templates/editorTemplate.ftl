<!doctype html>
 
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Seki Editor</title>
  <link rel="stylesheet" href="/seki/css/jquery-ui.css" />
  <script src="/seki/js/jquery-1.9.1.js"></script>
  <script src="/seki/js/jquery-ui.js"></script>
  <link rel="stylesheet" href="/seki/css/style.css" />
  <script>
  $(function() {
    $( "#tabs" ).tabs({
      beforeLoad: function( event, ui ) {
        ui.jqXHR.error(function() {
          ui.panel.html(
            "Need to be logged in and have appropriate permissions to use this tab" );
        });
      }
    });
  });
  </script>
</head>
<body>
 
<div id="tabs">
  <ul>
<!--   <li><a href="#tabs-1">${contentUri}</a></li> -->
     <li><a href="${uri}?mode=content">View</a></li>
     <li><a href="${uri}?mode=editHTML">Content Editor</a></li>
     <li><a href="${uri}?mode=editSource">Source Editor</a></li>
  <!--  
    <li><a href="ajax/content2.html">Tab 2</a></li>
    <li><a href="ajax/content3-slow.php">Tab 3 (slow)</a></li>
    <li><a href="ajax/content4-broken.php">Tab 4 (broken)</a></li>
    -->
  </ul>
</div>
 
 
</body>
</html>