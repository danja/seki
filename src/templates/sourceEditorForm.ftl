<div id="outer">
  <form method="post" action="/post">
      <input type="hidden" value="post" name="type" />
    <label for="uri">Item URI</label>
    <input type="text" name="uri" id="uri" value="${uri}" size="50" />
    <label for="title">Title</label>
    <input type="text" name="title" id="title" value="${title}" size="20" />
    <label for="nick">By</label>
    <input type="text" name="nick" id="nick" value="${nick}" size="10" />
    <br/>
    <div align="left">
    <input type="submit" value="Post" />
    </div>
<div id="editor"></div>
</div>
<textarea id="hidden-textarea">${content}</textarea>


<script>
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/chrome");
    editor.getSession().setMode("ace/mode/html");
    editor.getSession().setValue($("#hidden-textarea").text());
</script> 