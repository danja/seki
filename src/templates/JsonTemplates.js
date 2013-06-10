
var jsonTemplates = {
    vieJsonTemplate : "
    {
       
    }
    "
}

module.exports = jsonTemplates;

/*
 * 
 *  <#list animals as being>
 < tr><td>*${being.name}<td>${being.price} Euros
 </#list>
${user}<#if user == "Big Joe">, our beloved leader</#if>

[{"c":"http://commontag.org/ns#AuthorTag"},
{"type":"http://www.w3.org/2000/01/rdf-schema#Class"},
{"label":"Author Tag"},
{"comment":"A Tag asserted by the author of a content resource."},
{"subClassOf":"http://commontag.org/ns#Tag"},
{"c":"http://commontag.org/ns#Tag"},
{"type":"http://www.w3.org/2000/01/rdf-schema#Class"},
{"label":"Tag"},
{"comment":"A Common Tag associating a URI and a keyword to annotate a resource."},
{"c":"http://commontag.org/ns#AutoTag"},{"type":"http://www.w3.org/2000/01/rdf-schema#Class"},
{"label":"Auto Tag"},{"comment":"A Tag asserted by an automated tool on a content resource."},{"subClassOf":"http://commontag.org/ns#Tag"},{"c":"http://commontag.org/ns#ReaderTag"},{"type":"http://www.w3.org/2000/01/rdf-schema#Class"},{"label":"Reader Tag"},{"comment":"A Tag asserted by the reader (consumer) of a content resource."},{"subClassOf":"http://commontag.org/ns#Tag"},{"c":"http://commontag.org/ns#TaggedContent"},{"type":"http://www.w3.org/2000/01/rdf-schema#Class"},{"label":"Tagged Content"},{"comment":"Content which has one or more Common Tag."},{"type":"http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"},{"p":"http://commontag.org/ns#isAbout"},{"domain":"http://commontag.org/ns#TaggedContent"},{"type":"http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"},{"p":"http://commontag.org/ns#label"},{"subPropertyOf":"http://www.w3.org/2000/01/rdf-schema#label"},{"domain":"http://commontag.org/ns#Tag"},{"type":"http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"},{"p":"http://commontag.org/ns#means"},{"domain":"http://commontag.org/ns#Tag"},{"type":"http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"},{"p":"http://commontag.org/ns#tagged"},{"domain":"http://commontag.org/ns#TaggedContent"},{"range":"http://commontag.org/ns#Tag"},{"type":"http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"},{"p":"http://commontag.org/ns#taggingDate"},{"subPropertyOf":"http://purl.org/dc/terms/created"},{"domain":"http://commontag.org/ns#Tag"}]
*/