<div id="page">

<p>Hallo View</p>
<p>contentEditorForm</p>

<!--
	<div class="field-label">Title</div>
	<div id="title" class="field">${title}</div>
	<br />
	<div class="field-label">Content</div>
	<div id="content" class="field">${content}</div>	
	<br />
	<div class="field-label">URI</div>
	<div id="uri" class="field">http://hyperdata.org${uri}</div>	<!-- NASTY HACK -->
	<br />
	<div class="field-label">Nick</div>
	<div id="nick" class="field">${nick}</div>
-->


<div class="article" about="${uri}" typeof="sioc:Post">
  <h1 property="title">${title}</h1>
  <div property="content">${content}</div>
  <!-- div >http://hyperdata.org${uri}</div -->  
  <div property="um:login">${login}</div>
</div>