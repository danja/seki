/*
 * jQuery RDF @VERSION
 *
 * Copyright (c) 2008,2009 Jeni Tennison
 * Licensed under the MIT (MIT-LICENSE.txt)
 *
 * Depends:
 *  jquery.uri.js
 *  jquery.xmlns.js
 *  jquery.datatype.js
 *  jquery.curie.js
 *  jquery.rdf.js
 *  jquery.rdf.json.js
 *  jquery.rdf.xml.js
 */
/**
 * @fileOverview jQuery RDF/XML parser
 * @author <a href="mailto:jeni@jenitennison.com">Jeni Tennison</a>
 * @copyright (c) 2008,2009 Jeni Tennison
 * @license MIT license (MIT-LICENSE.txt)
 * @version 1.0
 */
/**
 * @exports $ as jQuery
 */
/**
 * @ignore
 */
(function ($) {
  var
    rdfNs = "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  
    addAttribute = function (parent, namespace, name, value) {
      var doc = parent.ownerDocument,
        a;
      if (namespace !== undefined && namespace !== null) {
        if (doc.createAttributeNS) {
          a = doc.createAttributeNS(namespace, name);
          a.nodeValue = value;
          parent.attributes.setNamedItemNS(a);
        } else {
          a = doc.createNode(2, name, namespace);
          a.nodeValue = value;
          parent.attributes.setNamedItem(a);
        }
      } else {
        a = doc.createAttribute(name);
        a.nodeValue = value;
        parent.attributes.setNamedItem(a);
      }
      return parent;
    },

    createXmlnsAtt = function (parent, namespace, prefix) {
      if (namespace === 'http://www.w3.org/XML/1998/namespace' || namespace === 'http://www.w3.org/2000/xmlns/') {
      } else if (prefix) {
        addAttribute(parent, 'http://www.w3.org/2000/xmlns/', 'xmlns:' + prefix, namespace);
      } else {
        addAttribute(parent, undefined, 'xmlns', namespace);
      }
      return parent;
    },

    createDocument = function (namespace, name) {
      var doc, xmlns = '', prefix, addAttribute = false;
      if (namespace !== undefined && namespace !== null) {
        if (/:/.test(name)) {
          prefix = /([^:]+):/.exec(name)[1];
        }
        addAttribute = true;
      }
      if (document.implementation &&
          document.implementation.createDocument) {
        doc = document.implementation.createDocument(namespace, name, null);
        if (addAttribute) {
          createXmlnsAtt(doc.documentElement, namespace, prefix);
        }
        return doc;
      } else {
        doc = new ActiveXObject("Microsoft.XMLDOM");
        doc.async = "false";
        if (prefix === undefined) {
          xmlns = ' xmlns="' + namespace + '"';
        } else {
          xmlns = ' xmlns:' + prefix + '="' + namespace + '"';
        }
        doc.loadXML('<' + name + xmlns + '/>');
        return doc;
      }
    },

    appendElement = function (parent, namespace, name, indent) {
      var doc = parent.ownerDocument,
        e;
      if (namespace !== undefined && namespace !== null) {
        e = doc.createElementNS ? doc.createElementNS(namespace, name) : doc.createNode(1, name, namespace);
      } else {
        e = doc.createElement(name);
      }
      if (indent !== -1) {
        appendText(parent, '\n');
        if (indent === 0) {
          appendText(parent, '\n');
        } else {
          appendText(parent, '  ');
        }
      }
      parent.appendChild(e);
      return e;
    },

    appendText = function (parent, text) {
      var doc = parent.ownerDocument,
        t;
      t = doc.createTextNode(text);
      parent.appendChild(t);
      return parent;
    },

    appendXML = function (parent, xml) {
      var parser, doc, i, child;
      try {
        doc = new ActiveXObject('Microsoft.XMLDOM');
        doc.async = "false";
        doc.loadXML('<temp>' + xml + '</temp>');
      } catch(e) {
        parser = new DOMParser();
        doc = parser.parseFromString('<temp>' + xml + '</temp>', 'text/xml');
      }
      for (i = 0; i < doc.documentElement.childNodes.length; i += 1) {
        parent.appendChild(doc.documentElement.childNodes[i].cloneNode(true));
      }
      return parent;
    },

    createRdfXml = function (triples, options) {
      var doc = createDocument(rdfNs, 'rdf:RDF'),
        dump = $.rdf.parsers['application/json'].dump(triples),
        namespaces = options.namespaces || {},
        indent = options.indent || false,
        n, s, se, p, pe, i, v,
        m, local, ns, prefix;
      for (n in namespaces) {
        createXmlnsAtt(doc.documentElement, namespaces[n], n);
      }
      for (s in dump) {
        if (dump[s][$.rdf.type.value] !== undefined) {
          m = /(.+[#\/])([^#\/]+)/.exec(dump[s][$.rdf.type.value][0].value);
          ns = m[1];
          local = m[2];
          for (n in namespaces) {
            if (namespaces[n].toString() === ns) {
              prefix = n;
              break;
            }
          }
          se = appendElement(doc.documentElement, ns, prefix + ':' + local, indent ? 0 : -1);
        } else {
          se = appendElement(doc.documentElement, rdfNs, 'rdf:Description', indent ? 0 : -1);
        }
        if (/^_:/.test(s)) {
          addAttribute(se, rdfNs, 'rdf:nodeID', s.substring(2));
        } else {
          addAttribute(se, rdfNs, 'rdf:about', s);
        }
        for (p in dump[s]) {
          if (p !== $.rdf.type.value.toString() || dump[s][p].length > 1) {
            m = /(.+[#\/])([^#\/]+)/.exec(p);
            ns = m[1];
            local = m[2];
            for (n in namespaces) {
              if (namespaces[n].toString() === ns) {
                prefix = n;
                break;
              }
            }
            for (i = (p === $.rdf.type.value.toString() ? 1 : 0); i < dump[s][p].length; i += 1) {
              v = dump[s][p][i];
              pe = appendElement(se, ns, prefix + ':' + local, indent ? 1 : -1);
              if (v.type === 'uri') {
                addAttribute(pe, rdfNs, 'rdf:resource', v.value);
              } else if (v.type === 'literal') {
                if (v.datatype !== undefined) {
                  if (v.datatype === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral') {
                    addAttribute(pe, rdfNs, 'rdf:parseType', 'Literal');
                    if (indent) {
                      appendText(pe, '\n    ');
                    }
                    appendXML(pe, v.value);
                    if (indent) {
                      appendText(pe, '\n  ');
                    }
                  } else {
                    addAttribute(pe, rdfNs, 'rdf:datatype', v.datatype);
                    appendText(pe, v.value);
                  }
                } else if (v.lang !== undefined) {
                  addAttribute(pe, 'http://www.w3.org/XML/1998/namespace', 'xml:lang', v.lang);
                  appendText(pe, v.value);
                } else {
                  appendText(pe, v.value);
                }
              } else {
                // blank node
                addAttribute(pe, rdfNs, 'rdf:nodeID', v.value.substring(2));
              }
            }
            if (indent) {
              appendText(se, '\n');
            }
          }
        }
      }
      if (indent) {
        appendText(doc.documentElement, '\n\n');
      }
      return doc;
    },

    getDefaultNamespacePrefix = function (namespaceUri) {
      switch (namespaceUri) {
        case 'http://www.w3.org/1999/02/22-rdf-syntax-ns':
          return 'rdf';
        case 'http://www.w3.org/XML/1998/namespace':
          return 'xml';
        case 'http://www.w3.org/2000/xmlns/':
          return 'xmlns';
        default:
          throw ('No default prefix mapped for namespace ' + namespaceUri);
      }
    },

    hasAttributeNS  = function(elem, namespace, name){
      var basename;
      if (elem.hasAttributeNS) {
        return elem.hasAttributeNS(namespace, name);
      } else {
        try {
          basename = /:/.test(name) ? /:(.+)$/.exec(name)[1] : name;
          return elem.attributes.getQualifiedItem(basename, namespace) !== null;
        } catch (e) {
          return elem.getAttribute(getDefaultNamespacePrefix(namespace) + ':' + name) !== null;
        }
      }
    },

    getAttributeNS = function(elem, namespace, name){
      var basename;
      if (elem.getAttributeNS) {
        return elem.getAttributeNS(namespace, name);
      } else {
        try {
          basename = /:/.test(name) ? /:(.+)$/.exec(name)[1] : name;
          return elem.attributes.getQualifiedItem(basename, namespace).nodeValue;
        } catch (e) {
          return elem.getAttribute(getDefaultNamespacePrefix(namespace) + ':' + name);
        }
      }
    },

    getLocalName = function(elem){
      return elem.localName || elem.baseName;
    },

    parseRdfXmlSubject = function (elem, base) {
      var s, subject;
      if (hasAttributeNS(elem, rdfNs, 'about')) {
        s = getAttributeNS(elem, rdfNs, 'about');
        subject = $.rdf.resource('<' + s + '>', { base: base });
      } else if (hasAttributeNS(elem, rdfNs, 'ID')) {
        s = getAttributeNS(elem, rdfNs, 'ID');
        subject = $.rdf.resource('<#' + s + '>', { base: base });
      } else if (hasAttributeNS(elem, rdfNs, 'nodeID')) {
        s = getAttributeNS(elem, rdfNs, 'nodeID');
        subject = $.rdf.blank('_:' + s);
      } else {
        subject = $.rdf.blank('[]');
      }
      return subject;
    },

    parseRdfXmlDescription = function (elem, isDescription, base, lang) {
      var subject, p, property, o, object, reified, lang, i, j, li = 1,
        collection1, collection2, collectionItem, collectionItems = [],
        parseType, serializer, literalOpts = {}, oTriples, triples = [];
      lang = getAttributeNS(elem, 'http://www.w3.org/XML/1998/namespace', 'lang') || lang;
      base = getAttributeNS(elem, 'http://www.w3.org/XML/1998/namespace', 'base') || base;
      if (lang !== null && lang !== undefined && lang !== '') {
        literalOpts = { lang: lang };
      }
      subject = parseRdfXmlSubject(elem, base);
      if (isDescription && (elem.namespaceURI !== rdfNs || getLocalName(elem) !== 'Description')) {
        property = $.rdf.type;
        object = $.rdf.resource('<' + elem.namespaceURI + getLocalName(elem) + '>');
        triples.push($.rdf.triple(subject, property, object));
      }
      for (i = 0; i < elem.attributes.length; i += 1) {
        p = elem.attributes.item(i);
        if (p.namespaceURI !== undefined &&
            p.namespaceURI !== 'http://www.w3.org/2000/xmlns/' &&
            p.namespaceURI !== 'http://www.w3.org/XML/1998/namespace' &&
            p.prefix !== 'xmlns' &&
            p.prefix !== 'xml') {
          if (p.namespaceURI !== rdfNs) {
            property = $.rdf.resource('<' + p.namespaceURI + getLocalName(p) + '>');
            object = $.rdf.literal(literalOpts.lang ? p.nodeValue : '"' + p.nodeValue + '"', literalOpts);
            triples.push($.rdf.triple(subject, property, object));
          } else if (getLocalName(p) === 'type') {
            property = $.rdf.type;
            object = $.rdf.resource('<' + p.nodeValue + '>', { base: base });
            triples.push($.rdf.triple(subject, property, object));
          }
        }
      }
      var parentLang = lang;
      for (i = 0; i < elem.childNodes.length; i += 1) {
        p = elem.childNodes[i];
        if (p.nodeType === 1) {
          if (p.namespaceURI === rdfNs && getLocalName(p) === 'li') {
            property = $.rdf.resource('<' + rdfNs + '_' + li + '>');
            li += 1;
          } else {
            property = $.rdf.resource('<' + p.namespaceURI + getLocalName(p) + '>');
          }
          lang = getAttributeNS(p, 'http://www.w3.org/XML/1998/namespace', 'lang') || parentLang;
           if (lang !== null && lang !== undefined && lang !== '') {
             literalOpts = { lang: lang };
          } else {
            literalOpts = {};
          }
          if (hasAttributeNS(p, rdfNs, 'resource')) {
            o = getAttributeNS(p, rdfNs, 'resource');
            object = $.rdf.resource('<' + o + '>', { base: base });
          } else if (hasAttributeNS(p, rdfNs, 'nodeID')) {
            o = getAttributeNS(p, rdfNs, 'nodeID');
            object = $.rdf.blank('_:' + o);
          } else if (hasAttributeNS(p, rdfNs, 'parseType')) {
            parseType = getAttributeNS(p, rdfNs, 'parseType');
            if (parseType === 'Literal') {
              try {
                serializer = new XMLSerializer();
                o = serializer.serializeToString(p.getElementsByTagName('*')[0]);
              } catch (e) {
                o = "";
                for (j = 0; j < p.childNodes.length; j += 1) {
                  o += p.childNodes[j].xml;
                }
              }
              object = $.rdf.literal(o, { datatype: rdfNs + 'XMLLiteral' });
            } else if (parseType === 'Resource') {
              oTriples = parseRdfXmlDescription(p, false, base, lang);
              if (oTriples.length > 0) {
                object = oTriples[oTriples.length - 1].subject;
                triples = triples.concat(oTriples);
              } else {
                object = $.rdf.blank('[]');
              }
            } else if (parseType === 'Collection') {
              if (p.getElementsByTagName('*').length > 0) {
                for (j = 0; j < p.childNodes.length; j += 1) {
                  o = p.childNodes[j];
                  if (o.nodeType === 1) {
                    collectionItems.push(o);
                  }
                }
                collection1 = $.rdf.blank('[]');
                object = collection1;
                for (j = 0; j < collectionItems.length; j += 1) {
                  o = collectionItems[j];
                  oTriples = parseRdfXmlDescription(o, true, base, lang);
                  if (oTriples.length > 0) {
                    collectionItem = oTriples[oTriples.length - 1].subject;
                    triples = triples.concat(oTriples);
                  } else {
                    collectionItem = parseRdfXmlSubject(o);
                  }
                  triples.push($.rdf.triple(collection1, $.rdf.first, collectionItem));
                  if (j === collectionItems.length - 1) {
                    triples.push($.rdf.triple(collection1, $.rdf.rest, $.rdf.nil));
                  } else {
                    collection2 = $.rdf.blank('[]');
                    triples.push($.rdf.triple(collection1, $.rdf.rest, collection2));
                    collection1 = collection2;
                  }
                }
              } else {
                object = $.rdf.nil;
              }
            }
          } else if (hasAttributeNS(p, rdfNs, 'datatype')) {
            o = p.childNodes[0].nodeValue;
            object = $.rdf.literal(o, { datatype: getAttributeNS(p, rdfNs, 'datatype') });
          } else if (p.getElementsByTagName('*').length > 0) {
            for (j = 0; j < p.childNodes.length; j += 1) {
              o = p.childNodes[j];
              if (o.nodeType === 1) {
                oTriples = parseRdfXmlDescription(o, true, base, lang);
                if (oTriples.length > 0) {
                  object = oTriples[oTriples.length - 1].subject;
                  triples = triples.concat(oTriples);
                } else {
                  object = parseRdfXmlSubject(o);
                }
              }
            }
          } else if (p.childNodes.length > 0) {
            o = p.childNodes[0].nodeValue;
            object = $.rdf.literal(literalOpts.lang ? o : '"' + o + '"', literalOpts);
          } else {
            oTriples = parseRdfXmlDescription(p, false, base, lang);
            if (oTriples.length > 0) {
              object = oTriples[oTriples.length - 1].subject;
              triples = triples.concat(oTriples);
            } else {
              object = $.rdf.blank('[]');
            }
          }
          triples.push($.rdf.triple(subject, property, object));
          if (hasAttributeNS(p, rdfNs, 'ID')) {
            reified = $.rdf.resource('<#' + getAttributeNS(p, rdfNs, 'ID') + '>', { base: base });
            triples.push($.rdf.triple(reified, $.rdf.subject, subject));
            triples.push($.rdf.triple(reified, $.rdf.property, property));
            triples.push($.rdf.triple(reified, $.rdf.object, object));
          }
        }
      }
      return triples;
    },

    parseRdfXml = function (doc) {
      var i, lang, d, triples = [];
      if (doc.documentElement.namespaceURI === rdfNs && getLocalName(doc.documentElement) === 'RDF') {
        lang = getAttributeNS(doc.documentElement, 'http://www.w3.org/XML/1998/namespace', 'lang');
        base = getAttributeNS(doc.documentElement, 'http://www.w3.org/XML/1998/namespace', 'base') || $.uri.base();
        triples = $.map(doc.documentElement.childNodes, function (d) {
          if (d.nodeType === 1) {
            return parseRdfXmlDescription(d, true, base, lang);
          } else {
            return null;
          }
        });
        /*
        for (i = 0; i < doc.documentElement.childNodes.length; i += 1) {
          d = doc.documentElement.childNodes[i];
          if (d.nodeType === 1) {
            triples = triples.concat(parseRdfXmlDescription(d, true, base, lang));
          }
        }
        */
      } else {
        triples = parseRdfXmlDescription(doc.documentElement, true);
      }
      return triples;
    };

  $.rdf.parsers['application/rdf+xml'] = {
    parse: function (data) {
      var doc;
      try {
        doc = new ActiveXObject("Microsoft.XMLDOM");
        doc.async = "false";
        doc.loadXML(data);
      } catch(e) {
        var parser = new DOMParser();
        doc = parser.parseFromString(data, 'text/xml');
      }
      return doc;
    },
    serialize: function (data) {
      if (data.xml) {
        return data.xml.replace(/\s+$/,'');
      } else {
        serializer = new XMLSerializer();
        return serializer.serializeToString(data);
      }
    },
    triples: parseRdfXml,
    dump: createRdfXml
  };

})(jQuery);
