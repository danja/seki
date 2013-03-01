<xsl:stylesheet xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#" xmlns:owl="http://www.w3.org/2002/07/owl#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:w6="http://purl.org/ibis/w6#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:output method="html" version="1.0" encoding="iso-8859-1" indent="no"/>
  <xsl:variable name="indent_text" select="'  '"/>
  <xsl:template match="*[count(*) = 0]">
    <xsl:param name="indent" select="0"/>
    <xsl:call-template name="indent">
      <xsl:with-param name="count" select="$indent"/>
    </xsl:call-template>
    <xsl:element name="{name()}">
      <xsl:copy-of select="@*"/>
      <xsl:value-of select="normalize-space(.)"/>
    </xsl:element>
    <xsl:text/>
  </xsl:template>
  <xsl:template match="*[count(*) > 0]">
    <xsl:param name="indent" select="0"/>
    <xsl:call-template name="indent">
      <xsl:with-param name="count" select="$indent"/>
    </xsl:call-template>
    <xsl:element name="{name()}">
      <xsl:copy-of select="@*"/>
      <xsl:text/>
      <xsl:apply-templates>
        <xsl:with-param name="indent" select="$indent + 1"/>
      </xsl:apply-templates>
      <xsl:call-template name="indent">
        <xsl:with-param name="count" select="$indent"/>
      </xsl:call-template>
    </xsl:element>
    <xsl:text/>
  </xsl:template>
  <xsl:template name="indent">
    <xsl:param name="count"/>
    <xsl:if test="$count > 0">
      <xsl:copy-of select="$indent_text"/>
      <xsl:call-template name="indent">
        <xsl:with-param name="count" select="$count - 1"/>
      </xsl:call-template>
    </xsl:if>
  </xsl:template>
  <xsl:template match="text()[string-length(normalize-space(.)) < 1]"/>
  <xsl:template match="text()[string-length(normalize-space(.)) > 1]">
    <xsl:param name="indent" select="0"/>
    <xsl:call-template name="indent">
      <xsl:with-param name="count" select="$indent"/>
    </xsl:call-template>
    <xsl:value-of select="normalize-space(.)"/>
    <xsl:text/>
  </xsl:template>
</xsl:stylesheet>
