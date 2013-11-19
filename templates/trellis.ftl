<!DOCTYPE html>
<html>

<head>

    <link rel="stylesheet" type="text/css" media="screen" href="css/trellis.css" />

    <!-- jQuery/UI scripts -->
    <script type="text/javascript" src="js/jquery-ui-1.10.3/jquery-1.9.1.js"></script>
    <script type="text/javascript" src="js/jquery-ui-1.10.3/ui/jquery.ui.core.js"></script>
    <script type="text/javascript" src="js/jquery-ui-1.10.3/ui/jquery.ui.widget.js"></script>
    <script type="text/javascript" src="js/jquery-ui-1.10.3/ui/jquery.ui.position.js"></script>

    <script type="text/javascript" src="js/jquery-ui-1.10.3/ui/jquery.ui.mouse.js"></script>
    <script type="text/javascript" src="js/jquery-ui-1.10.3/ui/jquery.ui.draggable.js"></script>
    <script type="text/javascript" src="js/jquery-ui-1.10.3/ui/jquery.ui.droppable.js"></script>
    <script type="text/javascript" src="js/jquery-ui-1.10.3/ui/jquery.ui.sortable.js"></script>

    <script type="text/javascript" src="js/jquery-ui-1.10.3/ui/jquery.ui.button.js"></script>
    <script type="text/javascript" src="js/jquery-ui-1.10.3/ui/jquery.ui.dialog.js"></script>

    <!-- misc 3rd party -->
    <script type="text/javascript" src="js/date.format.js"></script>

    <!-- Trellis-specific -->
    <script type="text/javascript" src="js/ts-ajax.js"></script>
          <script type="text/javascript" src="js/n3-browser.js"></script>
    <script type="text/javascript" src="js/ts-serialise.js"></script>
    <script type="text/javascript" src="js/ts-tree.js"></script>
  

    <title>Trellis</title>
</head>

<body>
    <div class="page">
            <div id="ts-entry-template">
            <div class="dropzone ui-droppable"></div>
                <dl id="nid-template" class="ts-entry"><span class="ts-expander">&nbsp;</span>
                    <dt><span class="ts-title"></span></dt>
                    <dd class="ts-actions"><span class="ts-delete" title="Delete">x</span><span class="ts-addChild" title="Add Child">+</span>
                        <span class="ts-card" title="Card">&#9634;</span>
                    </dd>
                    <dd class="ts-status"><span class="ts-handle" title="Drag">&#8597;</span>
                    </dd>
                </dl>
            </div>
    </div>
    
    <input type="submit" name="save" id="save" value="Save" />

</body>
<script>
$(function() {
    var callback = function(turtle) {
    console.log("Loaded: "+turtle);
    }
    ts_load(${uri}, callback);
}
</script>
</html>
