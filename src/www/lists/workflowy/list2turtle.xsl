<?xml version="1.0" encoding="UTF-8"?>

<!--
changes: 
2008-04-07 : typo in namespace (!!) fixed, final PI/comment gobbler added (patch from gabriele renzi, http://www.riffraff.info - thanks!)
2006-07-02 : swapped dc:date for dc:created on dtreview

danny.ayers@gmail.com
-->
<xsl:transform xmlns:dc="http://purl.org/dc/elements/1.1/" 
xmlns:rss="http://purl.org/rss/1.0/" 
xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#" 
xmlns:foaf="http://xmlns.com/foaf/0.1/" 
xmlns:skos="http://www.w3.org/2004/02/skos/core#" 
xmlns:admin="http://webns.net/mvcb/"
xmlns:xhtml="http://www.w3.org/1999/xhtml" 
xmlns:owl="http://www.w3.org/2002/07/owl#" 
xmlns:review="http://www.purl.org/stuff/rev#" 
xmlns:lists="http://www.purl.org/stuff/lists/" 
xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">


<xsl:output method="text"/><!--  indent="yes" omit-xml-declaration="yes"  -->
<xsl:strip-space elements="*"/>

<xsl:template match="/">
@prefix rdf:     &lt;http://www.w3.org/1999/02/22-rdf-syntax-ns#&gt; .
@prefix rdfs:    &lt;http://www.w3.org/2000/01/rdf-schema#&gt; .
@prefix lists:    &lt;http://purl.org/stuff/lists/&gt; .

	<xsl:apply-templates />
	a lists:Root .
</xsl:template>

<xsl:template match="/ul">
	<xsl:apply-templates />
</xsl:template>

<xsl:template match="ul">
<xsl:apply-templates />
	<!--  [ lists:children ( <xsl:apply-templates /> ) ] -->
</xsl:template>

<xsl:template match="li">
	   [ rdfs:label "<xsl:value-of select='normalize-space(text())' />" <xsl:if test="*"> ; 
	      lists:items ( <xsl:apply-templates /> ) </xsl:if> ]
</xsl:template>

<xsl:template match="comment()|processing-instruction()|text()"/>

</xsl:transform>