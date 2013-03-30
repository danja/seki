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
            "Couldn't load this tab. We'll try to fix this as soon as possible. " +
            "If this wouldn't be a demo." );
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
     <li><a href="${contentURL}">Tab 1</a></li>
     <li>Tab 2</li>
  <!--  
    <li><a href="ajax/content2.html">Tab 2</a></li>
    <li><a href="ajax/content3-slow.php">Tab 3 (slow)</a></li>
    <li><a href="ajax/content4-broken.php">Tab 4 (broken)</a></li>
    -->
  </ul>
</div>
 
 
</body>
</html>