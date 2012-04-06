<?xml version="1.0"?>
<!-- 
    Style sheet to transform RDF descriptions to HTML
    Author: http://rhizomik.net/~roberto

	This work is licensed under the Creative Commons Attribution-ShareAlike License.
	To view a copy of this license, visit http://creativecommons.org/licenses/by-sa/3.0/
	or send a letter to Creative Commons, 559 Nathan Abbott Way, Stanford, California 94305, USA.
	License: http://rhizomik.net/redefer/rdf2html.xsl.rdf
-->

<xsl:stylesheet version="2.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
	xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#">
	
	<xsl:output media-type="text/xhtml" encoding="UTF-8" indent="yes" omit-xml-declaration="no" method="html"/>
	
	<xsl:strip-space elements="*"/>

	<xsl:param name="language">en</xsl:param>
	<xsl:param name="mode">html</xsl:param>
	<xsl:param name="namespaces">false</xsl:param>
	<xsl:param name="logo">true</xsl:param>
	
	<xsl:variable name="isA">
		<xsl:choose>
			<xsl:when test="contains($language,'en')"><xsl:text> a </xsl:text></xsl:when>
			<xsl:when test="contains($language,'es')"><xsl:text> es </xsl:text></xsl:when>
			<xsl:otherwise><xsl:text> a </xsl:text></xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	
	<xsl:template match="/">
		<xsl:if test="$mode='html'">
			<html version="XHTML+RDFa 1.0" xmlns="http://www.w3.org/1999/xhtml">
				<head>
					<meta http-equiv="Content-Type" content="text/xhtml; charset=UTF-8"/>
					<title>Rhizomik - ReDeFer - RDF2HTML</title>
					<link href="/redefer-services/style/rhizomer.css" type="text/css" rel="stylesheet" />
				</head>
				<body>
					<xsl:apply-templates select="rdf:RDF"/>
					<xsl:if test="$logo='true'">
						<div id="footlogo">
							<div id="logo">
								<a href="http://rhizomik.net"  xmlns="http://www.w3.org/1999/xhtml">
									<img src="/redefer-services/images/rhizomer.small.png" alt="Rhizomik"/> Powered by Rhizomik
								</a>
							</div>
						</div>
					</xsl:if>
				</body>
			</html>
		</xsl:if>
		<xsl:if test="$mode='snippet' or $mode='rhizomer'">
			<xsl:if test="$mode='rhizomer'">
				<div class="browser">
					<a href="javascript:history.back()">back</a> -
					<!-- a href="javascript:showGoTo()" -->go to...<!--/a--> -
					<a href="javascript:history.forward()">forward</a>
				</div>
			</xsl:if>
			<xsl:apply-templates select="rdf:RDF"/>
			<xsl:if test="$logo='true'">
				<div id="footlogo">
					<div id="logo">
						<a href="http://rhizomik.net"  xmlns="http://www.w3.org/1999/xhtml">
							<img src="http://rhizomik.net/images/rhizomer.small.png" alt="Rhizomik"/> Powered by Rhizomik
						</a>
					</div>
				</div>
			</xsl:if>
		</xsl:if>
		<!-- Show error message if we have a parsererror -->
		<xsl:value-of select="//*[local-name()='sourcetext']"/>
	</xsl:template>
	
	<xsl:template match="rdf:RDF">
		<div class="rdf2html" xmlns="http://www.w3.org/1999/xhtml">
			<!-- Generate the xmlns for RDFa from those in the RDF/XML and attach to div#rdf2html -->
			<xsl:variable name="namespaces">
				<xsl:for-each select="/rdf:RDF/namespace::*[name()!='xml' and name()!='xsd']">
					<xsl:choose>
						<!-- The base NS in the output is XHTML so keep base NS in input RDF file with alias "base" -->
						<xsl:when test="name()=''">
							<xsl:element name="base:dummy-for-xmlns" namespace="{.}"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:element name="{concat(name(),':dummy-for-xmlns')}" namespace="{.}"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:for-each>
				<xsl:element name="xsd:dummy-for-xmlns" namespace="http://www.w3.org/2001/XMLSchema#"/>
			</xsl:variable>
			<xsl:copy-of select="$namespaces/*/namespace::*"/>

			<!-- If no RDF descriptions... -->
			<xsl:if test="count(child::*)=0">
				<p xmlns="http://www.w3.org/1999/xhtml">No data retrieved.</p>
			</xsl:if>
			<!-- If rdf:RDF has child elements, they are descriptions... -->
			<xsl:for-each select="child::*">
				<xsl:sort select="@rdf:about" order="ascending"/>
				<xsl:call-template name="rdfDescription"/>
			</xsl:for-each>
		</div>
	</xsl:template>
  	
	<xsl:template name="rdfDescription">
		<xsl:choose>
			<!-- RDF Description that contains more than labels (e.g. just type instead of rdf:Description) or is the only description -->
			<xsl:when test="(count(following-sibling::*)=0 and count(preceding-sibling::*)=0) or not(local-name()='Description') or
							*[not(name()='http://www.w3.org/2000/01/rdf-schema#') and not(local-name()='label')] | 
							@*[not(namespace-uri()='http://www.w3.org/2000/01/rdf-schema#') and not(local-name()='label' or local-name()='about')]">
				<xsl:if test="$mode='rhizomer'">
					<div class="edition" xmlns="http://www.w3.org/1999/xhtml"><span xmlns="http://www.w3.org/1999/xhtml"></span><xsl:call-template name="rdfDescriptionEdition"/></div>
				</xsl:if>
				<div class="description" xmlns="http://www.w3.org/1999/xhtml">
				<table xmlns="http://www.w3.org/1999/xhtml">
					<xsl:if test="@rdf:ID|@rdf:about">
						<xsl:attribute name="about" >
							<xsl:value-of select="@rdf:ID|@rdf:about"/>
						</xsl:attribute>
					</xsl:if>
					<xsl:call-template name="header"/>
					<xsl:call-template name="attributes"/>
					<xsl:call-template name="properties"/>
					<xsl:if test="$mode='rhizomer'">
						<tr><td class="actions" colspan="2"><xsl:call-template name="rdfDescriptionActions"/></td></tr>
					</xsl:if>
				</table>
				</div>
			</xsl:when>
			<xsl:otherwise><!-- Ignore RDF Descriptions with just labels --></xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template name="rdfDescriptionActions">
		<xsl:variable name="resource">
			<xsl:value-of select="@rdf:ID|@rdf:about|@rdf:aboutEach|@rdf:aboutEachPrefix|@rdf:bagID"/>
		</xsl:variable>
		<a class="generic" href="?query=DESCRIBE%20%3Fr%20WHERE%20%7B%20%3Fr%20%3Fp%20&lt;{$resource}&gt;%20%7D"
			onclick="javascript:rhz.describeReferrers('{$resource}'); return false;"
			title="Referrers for {$resource}" xmlns="http://www.w3.org/1999/xhtml">Referrers</a>

		<!-- Specific actions depending on the resource properties... -->
        <!-- lat/long or geo point, show in map -->
        <xsl:if test="(*[(namespace-uri()='http://www.w3.org/2003/01/geo/wgs84_pos#') and (local-name()='lat')] and 
            		   *[(namespace-uri()='http://www.w3.org/2003/01/geo/wgs84_pos#') and (local-name()='long')])
            		  or (*[(namespace-uri()='http://www.georss.org/georss#') and (local-name()='point')])">
			 -
			<a class="specific" href="#"
            	onclick="javascript:rhz.callServiceOnResource('Map', '/services/map/map.jsp', '{$resource}'); return false;"
				title="Map {$resource}" xmlns="http://www.w3.org/1999/xhtml"> Map </a>
  		</xsl:if>
        <!-- dtsart and dtend, show in timeline -->
        <xsl:if test="(*[(namespace-uri()='http://www.w3.org/2002/12/cal/icaltzd#') and (local-name()='dtend')] and 
        			  *[(namespace-uri()='http://www.w3.org/2002/12/cal/icaltzd#') and (local-name()='dtstart')]) or
        			  *[(namespace-uri()='http://purl.org/dc/elements/1.1/') and (local-name()='date')]">
			 -
			<a class="specific" href="#"
            	onclick="javascript:rhz.callServiceOnResource('Timeline', '/services/timeline/timeline.jsp', '{$resource}'); return false;"
				title="Timeline {$resource}" xmlns="http://www.w3.org/1999/xhtml"> Timeline </a>
        </xsl:if>
        <!-- resource of type s5t:Audio, show in player -->
		<xsl:if test="*[(namespace-uri()='http://rhizomik.net/s5t/s5t.owl#')]">
			<a class="specific" href="#"
            	onclick="javascript:rhz.callServiceOnResource('Player', '/services/player/player.jsp', '{$resource}'); return false;"
				title="Play {$resource}" xmlns="http://www.w3.org/1999/xhtml"> - Play </a>
        </xsl:if>
	</xsl:template>
	
	<!-- Proposed edition actions template that can be redefined by the client XSL -->
	<xsl:template name="rdfDescriptionEdition">
		<a class="action" href="javascript:rhz.editResourceDescription('{@rdf:ID|@rdf:about}')"
			title="Edit description" xmlns="http://www.w3.org/1999/xhtml">edit</a> - 
		<a class="action" href="javascript:rhz.newResourceDescription('{@rdf:ID|@rdf:about}')"
			title="New description" xmlns="http://www.w3.org/1999/xhtml">new</a> -
		<a class="action" href="javascript:rhz.deleteResourceDescription('{@rdf:ID|@rdf:about}')"
			title="Delete description" xmlns="http://www.w3.org/1999/xhtml">del</a>
	</xsl:template>
	
	<xsl:template name="embeddedRdfDescription">
		<xsl:choose>
			<xsl:when test="namespace-uri()='http://www.w3.org/1999/02/22-rdf-syntax-ns#' and 
							(local-name()='Seq' or local-name()='Alt' or local-name()='Bag')">
				<div>
					<xsl:attribute name="typeof">
						<xsl:call-template name="curie">
							<xsl:with-param name="uri" select="concat(namespace-uri(),local-name())"/>
						</xsl:call-template>
					</xsl:attribute>
					<xsl:call-template name="collectionItems"/>
				</div>
			</xsl:when>
			<!-- Embedded RDF Description that contains more than labels -->
			<xsl:when test="*[not(name()='http://www.w3.org/2000/01/rdf-schema#') and not(local-name()='label')] |
							@*[not(namespace-uri()='http://www.w3.org/2000/01/rdf-schema#') and not(local-name()='label' or local-name()='about')]">
				<table xmlns="http://www.w3.org/1999/xhtml">
					<xsl:if test="not(@rdf:parseType='Resource')">
						<xsl:call-template name="header"/>
					</xsl:if>
					<xsl:if test="@rdf:parseType='Resource'">
						<xsl:attribute name="typeof">
							<xsl:value-of select="'rdfs:Resource'"/>
						</xsl:attribute>
					</xsl:if>
					<xsl:call-template name="attributes"/>
					<xsl:call-template name="properties"/>
				</table>
			</xsl:when>
			<!-- Embeded RDF Description with just labels, just take resource -->
			<xsl:when test="parent::*[not(name()='rdf:RDF')]">
				<xsl:call-template name="resourceDetailLink">
					<xsl:with-param name="property" select="local-name(parent::*)"/>
					<xsl:with-param name="namespace" select="''"/>
					<xsl:with-param name="localname" select="@rdf:about"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise><!-- Ignore other --></xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<!-- Build the description header with the resource identifier and types, if available -->
	<xsl:template name="header">
		<xsl:choose>
			<xsl:when test="@rdf:ID|@rdf:about or not(local-name()='Description') or 
								count(*[namespace-uri()='http://www.w3.org/1999/02/22-rdf-syntax-ns#' and local-name()='type'])>0">
				<xsl:if test="@rdf:ID|@rdf:about">
					<xsl:attribute name="about" >
						<xsl:value-of select="@rdf:ID|@rdf:about"/>
					</xsl:attribute>
				</xsl:if>
				<xsl:if test="not(local-name()='Description')">
					<xsl:attribute name="typeof">
						<xsl:call-template name="curie">
							<xsl:with-param name="uri" select="concat(namespace-uri(),local-name())"/>
						</xsl:call-template>
					</xsl:attribute>
				</xsl:if>
				<tr xmlns="http://www.w3.org/1999/xhtml">
					<th colspan="2">					
						<xsl:if test="@rdf:ID|@rdf:about">
							<xsl:call-template name="resourceDetailLink">
								<xsl:with-param name="property" select="'about'"/>
								<xsl:with-param name="namespace" select="''"/>
								<xsl:with-param name="localname" select="@rdf:ID|@rdf:about|@rdf:aboutEach|@rdf:aboutEachPrefix|@rdf:bagID"/>
							</xsl:call-template>
						</xsl:if>
						<xsl:call-template name="types"/>
					</th>
				</tr>
			</xsl:when>
			<xsl:otherwise>
				<xsl:attribute name="typeof">
					<xsl:value-of select="'rdfs:Resource'"/>
				</xsl:attribute>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template name="types">
		<!-- textual decoration if there are types-->
		<xsl:if test="@rdf:ID|@rdf:about and (not(local-name()='Description') or count(*[namespace-uri()='http://www.w3.org/1999/02/22-rdf-syntax-ns#' and local-name()='type'])>0)">
			<div class="connector"><xsl:value-of select="$isA"/></div>
		</xsl:if>
		<!-- embedded rdf:type -->
		<xsl:if test="not(local-name()='Description')">
			<xsl:call-template name="resourceDetailLink">
				<xsl:with-param name="property" select="'type'"/>
				<xsl:with-param name="namespace" select="namespace-uri()"/>
				<xsl:with-param name="localname" select="local-name()"/>
			</xsl:call-template>
			<xsl:if test="*[namespace-uri()='http://www.w3.org/1999/02/22-rdf-syntax-ns#' and local-name()='type']">
				<xsl:text>, </xsl:text>
			</xsl:if>
		</xsl:if>
		<!-- rdf:type properties -->
		<xsl:for-each select="*[namespace-uri()='http://www.w3.org/1999/02/22-rdf-syntax-ns#' and local-name()='type']">
			<div rel="rdf:type" class="connector" xmlns="http://www.w3.org/1999/xhtml">
				<xsl:call-template name="property-objects"/>
			</div>
			<xsl:if test="following-sibling::*[namespace-uri()='http://www.w3.org/1999/02/22-rdf-syntax-ns#' and local-name()='type']">
				<div class="connector"><xsl:text>, </xsl:text></div>
			</xsl:if>
		</xsl:for-each>
	</xsl:template>
	
	<xsl:template name="attributes">
		<xsl:for-each select="@*[not(namespace-uri()='http://www.w3.org/1999/02/22-rdf-syntax-ns#')]">
								<!-- and not(local-name='about' or local-name='ID' or local-name='type')]" -->
			<xsl:sort select="local-name()" order="ascending"/>
			<tr xmlns="http://www.w3.org/1999/xhtml"> 
				<td xmlns="http://www.w3.org/1999/xhtml">
					<xsl:call-template name="resourceDetailLink">
						<xsl:with-param name="property" select="''"/>
						<xsl:with-param name="namespace" select="namespace-uri()"/>
						<xsl:with-param name="localname" select="local-name()"/>
					</xsl:call-template>
				</td>
				<td property="{name()}" xmlns="http://www.w3.org/1999/xhtml">
					<xsl:value-of select="."/>
				</td>
			</tr>
		</xsl:for-each>
	</xsl:template>
	
	<xsl:template name="property-objects">
		<xsl:choose>
			<xsl:when test="@rdf:resource">
				<xsl:call-template name="rdf_resource-attribute"/>
			</xsl:when>
			<xsl:when test="child::rdf:first">
				<xsl:for-each select="child::rdf:first">
					<xsl:call-template name="ListItems"/>
				</xsl:for-each>
			</xsl:when>
			<xsl:when test="@rdf:parseType='Resource'">
				<xsl:call-template name="embeddedRdfDescription"/>
			</xsl:when>
			<xsl:when test="@rdf:parseType='Collection'">
				<xsl:for-each select="child::*[1]">
					<xsl:call-template name="buildList"/>
				</xsl:for-each>
			</xsl:when>
			<xsl:when test="@rdf:parseType='Literal'">
				<xsl:attribute name="datatype">
					<xsl:call-template name="curie">
						<xsl:with-param name="uri" select="'http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral'"/>
					</xsl:call-template>
				</xsl:attribute>
				<xsl:if test="@xml:lang">
					<xsl:attribute name="xml:lang">
						<xsl:value-of select="@xml:lang"/>
					</xsl:attribute>
				</xsl:if>
				<xsl:apply-templates mode="copy-subtree"/>
			</xsl:when>
			<xsl:when test="child::*">
				<xsl:for-each select="child::*">
					<xsl:call-template name="embeddedRdfDescription"/>
				</xsl:for-each>
			</xsl:when>
			<xsl:otherwise>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template name="buildList">
		<div class="property-object" typeof="rdf:List">
			<div class="property-object" rel="rdf:first">
				<xsl:call-template name="embeddedRdfDescription"/>
			</div>
        	<div class="property-object" rel="rdf:rest">
        		<xsl:choose>
        			<xsl:when test="count(following-sibling::*)>0">
			        	<xsl:call-template name="connector">
							<xsl:with-param name="criteria" select="following-sibling::*"/>
						</xsl:call-template>
        				<xsl:for-each select="following-sibling::*[1]">
        					<xsl:call-template name="buildList"/>
        				</xsl:for-each>
        			</xsl:when>
        			<xsl:otherwise>
        				<xsl:attribute name="resource"><xsl:value-of select="'[rdf:nil]'"/></xsl:attribute>
        			</xsl:otherwise>
        		</xsl:choose>
        	</div>
        </div>
	</xsl:template>
	
	<xsl:template name="ListItems">
		<div typeof="rdf:List" xmlns="http://www.w3.org/1999/xhtml">
			<div class="list-object" xmlns="http://www.w3.org/1999/xhtml">
				<xsl:choose>
					<xsl:when test="text() and count(child::*)=0 and not(@rdf:parseType)">
						<xsl:attribute name="property">
								<xsl:value-of select="'rdf:first'"/>
						</xsl:attribute>
						<xsl:attribute name="content">
								<xsl:value-of select="."/>
						</xsl:attribute>
						<xsl:if test="@xml:lang">
							<xsl:attribute name="xml:lang">
								<xsl:value-of select="@xml:lang"/>
							</xsl:attribute>
						</xsl:if>
						<xsl:if test="@rdf:datatype">
							<xsl:attribute name="datatype">
								<xsl:call-template name="curie">
									<xsl:with-param name="uri" select="@rdf:datatype"/>
								</xsl:call-template>
							</xsl:attribute>
							<xsl:variable name="datatype-xmlns">
								<xsl:call-template name="xmlns">
									<xsl:with-param name="uri" select="@rdf:datatype"/>
								</xsl:call-template>
							</xsl:variable>
							<xsl:copy-of select="$datatype-xmlns/*/namespace::*"/>
						</xsl:if>
						<xsl:call-template name="textDetailLink">
							<xsl:with-param name="property" select="'first'"/>
							<xsl:with-param name="value" select="."/>
						</xsl:call-template>
					</xsl:when>
					<xsl:otherwise>
						<xsl:choose>
							<xsl:when test="@rdf:parseType='Literal' or 
											(count(child::*)=0 and not(@rdf:resource or @rdf:nodeID or @rdf:parseType='Resource'))">
								<xsl:attribute name="property">
									<xsl:value-of select="'rdf:first'"/>
								</xsl:attribute>
								<xsl:call-template name="property-objects"/>
							</xsl:when>
							<xsl:otherwise>
								<xsl:attribute name="rel">
									<xsl:value-of select="'rdf:first'"/>
								</xsl:attribute>
								<xsl:call-template name="property-objects"/>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:otherwise>
				</xsl:choose>
			</div>
        	<div class="list-object" rel="rdf:rest" xmlns="http://www.w3.org/1999/xhtml">
        		<xsl:choose>
        			<xsl:when test="count(../rdf:rest/child::rdf:first)>0">
			        	<xsl:call-template name="connector">
							<xsl:with-param name="criteria" select="../rdf:rest/descendant::rdf:first"/>
						</xsl:call-template>
        				<xsl:for-each select="../rdf:rest/child::rdf:first[1]">
        					<xsl:call-template name="ListItems"/>
        				</xsl:for-each>
        			</xsl:when>
        			<xsl:otherwise>
        				<xsl:attribute name="resource"><xsl:value-of select="'[rdf:nil]'"/></xsl:attribute>
        			</xsl:otherwise>
        		</xsl:choose>
        	</div>
        </div>
	</xsl:template>
	
	<xsl:template name="rdf_resource-attribute">
		<xsl:if test="@rdf:resource">
			<xsl:call-template name="resourceDetailLink">
				<xsl:with-param name="property" select="local-name()"/>
				<xsl:with-param name="namespace" select="''"/>
				<xsl:with-param name="localname" select="@rdf:resource"/>
			</xsl:call-template>
		</xsl:if>
	</xsl:template>
	
	<xsl:template name="properties">
		<xsl:for-each select="*[not(namespace-uri()='http://www.w3.org/1999/02/22-rdf-syntax-ns#' and local-name()='type')]"> <!-- and not(namespace-uri()='http://www.w3.org/2000/01/rdf-schema#' and local-name()='label') -->
			<xsl:sort select="local-name()" order="ascending"/>
			<xsl:variable name="property-name">
				<xsl:value-of select="local-name()"></xsl:value-of>
			</xsl:variable>
			<xsl:variable name="property-namespace">
				<xsl:value-of select="namespace-uri()"></xsl:value-of>
			</xsl:variable>
			<xsl:variable name="propertyCurie">
				<xsl:call-template name="curie">
					<xsl:with-param name="uri" select="concat(namespace-uri(),local-name())"/>
				</xsl:call-template>
			</xsl:variable>
			<xsl:choose>
				<!-- Property with text value -->
				<xsl:when test="text() and count(child::*)=0 and not(@rdf:parseType)">
					<xsl:variable name="isPreferredLanguage">
						<xsl:call-template name="isPreferredLanguage"/>
					</xsl:variable>
					<!-- Generate HTML rendering just for the preferred language -->
					<xsl:choose>
						<xsl:when test="$isPreferredLanguage='true'">
							<xsl:choose>
								<xsl:when test="preceding-sibling::*[local-name()=$property-name and
													namespace-uri()=$property-namespace]">
									<!-- Ignore, already processed with first value of the same property -->
								</xsl:when>
								<xsl:otherwise>
									<tr class="{$property-namespace}{$property-name}" xmlns="http://www.w3.org/1999/xhtml">
										<td xmlns="http://www.w3.org/1999/xhtml">
											<xsl:call-template name="resourceDetailLink">
												<xsl:with-param name="property" select="''"/>
												<xsl:with-param name="namespace" select="namespace-uri()"/>
												<xsl:with-param name="localname" select="local-name()"/>
											</xsl:call-template>
										</td>
										<td property="{$propertyCurie}" content="{.}" xmlns="http://www.w3.org/1999/xhtml">
											<xsl:if test="@xml:lang">
												<xsl:attribute name="xml:lang">
													<xsl:value-of select="@xml:lang"/>
												</xsl:attribute>
											</xsl:if>
											<xsl:if test="@rdf:datatype">
												<xsl:attribute name="datatype">
													<xsl:call-template name="curie">
														<xsl:with-param name="uri" select="@rdf:datatype"/>
													</xsl:call-template>
												</xsl:attribute>
												<xsl:variable name="datatype-xmlns">
													<xsl:call-template name="xmlns">
														<xsl:with-param name="uri" select="@rdf:datatype"/>
													</xsl:call-template>
												</xsl:variable>
												<xsl:copy-of select="$datatype-xmlns/*/namespace::*"/>
											</xsl:if>
											<!--xsl:call-template name="property-attributes"/-->
											<div class="property-object" xmlns="http://www.w3.org/1999/xhtml">
												<xsl:call-template name="textDetailLink">
													<xsl:with-param name="property" select="local-name()"/>
													<xsl:with-param name="value" select="."/>
												</xsl:call-template>
											</div>
											<xsl:call-template name="connector">
												<xsl:with-param name="criteria" select="following-sibling::*[local-name()=$property-name and
																						namespace-uri()=$property-namespace]"/>
											</xsl:call-template>
											<xsl:for-each select="following-sibling::*[local-name()=$property-name and
																		namespace-uri()=$property-namespace]">
												
												<span property="{$propertyCurie}" content="{.}" xmlns="http://www.w3.org/1999/xhtml">
												<xsl:if test="@xml:lang">
													<xsl:attribute name="xml:lang">
														<xsl:value-of select="@xml:lang"/>
													</xsl:attribute>
												</xsl:if>
												<xsl:if test="@rdf:datatype">
													<xsl:attribute name="datatype">
														<xsl:call-template name="curie">
															<xsl:with-param name="uri" select="@rdf:datatype"/>
														</xsl:call-template>
													</xsl:attribute>
													<xsl:variable name="datatype-xmlns">
														<xsl:call-template name="xmlns">
															<xsl:with-param name="uri" select="@rdf:datatype"/>
														</xsl:call-template>
													</xsl:variable>
													<xsl:copy-of select="$datatype-xmlns/*/namespace::*"/>
												</xsl:if>
												</span>
												<!--xsl:call-template name="property-attributes"/-->
												<div class="property-object" xmlns="http://www.w3.org/1999/xhtml">
													<xsl:call-template name="textDetailLink">
														<xsl:with-param name="property" select="local-name()"/>
														<xsl:with-param name="value" select="."/>
													</xsl:call-template>
												</div>
												<xsl:call-template name="connector">
													<xsl:with-param name="criteria" select="following-sibling::*[local-name()=$property-name and
																							namespace-uri()=$property-namespace]"/>
												</xsl:call-template>
											</xsl:for-each>	
										</td>
									</tr>
								</xsl:otherwise>
							</xsl:choose>						
						</xsl:when>
						<xsl:otherwise>
							<!-- Generate RDFa also for non preferred languages -->
							<div property="{$propertyCurie}" content="{.}" xmlns="http://www.w3.org/1999/xhtml">
								<xsl:if test="@xml:lang">
									<xsl:attribute name="xml:lang">
										<xsl:value-of select="@xml:lang"/>
									</xsl:attribute>
								</xsl:if>
								<xsl:if test="@rdf:datatype">
									<xsl:attribute name="datatype">
										<xsl:call-template name="curie">
											<xsl:with-param name="uri" select="@rdf:datatype"/>
										</xsl:call-template>
									</xsl:attribute>
									<xsl:variable name="datatype-xmlns">
										<xsl:call-template name="xmlns">
											<xsl:with-param name="uri" select="@rdf:datatype"/>
										</xsl:call-template>
									</xsl:variable>
									<xsl:copy-of select="$datatype-xmlns/*/namespace::*"/>
								</xsl:if>
							</div>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>
				<xsl:otherwise>
					<xsl:choose>
						<xsl:when test="preceding-sibling::*[local-name()=$property-name and
											namespace-uri()=$property-namespace]">
							<!-- Ignore, already processed with first value of the same property -->
						</xsl:when>
						<xsl:otherwise>
							<tr class="{$property-namespace}{$property-name}" xmlns="http://www.w3.org/1999/xhtml">
								<td xmlns="http://www.w3.org/1999/xhtml">
									<xsl:call-template name="resourceDetailLink">
										<xsl:with-param name="property" select="''"/>
										<xsl:with-param name="namespace" select="namespace-uri()"/>
										<xsl:with-param name="localname" select="local-name()"/>
									</xsl:call-template>
								</td>
								<td xmlns="http://www.w3.org/1999/xhtml">
									<xsl:choose>
										<xsl:when test="@rdf:parseType='Literal' or 
														(count(child::*)=0 and not(@rdf:resource or @rdf:nodeID or @rdf:parseType='Resource'))">
											<div class="property-object" property="{$propertyCurie}" xmlns="http://www.w3.org/1999/xhtml">
												<xsl:call-template name="property-objects"/>
											</div>
										</xsl:when>
										<xsl:otherwise>
											<xsl:choose>
												<xsl:when test="child::rdf:first">
													<div class="list-object" rel="{$propertyCurie}" xmlns="http://www.w3.org/1999/xhtml">
														<xsl:call-template name="property-objects"/>
													</div>
												</xsl:when>
												<xsl:otherwise>
													<div class="property-object" rel="{$propertyCurie}" xmlns="http://www.w3.org/1999/xhtml">
														<xsl:call-template name="property-objects"/>
													</div>
												</xsl:otherwise>
											</xsl:choose>
										</xsl:otherwise>
									</xsl:choose>
									<xsl:call-template name="connector">
										<xsl:with-param name="criteria" select="following-sibling::*[local-name()=$property-name and
																				namespace-uri()=$property-namespace]"/>
									</xsl:call-template>
									<xsl:for-each select="following-sibling::*[local-name()=$property-name and
															namespace-uri()=$property-namespace]">
										<div class="property-object" rel="{$propertyCurie}" xmlns="http://www.w3.org/1999/xhtml">
											<xsl:call-template name="property-objects"/>	
										</div>
										<xsl:call-template name="connector">
											<xsl:with-param name="criteria" select="following-sibling::*[local-name()=$property-name and
																					namespace-uri()=$property-namespace]"/>
										</xsl:call-template>
									</xsl:for-each>
								</td>
							</tr>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
	</xsl:template>
	
	<xsl:template name="collectionItems">
		<xsl:for-each select="*">
			<xsl:variable name="propertyCurie">
				<xsl:value-of select="'rdf:li'"/>
			</xsl:variable>
			<xsl:choose>
				<xsl:when test="text() and count(descendant::*)=0 and not(@rdf:parseType)">
					<xsl:variable name="isPreferredLanguage">
						<xsl:call-template name="isPreferredLanguage"/>
					</xsl:variable>
					<!-- Generate HTML rendering just for the preferred language -->
					<xsl:choose>
						<xsl:when test="$isPreferredLanguage='true'">
							<div property="{$propertyCurie}" content="{.}" xmlns="http://www.w3.org/1999/xhtml">
								<xsl:if test="@xml:lang">
									<xsl:attribute name="xml:lang">
										<xsl:value-of select="@xml:lang"/>
									</xsl:attribute>
								</xsl:if>
								<xsl:if test="@rdf:datatype">
									<xsl:attribute name="datatype">
										<xsl:call-template name="curie">
											<xsl:with-param name="uri" select="@rdf:datatype"/>
										</xsl:call-template>
									</xsl:attribute>
									<xsl:variable name="datatype-xmlns">
										<xsl:call-template name="xmlns">
											<xsl:with-param name="uri" select="@rdf:datatype"/>
										</xsl:call-template>
									</xsl:variable>
									<xsl:copy-of select="$datatype-xmlns/*/namespace::*"/>
								</xsl:if>
								<!--xsl:call-template name="property-attributes"/-->
								<xsl:call-template name="textDetailLink">
									<xsl:with-param name="property" select="local-name()"/>
									<xsl:with-param name="value" select="."/>
								</xsl:call-template>
								<xsl:call-template name="connector">
									<xsl:with-param name="criteria" select="following-sibling::*"/>
								</xsl:call-template>
							</div>					
						</xsl:when>
						<xsl:otherwise>
							<!-- Generate RDFa also for non preferred languages -->
							<div property="{$propertyCurie}" content="{.}" xmlns="http://www.w3.org/1999/xhtml">
								<xsl:if test="@xml:lang">
									<xsl:attribute name="xml:lang">
										<xsl:value-of select="@xml:lang"/>
									</xsl:attribute>
								</xsl:if>
								<xsl:if test="@rdf:datatype">
									<xsl:attribute name="datatype">
										<xsl:call-template name="curie">
											<xsl:with-param name="uri" select="@rdf:datatype"/>
										</xsl:call-template>
									</xsl:attribute>
									<xsl:variable name="datatype-xmlns">
										<xsl:call-template name="xmlns">
											<xsl:with-param name="uri" select="@rdf:datatype"/>
										</xsl:call-template>
									</xsl:variable>
									<xsl:copy-of select="$datatype-xmlns/*/namespace::*"/>
								</xsl:if>
							</div>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>
				<xsl:otherwise>
					<xsl:choose>
						<xsl:when test="@rdf:parseType='Literal'">
							<div class="property-object" property="{$propertyCurie}" xmlns="http://www.w3.org/1999/xhtml">
								<xsl:call-template name="property-objects"/>
							</div>
						</xsl:when>
						<xsl:otherwise>
							<div class="property-object" rel="{$propertyCurie}" xmlns="http://www.w3.org/1999/xhtml">
								<xsl:call-template name="property-objects"/>
							</div>
						</xsl:otherwise>
					</xsl:choose>
					<xsl:call-template name="connector">
						<xsl:with-param name="criteria" select="following-sibling::*"/>
					</xsl:call-template>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
	</xsl:template>
	
	<xsl:template name="connector">
		<xsl:param name="criteria"/>
		<xsl:choose>
			<xsl:when test="count($criteria)>1">
				<div class="connector" xmlns="http://www.w3.org/1999/xhtml"><xsl:text>,</xsl:text></div>
			</xsl:when>
			<xsl:when test="count($criteria)=1">
				<div class="connector" xmlns="http://www.w3.org/1999/xhtml"><xsl:text disable-output-escaping="yes">&amp;nbsp; and</xsl:text></div>
			</xsl:when>
		</xsl:choose>	
	</xsl:template>
	
	<xsl:template name="isPreferredLanguage">
		<xsl:variable name="element">
			<xsl:value-of select="name()"/>
		</xsl:variable>
		<xsl:choose>
			<!-- Firstly, select if is preferred language -->
			<xsl:when test="contains(@xml:lang,$language)">
				<xsl:value-of select="true()"/>
			</xsl:when>
			<!-- Secondly, select default language version if there is not a preferred language version -->
			<xsl:when test="contains(@xml:lang,'en') and count(parent::*/*[name()=$element and contains(@xml:lang,$language)])=0">
				<xsl:value-of select="true()"/>
			</xsl:when>
			<!-- Thirdly, select version without language tag if there is not preferred language nor default language version -->
			<xsl:when test="not(@xml:lang) and count(parent::*/*[name()=$element and contains(@xml:lang,$language)])=0 and 
									   count(parent::*/*[name()=$element and contains(@xml:lang,'en')])=0 ">
				<xsl:value-of select="true()"/>
			</xsl:when>
			<!-- Otherwise, ignore -->
			<xsl:otherwise><xsl:value-of select="false()"/></xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template name="getLabel">
		<xsl:param name="uri"/>
		<xsl:param name="property"/>

		<xsl:variable name="last-char">
			<xsl:value-of select="substring($uri,string-length($uri)-1)"/>
		</xsl:variable>
		<xsl:variable name="uri-noslash">
			<xsl:choose>
				<xsl:when test="contains($last-char,'/')">
                      	<xsl:value-of select="substring($uri,1,string-length($uri)-1)"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="$uri"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>

		
		<xsl:variable name="namespace">
			<xsl:call-template name="get-ns">
				<xsl:with-param name="uri" select="$uri-noslash"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="localname">
			<xsl:call-template name="get-name">
				<xsl:with-param name="uri" select="$uri-noslash"/>
			</xsl:call-template>
		</xsl:variable>		
		
		<xsl:choose>
			<xsl:when test="//*[@rdf:about=$uri]/rdfs:label[contains(@xml:lang,$language)]">
				<xsl:value-of select="//*[@rdf:about=$uri]/rdfs:label[contains(@xml:lang,$language)]"/>
			</xsl:when>
			<xsl:when test="//*[@rdf:about=$uri]/rdfs:label[contains(@xml:lang,'en')]">
				<xsl:value-of select="//*[@rdf:about=$uri]/rdfs:label[contains(@xml:lang,'en')]"/>
			</xsl:when>
			<xsl:when test="//*[@rdf:about=$uri]/rdfs:label">
				<xsl:value-of select="//*[@rdf:about=$uri]/rdfs:label"/>
			</xsl:when>
			<xsl:when test="$namespaces='true' and namespace::*[.=$namespace and name()!='']">
				<xsl:variable name="namespaceAlias">
					<xsl:value-of select="name(namespace::*[.=$namespace and name()!=''])"/>
				</xsl:variable>
				<xsl:value-of select="concat(concat($namespaceAlias,':'),$localname)"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="$namespaces='true' and $namespace = namespace::*[name()='']">
						<xsl:value-of select="concat(':',$localname)"/>
					</xsl:when>
					<xsl:when test="$namespaces='false' and $namespace = namespace::*[name()='']">
						<xsl:value-of select="$localname"/>
					</xsl:when>
					<xsl:when test="$namespaces='true' and $property = 'type'">
						<xsl:value-of select="$localname"/>
					</xsl:when>
					<xsl:when test="$namespaces='false'">
						<xsl:value-of select="$localname"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="$uri"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<!-- Create a browsable link if rdf:about or rdf:ID property.
		 Otherwise, create a link to describe the property value URI -->
	<xsl:template name="resourceDetailLink">
		<xsl:param name="property"/>
		<xsl:param name="namespace"/>
		<xsl:param name="localname"/>
		<xsl:variable name="uri">
			<xsl:value-of select="concat($namespace,$localname)"/>
		</xsl:variable>
		<xsl:variable name="linkName">
			<xsl:call-template name="getLabel">
				<xsl:with-param name="uri" select="$uri"/>
				<xsl:with-param name="property" select="$property"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="escaped-uri">
			<xsl:call-template name="replace-string">
				<xsl:with-param name="text" select="$uri"/>
				<xsl:with-param name="replace" select="'#'"/>
				<xsl:with-param name="with" select="'%23'"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="linkTextPrePre">
			<xsl:call-template name="replace-string">
				<xsl:with-param name="text" select="$linkName"/>
				<xsl:with-param name="replace" select="'_'"/>
				<xsl:with-param name="with" select="' '"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="linkTextPre">
        	<xsl:choose>
            	<xsl:when test="contains($linkTextPrePre, '://')">
					<xsl:call-template name="replace-string">
						<xsl:with-param name="text" select="$linkTextPrePre"/>
						<xsl:with-param name="replace" select="'/'"/>
							<xsl:with-param name="with" select="'/ '"/>
						</xsl:call-template>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="$linkTextPrePre"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:variable>
			<xsl:variable name="linkText">
				<xsl:call-template name="replace-string">
					<xsl:with-param name="text" select="$linkTextPre"/>
					<xsl:with-param name="replace" select="'/ / '"/>
					<xsl:with-param name="with" select="'//'"/>
				</xsl:call-template>
			</xsl:variable>
			<!-- xsl:choose>
				<xsl:when test="contains($linkText, '://')">
					<a class="browse" href="{$uri}"	title="{$uri}" xmlns="http://www.w3.org/1999/xhtml">
						<xsl:value-of select="$linkText"/>
					</a>
				</xsl:when>
				<xsl:otherwise -->
					<xsl:choose>
						<xsl:when test="$mode='rhizomer' and $property!='about'">
							<a class="describe" href="?query=DESCRIBE%20&lt;{$escaped-uri}&gt;"
								onclick="javascript:rhz.describeResource('{$uri}'); return false;"
								title="Describe {$uri}" xmlns="http://www.w3.org/1999/xhtml">
								<xsl:if test="$property != ''">
									<xsl:attribute name="resource">
										<xsl:value-of select="$uri"/>
									</xsl:attribute>
								</xsl:if>
								<xsl:value-of select="$linkText"/>
							</a>
						</xsl:when>
						<xsl:otherwise>
							<a class="browse" href="{$uri}" title="Browse {$uri}" xmlns="http://www.w3.org/1999/xhtml">
								<xsl:value-of select="$linkText"/>
							</a>
						</xsl:otherwise>
					</xsl:choose>
				<!-- /xsl:otherwise>
			</xsl:choose -->
	</xsl:template>
	
	<!-- Create a browsable link if property value is a URL. 
		 Otherwise, write the property value  -->
	<xsl:template name="textDetailLink">
		<xsl:param name="property"/>
		<xsl:param name="value"/>
		<xsl:choose>
			<xsl:when test="starts-with($value, 'http://') or starts-with($value, 'https://')">
				<xsl:variable name="linkTextPrePre">
					<xsl:call-template name="replace-string">
						<xsl:with-param name="text" select="$value"/>
						<xsl:with-param name="replace" select="'_'"/>
						<xsl:with-param name="with" select="' '"/>
					</xsl:call-template>
				</xsl:variable>
				<xsl:variable name="linkTextPre">
					<xsl:call-template name="replace-string">
						<xsl:with-param name="text" select="$linkTextPrePre"/>
						<xsl:with-param name="replace" select="'/'"/>
						<xsl:with-param name="with" select="'/ '"/>
					</xsl:call-template>
				</xsl:variable>
				<xsl:variable name="linkText">
					<xsl:call-template name="replace-string">
						<xsl:with-param name="text" select="$linkTextPre"/>
						<xsl:with-param name="replace" select="'/ / '"/>
						<xsl:with-param name="with" select="'//'"/>
					</xsl:call-template>
				</xsl:variable>
				<a class="browse" href="{$value}" title="Browse {$value}" xmlns="http://www.w3.org/1999/xhtml">
					<xsl:value-of select="$linkText"/>
				</a>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="."/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template name="substring-after-last">
		<xsl:param name="text"/>
		<xsl:param name="chars"/>
		<xsl:choose>
		  <xsl:when test="contains($text, $chars)">
			<xsl:variable name="last" select="substring-after($text, $chars)"/>
			<xsl:call-template name="substring-after-last">
				<xsl:with-param name="text" select="$last"/>
				<xsl:with-param name="chars" select="$chars"/>
			</xsl:call-template>
		  </xsl:when>
		  <xsl:otherwise>
			<xsl:value-of select="$text"/>
		  </xsl:otherwise>
		</xsl:choose>
  	</xsl:template>
  
  	<xsl:template name="substring-before-last">
		<xsl:param name="text"/>
		<xsl:param name="chars"/>
		<xsl:choose>
		  <xsl:when test="contains($text, $chars)">
			<xsl:variable name="before" select="substring-before($text, $chars)"/>
			<xsl:variable name="after" select="substring-after($text, $chars)"/>
			<xsl:choose>
			  <xsl:when test="contains($after, $chars)">
			    <xsl:variable name="before-last">
					<xsl:call-template name="substring-before-last">
				  		<xsl:with-param name="text" select="$after"/>
				  		<xsl:with-param name="chars" select="$chars"/>
					</xsl:call-template>
				</xsl:variable>
				<xsl:value-of select="concat($before,concat($chars,$before-last))"/>
			  </xsl:when>
			  <xsl:otherwise>
				<xsl:value-of select="$before"/>
			  </xsl:otherwise>
			</xsl:choose>
		  </xsl:when>
		  <xsl:otherwise>
			<xsl:value-of select="$text"/>
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
					<xsl:with-param name="text" select="substring-after($text,$replace)"/>
					<xsl:with-param name="replace" select="$replace"/>
					<xsl:with-param name="with" select="$with"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$text"/>
			</xsl:otherwise>
		</xsl:choose>
  	</xsl:template>
  
    <xsl:template name="get-ns">
		<xsl:param name="uri"/>
		<xsl:choose>
	  		<xsl:when test="contains($uri,'#')">
				<xsl:value-of select="concat(substring-before($uri,'#'),'#')"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:variable name="ns-without-slash">
					<xsl:call-template name="substring-before-last">
						<xsl:with-param name="text" select="$uri"/>
						<xsl:with-param name="chars" select="'/'"/>
					</xsl:call-template>
				</xsl:variable>
				<xsl:value-of select="concat($ns-without-slash, '/')"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
    <xsl:template name="get-name">
		<xsl:param name="uri"/>
		<xsl:choose>
	  		<xsl:when test="contains($uri,'#')">
				<xsl:value-of select="substring-after($uri,'#')"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="substring-after-last">
					<xsl:with-param name="text" select="$uri"/>
					<xsl:with-param name="chars" select="'/'"/>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template name="xmlns">
		<xsl:param name="uri"/>
		<xsl:variable name="namespace">
			<xsl:call-template name="get-ns">
				<xsl:with-param name="uri" select="$uri"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="namespace::*[.=$namespace]">
			</xsl:when>
			<xsl:otherwise>
				<xsl:element name="{concat(generate-id(),':dummy-for-xmlns')}" namespace="{$namespace}"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
		
	<xsl:template name="curie">
		<xsl:param name="uri"/>
		<xsl:variable name="namespace">
			<xsl:call-template name="get-ns">
				<xsl:with-param name="uri" select="$uri"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="localname">
			<xsl:call-template name="get-name">
				<xsl:with-param name="uri" select="$uri"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="namespace::*[.=$namespace and name()!='']">
				<xsl:variable name="namespaceAlias">
					<xsl:value-of select="name(namespace::*[.=$namespace and name()!=''])"/>
				</xsl:variable>
				<xsl:value-of select="concat(concat($namespaceAlias,':'),$localname)"/>
			</xsl:when>			
			<xsl:when test="$namespace='http://www.w3.org/2001/XMLSchema#'">
				<xsl:value-of select="concat('xsd:',$localname)"/>
			</xsl:when>
			<xsl:when test="namespace::*[name()='']">
				<xsl:value-of select="concat('base:',$localname)"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="concat(concat(generate-id(),':'),$localname)"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template match="*|@*|text()" mode="copy-subtree">
		<xsl:copy>
			<xsl:apply-templates select="*|@*|text()" mode="copy-subtree"/>
		</xsl:copy>
	</xsl:template>
	
</xsl:stylesheet>
