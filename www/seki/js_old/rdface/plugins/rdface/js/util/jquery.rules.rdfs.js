/*
 * jQuery RDF Ontology @VERSION
 * 
 * Copyright (c) 2009 Jeni Tennison
 * Licensed under the MIT (MIT-LICENSE.txt)
 *
 * Depends:
 *  jquery.uri.js
 *  jquery.xmlns.js
 *  jquery.datatype.js
 *  jquery.curie.js
 *  jquery.rdf.js
 *  jquery.rules.js
 */
/*global jQuery */
(function ($) {

  var 
    nsRdf = "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    nsRdfs = "http://www.w3.org/2000/01/rdf-schema#";

  $.rdf.ruleset.rdfs = $.rdf.ruleset()
    .prefix('rdf', nsRdf)
    .prefix('rdfs', nsRdfs)
    .add('?subject ?property ?object', '?property a rdf:Property')
    .add('?property rdfs:range ?class',
      ['?property a rdf:Property', '?class a rdfs:Class'])
    .add(['?property rdfs:range ?class', '?subject ?property ?object'],
      '?object a ?class')
    .add('?property rdfs:domain ?class',
      ['?property a rdf:Property', '?class a rdfs:Class'])
    .add(['?property rdfs:domain ?class', '?subject ?property ?object'],
      '?subject a ?class')
    .add('?instance a ?class', '?class a rdfs:Class')
    .add('?subclass rdfs:subClassOf ?class',
      ['?subclass a rdfs:Class', '?class a rdfs:Class'])
    .add(['?subclass rdfs:subClassOf ?class', '?instance a ?subclass'],
      '?instance a ?class')
    .add('?subproperty rdfs:subPropertyOf ?property',
      ['?subproperty a rdf:Property', '?property a rdf:Property'])
    .add(['?subproperty rdfs:subPropertyOf ?property', '?subject ?subproperty ?object'],
      '?subject ?property ?object')
    .add('?statement rdf:subject ?resource', '?statement a rdf:Statement')
    .add('?statement rdf:predicate ?property',
      ['?statement a rdf:Statement', '?property a rdf:Property'])
    .add('?statement rdf:object ?resource', '?statement a rdf:Statement')
    .add(['?statement rdf:subject ?subject', '?statement rdf:predicate ?property', '?statement rdf:object ?object'],
      '?subject ?property ?object')
    .add('?subject rdfs:isDefinedBy ?object', '?subject rdfs:seeAlso ?object')

})(jQuery);
