<?xml version="1.0"?>

<xsl:transform xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rss="http://purl.org/rss/1.0/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#" xmlns:foaf="http://xmlns.com/foaf/0.1/" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
   <xsl:output indent="yes" omit-xml-declaration="yes" method="xml"/>
   <xsl:template match="/opml">
      <rdf:RDF>
         <xsl:apply-templates select="body"/>
      </rdf:RDF>
   </xsl:template>
   <xsl:template match="outline">
      <foaf:Agent>
         <foaf:weblog>
            <foaf:Document>
               <xsl:if test="@htmlUrl">
                  <xsl:attribute name="rdf:about">
                     <xsl:value-of select="@htmlUrl"/>
                  </xsl:attribute>
               </xsl:if>
               <dc:title>
                  <xsl:choose>
                     <xsl:when test="@title">
                        <xsl:value-of select="@title"/>
                     </xsl:when>
                     <xsl:otherwise>
                        <xsl:value-of select="@text"/>
                     </xsl:otherwise>
                  </xsl:choose>
               </dc:title>
               <rdfs:seeAlso>
                  <rss:channel rdf:about="{@xmlUrl}"/>
               </rdfs:seeAlso>
            </foaf:Document>
         </foaf:weblog>
      </foaf:Agent>
      <xsl:apply-templates select="outline"/>
   </xsl:template>
</xsl:transform>
