<!-- takes output from del.icio.us api and converts to RDF/XML (using Tag Ontology)

     source xml as from :
     curl https://user:passwd@api.del.icio.us/v1/posts/all
     
     see http://delicious.com/help/api#posts_all
     
     danja, 2009-04-03
 -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
	xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#" xmlns:foaf="http://xmlns.com/foaf/0.1/"
	xmlns:rss="http://purl.org/rss/1.0/" xmlns:tag="http://www.holygoat.co.uk/owl/redwood/0.1/tags/"
	xmlns:x="http://purl.org/stuff/tag-ext#" xmlns:dcterms="http://purl.org/dc/terms/" version="1.0">

	<xsl:output indent="yes" omit-xml-declaration="yes" method="xml" />

	<xsl:variable name="user" select="/posts/@user" />
	<xsl:variable name="update" select="/posts/@update" />

	<xsl:variable name="useruri">http://hyperdata.org/people/<xsl:value-of select="$user" /></xsl:variable>
	<xsl:variable name="tagroot">http://hyperdata.org/people/<xsl:value-of select="$user" />/tag/</xsl:variable>

	<xsl:template match="/">
		<rdf:RDF>
			<xsl:apply-templates />
		</rdf:RDF>
	</xsl:template>

	<xsl:template match="posts">
		<xsl:apply-templates select="post" />
	</xsl:template>

	<xsl:template match="post">
	   <xsl:variable name="space_escaped_uri"><xsl:call-template name="replace-string"> 
        <xsl:with-param name="text" select="@href"/>
        <xsl:with-param name="replace" select="' '"/>
        <xsl:with-param name="with" select="'%20'"/>
      </xsl:call-template></xsl:variable>
	
		<xsl:variable name="clean_uri"><xsl:call-template name="check_uri"><xsl:with-param name="href" select="$space_escaped_uri" /></xsl:call-template></xsl:variable>
<!-- xsl:value-of select="$uri" / -->
		<xsl:if test="$clean_uri != 'invalid'">
			<rss:item rdf:about="{$clean_uri}">

				<x:user>
					<xsl:value-of select="$user" />
				</x:user>


				<xsl:if test="@hash">
					<xsl:if test="@hash != ''">
						<x:hash>
							<xsl:value-of select="@hash" />
						</x:hash>
					</xsl:if>
				</xsl:if>

				<xsl:if test="@description">
					<dc:title>
						<xsl:value-of select="@description" />
					</dc:title>
				</xsl:if>

				<xsl:if test="@extended">
					<xsl:if test="@extended != ''">
						<dc:description>
							<xsl:value-of select="@extended" />
						</dc:description>
					</xsl:if>
				</xsl:if>

				<xsl:if test="@meta">
					<xsl:if test="@meta != ''">
						<x:meta>
							<xsl:value-of select="@meta" />
						</x:meta>
					</xsl:if>
				</xsl:if>

				<xsl:if test="@tag">
					<xsl:if test="@tag != ''">
							<xsl:call-template name="split">
								<xsl:with-param name="string" select="@tag" />
								<xsl:with-param name="date" select="@time" />
								<xsl:with-param name="pattern" select="' '" />
							</xsl:call-template>
						</xsl:if>
				</xsl:if>
			</rss:item>
		</xsl:if>
	</xsl:template>
 
	<xsl:template name="do_tag">
		<xsl:param name="tag" select="''" />
		<xsl:param name="date" />
		<xsl:if test="not($tag='%s')">
					<xsl:variable name="clean_tag" select="translate($tag, translate($tag, ' abcdefghijklmnopqrstuvwxyz0123456789', ''), '')" />
		
		<!-- generic/keyword -->
		<dcterms:subject>
			<xsl:attribute name="rdf:resource"><xsl:value-of select="$tagroot" /><xsl:value-of
					select="$clean_tag" /></xsl:attribute>
		</dcterms:subject>
		
		<!-- Tag Ontology -->
		<tag:taggedWithTag>
			<tag:Tag>
				<xsl:attribute name="rdf:about"><xsl:value-of select="$tagroot" /><xsl:value-of
					select="$clean_tag" /></xsl:attribute>
				<tag:tagName>
					<xsl:value-of select="$clean_tag" />
				</tag:tagName>
			</tag:Tag>
		</tag:taggedWithTag>
		<tag:tag>
			<tag:Tagging>
				<tag:associatedTag>
					<xsl:attribute name="rdf:resource"><xsl:value-of select="$tagroot" /><xsl:value-of
					select="$clean_tag" /></xsl:attribute>
				</tag:associatedTag>
				<tag:taggedBy>
					<xsl:attribute name="rdf:resource"><xsl:value-of select="$useruri" /></xsl:attribute>
				</tag:taggedBy>
				<tag:taggedOn><xsl:value-of select="$date" /></tag:taggedOn>
				<dc:date><xsl:value-of select="$date" /></dc:date>
			</tag:Tagging>
		</tag:tag>
		</xsl:if>
	</xsl:template>

	<xsl:template name="split">
		<xsl:param name="string" select="''" />
		<xsl:param name="pattern" />
		<xsl:param name="date" />
		<xsl:choose>
			<xsl:when test="not($string)" />
			<xsl:when test="not($pattern)">
				<xsl:call-template name="_split-characters">
					<xsl:with-param name="string" select="$string" />
					<xsl:with-param name="date" select="$date" />
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="_split-pattern">
					<xsl:with-param name="string" select="$string" />
					<xsl:with-param name="date" select="$date" />
					<xsl:with-param name="pattern" select="$pattern" />
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="_split-characters">
		<xsl:param name="string" />
		<xsl:param name="date" />
		<xsl:if test="$string">
			<xsl:call-template name="do_tag">
				<xsl:with-param name="tag" select="substring($string, 1, 1)" />
				<xsl:with-param name="date" select="$date" />
			</xsl:call-template>
			<xsl:call-template name="_split-characters">
				<xsl:with-param name="string" select="substring($string, 2)" />
				<xsl:with-param name="date" select="$date" />
			</xsl:call-template>
		</xsl:if>
	</xsl:template>

	<xsl:template name="_split-pattern">
		<xsl:param name="string" />
		<xsl:param name="pattern" />
		<xsl:param name="date" />
		<xsl:choose>
			<xsl:when test="contains($string, $pattern)">
				<xsl:if test="not(starts-with($string, $pattern))">
					<xsl:call-template name="do_tag">
						<xsl:with-param name="tag"
							select="substring-before($string, $pattern)" />
						<xsl:with-param name="date" select="$date" />
					</xsl:call-template>
				</xsl:if>
				<xsl:call-template name="_split-pattern">
					<xsl:with-param name="string"
						select="substring-after($string,
$pattern)" />
					<xsl:with-param name="pattern" select="$pattern" />
					<xsl:with-param name="date" select="$date" />
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="do_tag">
					<xsl:with-param name="tag" select="$string" />
					<xsl:with-param name="date" select="$date" />
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	  <xsl:template name="replace-string">
    <xsl:param name="text"/>
    <xsl:param name="replace"/>
    <xsl:param name="with"/>
    <xsl:choose>
      <xsl:when test="contains($text,$replace)">
        <xsl:value-of select="substring-before($text,$replace)"/>
        <xsl:value-of select="$with"/>
        <xsl:call-template name="replace-string">
          <xsl:with-param name="text"
select="substring-after($text,$replace)"/>
          <xsl:with-param name="replace" select="$replace"/>
          <xsl:with-param name="with" select="$with"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$text"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
	

<xsl:template name="check_uri">
	<xsl:param name="href" />
	<xsl:variable name="after_scheme" select="substring-after($href,'http://')" />
	<xsl:variable name="host_part" select="substring-before($after_scheme, '/')" />
	<xsl:choose>
		<xsl:when test="contains($host_part,'%')">invalid</xsl:when>
		<xsl:otherwise><xsl:value-of select="$href" /></xsl:otherwise>
	</xsl:choose>
</xsl:template>

</xsl:stylesheet>
