/*
 * $Id$
 * This library enables web applications to easily store triples into Web Storage.
 * See Copyright for the status of this software.
 * uchida@w3.org
 */

/**
 * Triplestore wrapper for HTML5 WebStorage.
 * @main Triplestore
 * @class Triplestore
 * @constructor
 * @uses localStorage
 */
var Triplestore = function() {
  this.st = localStorage;
  this.prefixMapping = {};
  this.appPrefix = "<W3C>";
  this.appPrefixLen = this.appPrefix.length;
};

(function(){
  resolveQName = function(prefixMapping, qname) {
    if(!qname) {
      return null;
    }
    var resolved = null;
    if(isAbsoluteURI(qname)) {
      resolved = qname;
    } else {
      var index = qname.indexOf(":");
      if(index == -1) {
        resolved = qname;
      } else {
        var prefix = qname.substr(0, index);
        var iri = prefixMapping[prefix];
        if(iri) {
          resolved = iri + qname.substr(index + 1);
        } else {
          resolved = qname;
        }
      }
    }
    return resolved;
  };
  isAbsoluteURI = function(url_str) {
    var index = url_str.indexOf("://");
    return index == -1 ? false : true;
  };
  /**
   * Sets a mapping given a mapping and a URI to map.
   * @method setMapping
   * @param mapping {String} mapping
   * @param iri {String} iri
   * @example
   *   st.setMapping("foaf", "http://xmlns.com/foaf/0.1/");
   */
  Triplestore.prototype.setMapping = function(mapping, iri) {
    this.prefixMapping[mapping] = iri;
  };
  /**
   * Retrieves a list of DOMStrings which are IRI identifiers for
   * subjects given an optional property and value to match against.
   * @method getSubjects
   * @param [property] {String} property
   * @param [value] {String} value
   * @return {Array} Sequence&lt;DOMString>
   * @example
   *   st.getSubjects("foaf:name", "Bob");
   */
  Triplestore.prototype.getSubjects = function(property, value) {
    var hasValue = function(list, value) {
      for(var i = 0; list && i < list.length; i++) {
        if(list[i] == value) {
          return true;
        }
      }
      return false;
    };
    
    //init
    property = resolveQName(this.prefixMapping, property);
    value = resolveQName(this.prefixMapping, value);
    
    var res = [];
    for(var subject in this.st) {
      if(subject.substr(0, this.appPrefixLen) != this.appPrefix) {
        continue;
      }
      var props_str = this.st.getItem(subject);
      var props = JSON.parse(props_str);
      
      if(property) {
        if(value) {
          if(hasValue(props[property], value)) {
            res.push(subject.substr(this.appPrefixLen));
          }
        } else {
          if(props[property]) {
            res.push(subject.substr(this.appPrefixLen));
          }
        }
      } else {
        for(var prop in props) {
          if(!value || hasValue(props[prop], value)) {
            res.push(subject.substr(this.appPrefixLen));
            break;
          }
        }
      }
    }
    return res;
  };
  /**
   * Retrieves a list of DOMStrings which are IRI identifiers for
   * properties given an optional subject to match against.
   * @method getProperties
   * @param [subject] {String} subject
   * @return {Array} Sequence&lt;DOMString>
   * @example
   *   st.getProperties("http://sample.org/bob");
   */
  Triplestore.prototype.getProperties = function(subject) {
    if(subject) {
      //init
      subject = resolveQName(this.prefixMapping, subject);
      subject = subject ? this.appPrefix + subject: null;
      
      var props_str = this.st.getItem(subject);
      var props = JSON.parse(props_str);
      var res = [];
      for(var prop in props) {
        res.push(prop);
      }
      return res; 
    } else {
      var map = {};
      for(subject in this.st) {
        if(subject.substr(0, this.appPrefixLen) == this.appPrefix) {
          var props_str = this.st.getItem(subject);
          var props = JSON.parse(props_str);
          for(var prop in props) {
            map[prop] = null;
          }
        }
      }
      var res = [];
      for(var key in map) {
        res.push(key);
      }
      return res;
    }
  };
  /**
   * Retrieves a list of mixed types given an optional subject
   * and property to match against.
   * @method getValues
   * @param [subject] {String} subject
   * @param [property] {String} property
   * @return {Array} Sequence&lt;any>
   * @example
   *   st.getValues("http://sample.org/bob", "foaf:name");
   */
  Triplestore.prototype.getValues = function(subject, property) {
    //init
    subject = resolveQName(this.prefixMapping, subject);
    property = resolveQName(this.prefixMapping, property);
    subject = subject ? this.appPrefix + subject: null;
    
    var subjects = [];
    if(subject) {
      subjects.push(subject);
    } else {
      for(var subject in this.st) {
        if(subject.substr(0, this.appPrefixLen) == this.appPrefix) {
          subjects.push(subject);
        }
      }
    }
    
    var res = [];
    for(var i = 0; i < subjects.length; i++) {
      var subject = subjects[i];
      var props_str = this.st.getItem(subject);
      if(props_str) {
        var props = JSON.parse(props_str);
      
        if(property) {
          if(props[property]) {
            res = res.concat(props[property]);
          }
        } else {
          for(var prop in props) {
            res = res.concat(props[prop]);
          }
        }
      }
    }
    return res;
  };
  /**
   * Set a triple to localStorage. The old value of the property is overwritten.
   * @method set
   * @param subject {String} subject
   * @param property {String} property
   * @param value {String} value
   * @example
   *   st.set("http://sample.org/bob", "foaf:name", "Bob");
   */
  Triplestore.prototype.set = function(subject, property, value) {
    //init
    subject = resolveQName(this.prefixMapping, subject);
    property = resolveQName(this.prefixMapping, property);
    value = resolveQName(this.prefixMapping, value);
    subject = subject ? this.appPrefix + subject: null;
    
    var props_str = this.st[subject];
    if(props_str) {
      var props = JSON.parse(props_str);
      props[property] = new Array(value);
      this.st.setItem(subject, JSON.stringify(props));
    } else {
      var props = {};
      props[property] = new Array(value);
      this.st.setItem(subject, JSON.stringify(props)); 
    }
  };
  /**
   * Add a triple to localStorage. If the property has already values,
   * the new value is concatenated to them.
   * @method add
   * @param subject {String} subject
   * @param property {String} property
   * @param value {String} value
   * @example
   *   st.add("http://sample.org/bob", "foaf:name", "Bob");
   */
  Triplestore.prototype.add = function(subject, property, value) {
    //init
    subject = resolveQName(this.prefixMapping, subject);
    property = resolveQName(this.prefixMapping, property);
    value = resolveQName(this.prefixMapping, value);
    subject = subject ? this.appPrefix + subject: null;
    
    var props_str = this.st[subject];
    if(props_str) {//exist
      var props = JSON.parse(props_str);
      if(props[property]) {
        props[property].push(value);
      } else {
        props[property] = new Array(value);
      }
      this.st.setItem(subject, JSON.stringify(props));
    } else {//not exist
      var props = {};
      props[property] = new Array(value);
      this.st.setItem(subject, JSON.stringify(props)); 
    }
  };
  /**
   * Remove an subject or a property from internal storage to match against.
   * @method remove
   * @param [subject] {String} subject
   * @param [property] {String} property
   * @example
   *   st.remove("http://sample.org/bob", "foaf:name");
   */
  Triplestore.prototype.remove = function(subject, property) {
    //init
    subject = resolveQName(this.prefixMapping, subject);
    property = resolveQName(this.prefixMapping, property);
    subject = subject ? this.appPrefix + subject: null;
    
    if(subject) {
      if(property) {/* remove the property */
        var props_str = this.st[subject];
        if(props_str) {
          var props = JSON.parse(props_str);
          delete props[property];
          this.st.setItem(subject, JSON.stringify(props));
        } else {
          throw Error("Not found " + subject + ":" + property);
        }
      } else {/* remove the subject */
        this.st.removeItem(subject);
      }
    } else {
      if(property) {/* remove all matched properties */
        for(var subject in this.st) {
          if(subject.substr(0, this.appPrefixLen) != this.appPrefix) {
            continue;
          }
          var props_str = this.st[subject];
          var props = JSON.parse(props_str);
          if(props[property]) {
            delete props[property];
            this.st.setItem(subject, JSON.stringify(props));
          }
        }
      } else {
        for(var key in this.st) {
          if(key.substr(0, this.appPrefixLen) == this.appPrefix) {
            this.st.removeItem(key);
          }
        }
      }
    }
  };
  /**
   * Retrieves a Projection given a subject
   * @method getProjection
   * @param subject {String} subject
   * @return {Projection} projection
   * @example
   *   st.getProjection("http://sample.org/bob");
   */
  Triplestore.prototype.getProjection = function(subject) {
    //init
    subject = resolveQName(this.prefixMapping, subject);
    subject = subject ? this.appPrefix + subject: null;
    
    var props_str = this.st[subject];
    var res = null;
    if(props_str) {
      var props = JSON.parse(props_str);
      res = new Projection(this, subject, props);
    }
    return res;
  };
  /**
   * Print the content of the storage.
   * @method show
   */
  Triplestore.prototype.show = function() {
    for(var i = 0; i < this.st.length; i++) {
      var subject = this.st.key(i);
      console.log(subject + ":" + this.st.getItem(subject));
    }
  };
  
  /**
   * <a href="http://www.w3.org/TR/rdfa-api/#projections">
   * Projection</a> class.
   * @class Projection
   * @private
   * @constructor
   */
  var Projection = function(store, subject, props) {
    this.store = store;
    this.st = store.st;
    this.prefixMapping = store.prefixMapping;
    this.subject = subject;
    this.props = props;
  };

  /**
   * Retrieves the list of properties that are available on
   * the Projection. Each property must be an absolute URI.
   * @method getProperties
   * @return {Array} sequence&lt;String>
   */
  Projection.prototype.getProperties = function(value) {
    //init
    value = resolveQName(this.prefixMapping, value);
    
    var res = [];
    for(var prop in this.props) {
      if(value) {
        if(this.props[prop] == value) {
          res.push(prop);
        }
      } else {
        res.push(prop);
      }
    }
    return res;
  };
  /**
   * Retrieves the subject URI of this Projection as a string,
   * the value must be an absolute URI.
   * @method getSubject
   * @return {String}
   */
  Projection.prototype.getSubject = function() {
    return this.subject.substr(this.store.appPrefixLen);
  };
  /**
   * Retrieves the first property with the given name as a
   * language-native datatype.
   * @method get
   * @param property {String} property
   * @return {String}
   * @example
   *   projection.get("foaf:name");
   */
  Projection.prototype.get = function(property) {
    var values = this.getAll(property);
    return values ? values[0] : null;
  };
  /**
   * Retrieves the list of values for a property as an array
   * of language-native datatypes.
   * @method getAll
   * @param property {String} The name of the property to retrieve
   * @return {Array} sequence&lt;String>
   * @example
   *   st.getAll("foaf:name");
   */
  Projection.prototype.getAll = function(property) {
    //init
    property = resolveQName(this.prefixMapping, property);
    
    if(property) {
      return this.props[property] ? this.props[property] : [];
    } else {
      var res = [];
      for(var prop in this.props) {
        res = res.concat(this.props[prop]);
      }
      return res;
    }
  };
  Projection.prototype.remove = function() {
    this.st.removeItem(this.subject);
  };
})();
