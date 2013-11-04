<?xml version="1.0"?>

<!--  Converts Bookmarks file dumped from browser, after applying Tidy/XML to ul/li -->

<!--  danja 2011-01-07 -->

<xsl:transform xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
   <xsl:output indent="yes" omit-xml-declaration="yes" method="xml"/>
   <xsl:template match="/html">
   <html>
      <xsl:call-template name="head" />
      <body>
         <xsl:apply-templates select="body/dl"/>
         </body>
         </html>
   </xsl:template>

<xsl:template name="head">
<head>
<xsl:copy-of select="head/*" />
</head>
</xsl:template>

   <xsl:template match="dd">
      <xsl:apply-templates select="./*"/>
   </xsl:template>
   
      <xsl:template match="h3">
      <div class="description">
      	<xsl:value-of select="./text()" />
      	</div>
      	
   </xsl:template>
      
   <xsl:template match="dl">
      <ul>
      <xsl:apply-templates select="./*"/>
      </ul>
   </xsl:template>
   
      <xsl:template match="dt">
      		<li class="linkitem">
			<div class="link">
				<xsl:apply-templates select="./*"/>
				<span class="description"> </span>
			</div>
		</li>
   </xsl:template>
   
      <xsl:template match="a">
      <xsl:copy-of select="."/>
   </xsl:template>
   <xsl:template match="text()" />
</xsl:transform>
