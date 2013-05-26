/*
 * jQuery RDF Rules @VERSION
 * 
 * Copyright (c) 2008 Jeni Tennison
 * Licensed under the MIT (MIT-LICENSE.txt)
 *
 * Depends:
 *  jquery.uri.js
 *  jquery.xmlns.js
 *  jquery.datatype.js
 *  jquery.curie.js
 *  jquery.rdf.js
 */
/**
 * @fileOverview jQuery RDF Rules
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
    blankNodeNum = 1;

  /**
   * <p>Creates a new jQuery.rdf.ruleset object. This should be invoked as a method rather than constructed using new.</p>
   * @class A jQuery.rdf.ruleset object represents a set of {@link jQuery.rdf.rule}s that can be run over a databank.
   * @param {jQuery.rdf.rule[]} [rules=[]] An array of rules with which the ruleset is initialised.
   * @param {Object} [options] Initialisation options for the ruleset.
   * @param {Object} [options.namespaces] An object representing a set of namespace bindings which are stored and used whenever a CURIE is used within a rule.
   * @param {String|jQuery.uri} [options.base] The base URI used to interpret any relative URIs used within the rules.
   * @returns {jQuery.rdf.ruleset}
   * @example rules = jQuery.rdf.ruleset();
   * @see jQuery.rdf.rule
   */
  $.rdf.ruleset = function (rules, options) {
    return new $.rdf.ruleset.fn.init(rules, options);
  };

  $.rdf.ruleset.fn = $.rdf.ruleset.prototype = {
    init: function (rules, options) {
      var i,
        opts = $.extend({}, $.rdf.ruleset.defaults, options);
      rules = rules || [];
      this.baseURI = opts.base;
      this.namespaces = $.extend({}, opts.namespaces);
      this.rules = [];
      for (i = 0; i < rules.length; i += 1) {
        this.add.apply(this, rules[i]);
      }
      return this;
    },
    
    /**
     * Sets or returns the base URI of the {@link jQuery.rdf.ruleset}.
     * @param {String|jQuery.uri} [base]
     * @returns A {@link jQuery.uri} if no base URI is specified, otherwise returns this {@link jQuery.rdf.ruleset} object.
     * @example 
     * rules = $.rdf.ruleset()
     *   .base('http://www.example.org/');
     */
    base: function (uri) {
      if (uri === undefined) {
        return this.baseURI;
      } else {
        this.baseURI = uri;
        return this;
      }
    },
    
    /**
     * Sets or returns a namespace binding on the {@link jQuery.rdf.ruleset}.
     * @param {String} [prefix]
     * @param {String} [namespace]
     * @returns {Object|jQuery.uri|jQuery.rdf} If no prefix or namespace is specified, returns an object providing all namespace bindings on the {@link jQuery.rdf.ruleset}. If a prefix is specified without a namespace, returns the {@link jQuery.uri} associated with that prefix. Otherwise returns this {@link jQuery.rdf} object after setting the namespace binding.
     */
    prefix: function (prefix, uri) {
      if (prefix === undefined) {
        return this.namespaces;
      } else if (uri === undefined) {
        return this.namespaces[prefix];
      } else {
        this.namespaces[prefix] = uri;
        return this;
      }
    },
    
    /**
     * Returns the number of rules in this ruleset.
     * @returns {Integer}
     */
    size: function () {
      return this.rules.length;
    },
    
    /**
     * Adds a rule or set of rules to this ruleset.
     * @param {String|Array|Function|jQuery.rdf.pattern|jQuery.rdf.rule|jQuery.rdf.ruleset} lhs A {@link jQuery.rdf.rule} will be added directly. If a {@link jQuery.rdf.ruleset} is provided then all its rules will be added to this one. Otherwise, specifies the left hand side of the rule to be added, as in {@link jQuery.rdf.rule}.
     * @param {String|Function|jQuery.rdf.pattern} rhs The right hand side of the rule to be added.
     * @returns {jQuery.rdf.ruleset} Returns this {@link jQuery.rdf.ruleset}
     * @see jQuery.rdf.rule
     * @example
     * rules = $.rdf.ruleset()
     *   .prefix('foaf', ns.foaf)
     *   .add('?person a foaf:Person', '?person a foaf:Agent');
     */
    add: function (lhs, rhs) {
      var rule;
      if (rhs === undefined && lhs.rules) {
        this.rules = this.rules.concat(lhs.rules);
      } else {
        if (rhs === undefined && lhs.lhs) {
          rule = lhs;
        } else {
          rule = $.rdf.rule(lhs, rhs, { namespaces: this.prefix(), base: this.base() });
        }
        if ($.inArray(rule, this.rules) === -1) {
          this.rules.push(rule);
        }
      }
      return this;
    },
    
    /**
     * Runs the rules held in this ruleset on the data passed as the first argument.
     * @param {jQuery.rdf.databank} data A databank containing data to be reasoned over and added to.
     * @param {Object} [options]
     * @param {Integer} [options.limit=50] The rules in this ruleset are generally run over the {@link jQuery.rdf.databank} until it stops growing. In some situations, notably when creating blank nodes, this can lead to an infinite loop. The limit option indicates the maximum number of times the ruleset will be run before halting.
     * @returns {jQuery.rdf.ruleset} Returns this ruleset.
     * @example
     * rules = $.rdf.ruleset()
     *   .prefix('foaf', ns.foaf)
     *   .add('?person a foaf:Person', '?person a foaf:Agent')
     *   .run(data);
     * @see jQuery.rdf#reason
     * @see jQuery.rdf.databank#reason
     */
    run: function (data, options) {
      var i, r, ntriples,
        opts = $.extend({ limit: 50 }, options),
        limit = opts.limit;
      do {
        ntriples = data.size();
        for (i = 0; i < this.rules.length; i += 1) {
          r = this.rules[i];
          r.run(data);
        }
        limit -= 1;
      } while (data.size() > ntriples && limit > 0);
      return this;
    }
  };
  
  $.rdf.ruleset.fn.init.prototype = $.rdf.ruleset.fn;
  
  $.rdf.ruleset.defaults = {
    base: $.uri.base(),
    namespaces: {}
  };

/* Rules */

  /**
   * <p>Creates a new jQuery.rdf.rule object. This should be invoked as a method rather than constructed using new.</p>
   * @class A jQuery.rdf.rule object represents a rule that can be run over a {@link jQuery.rdf.databank}.
   * @param {Object[]} lhs The left-hand side of the rule. This can be an array containing multiple conditions, or a single condition on its own. Each condition is one of:
   * <ul>
   *   <li>A {@link jQuery.rdf.pattern} or a string which is interpreted as a {@link jQuery.rdf.pattern}, which is used to match triples as with the {@link jQuery.rdf#where} method.</li>
   *   <li>A function which must return true for the rule to be satisfied. The arguments for the function are as described in the documentation for {@link jQuery.rdf#filter}.</li>
   *   <li>An array of two items: a variable name and either a regular expression or a value that it matches against (as used in the two arguments to {@link jQuery.rdf#filter}).</li>
   * </ul>
   * @param {Function|String[]} rhs The right-hand side of the rule. This can be an array of strings which are interpreted as patterns and used to create new triples when the rule is fired. If the patterns contain references to blank nodes, new blank nodes are created each time the rule is fired. Alternatively, it can be a function which is executed when the rule is fired. The function needs to have the same signature as that used for {@link jQuery.rdf#map}.
   * @param {Object} [options] Initialisation options for the rules.
   * @param {Object} [options.namespaces] An object representing a set of namespace bindings which are stored and used whenever a CURIE is used within the left or right-hand sides of the rule.
   * @param {String|jQuery.uri} [options.base] The base URI used to interpret any relative URIs used within the rule.
   * @returns {jQuery.rdf.rule}
   * @example $.rdf.rule('?person a foaf:Person', '?person a foaf:Agent', { namespaces: ns });
   * @example
   * var rule = $.rdf.rule(
   *   ['?person a vcard:VCard',
   *    '?person vcard:fn ?name'],
   *   ['?person a foaf:Person',
   *    '?person foaf:name ?name'],
   *   { namespaces: ns }
   * );
   * @example
   * var rule = $.rdf.rule(
   *   ['?person a foaf:Person',
   *    '?person foaf:firstName ?fn'],
   *   ['?person a vcard:VCard',
   *    '?person vcard:n _:name',
   *    '_:name a vcard:Name', 
   *    '_:name vcard:given-name ?fn'],
   *   { namespaces: ns }
   * );
   * @example
   * var rule = $.rdf.rule(
   *   ['?person foaf:name ?name', 
   *    ['name', /^J.+/]], 
   *  function () { name = this.name }, 
   *  { namespaces: ns });
   * @see jQuery.rdf.rule
   */
  $.rdf.rule = function (lhs, rhs, options) {
    return new $.rdf.rule.fn.init(lhs, rhs, options);
  };

  $.rdf.rule.fn = $.rdf.rule.prototype = {
    init: function (lhs, rhs, options) {
      var opts = $.extend({}, $.rdf.rule.defaults, options),
        lhsWildcards = [], rhsBlanks = false;
      if (typeof lhs === 'string') {
        lhs = [lhs];
      }
      if (typeof rhs === 'string') {
        rhs = [rhs];
      }
      this.lhs = $.map(lhs, function (p) {
        if ($.isArray(p)) {
          return [p];
        } else if ($.isFunction(p)) {
          return p;
        } else {
          p = $.rdf.pattern(p, opts);
          if (typeof p.subject === 'string') {
            lhsWildcards.push(p.subject);
          }
          if (typeof p.property === 'string') {
            lhsWildcards.push(p.property);
          }
          if (typeof p.object === 'string') {
            lhsWildcards.push(p.object);
          }
          return p;
        }
      });
      lhsWildcards = $.unique(lhsWildcards);
      if ($.isFunction(rhs)) {
        this.rhs = rhs;
      } else {
        this.rhs = $.map(rhs, function (p) {
          p = $.rdf.pattern(p, opts);
          if ((typeof p.subject === 'string' && $.inArray(p.subject, lhsWildcards) === -1) ||
              (typeof p.property === 'string' && $.inArray(p.property, lhsWildcards) === -1) ||
              (typeof p.object === 'string' && $.inArray(p.object, lhsWildcards) === -1)) {
            throw "Bad Rule: Right-hand side of the rule contains a reference to an unbound wildcard";
          } else if (p.subject.type === 'bnode' || p.property.type === 'bnode' || p.object.type === 'bnode') {
            rhsBlanks = true;
          }
          return p;
        });
      }
      this.rhsBlanks = rhsBlanks;
      this.cache = {};
      return this;
    },
    
    /**
     * Runs the rule on the data passed as the first argument.
     * @param {jQuery.rdf.databank} data A databank containing data to be reasoned over and added to.
     * @param {Object} [options]
     * @param {Integer} [options.limit=50] The rule isArray generally run over the {@link jQuery.rdf.databank} until it stops growing. In some situations, notably when creating blank nodes, this can lead to an infinite loop. The limit option indicates the maximum number of times the rule will be run before halting.
     * @returns {jQuery.rdf.rule} Returns this rule.
     * @example
     * $.rdf.rule('?person a foaf:Person', '?person a foaf:Agent', { namespaces: ns })
     *   .run(data);
     * @see jQuery.rdf.ruleset#run
     * @see jQuery.rdf#reason
     * @see jQuery.rdf.databank#reason
     */
    run: function (data, options) {
      var query = $.rdf({ databank: data }), 
        condition,
        opts = $.extend({ limit: 50 }, options), limit = opts.limit,
        ntriples,
        i, j, pattern, s, p, o, q,
        blanks = this.rhsBlanks,
        cache, sources, triples, add;
      if (this.cache[data.id] === undefined) {
        this.cache[data.id] = {};
      }
      for (i = 0; i < this.lhs.length; i += 1) {
        condition = this.lhs[i];
        if ($.isArray(condition)) {
          query = query.filter.apply(query, condition);
        } else if ($.isFunction(condition)) {
          query = query.filter.call(query, condition);
        } else {
          query = query.where(this.lhs[i]);
        }
      }
      do {
        ntriples = query.length;
        sources = query.sources();
        for (i = 0; i < ntriples; i += 1) {
          triples = sources[i];
          add = true;
          cache = this.cache[data.id];
          for (j = 0; j < triples.length; j += 1) {
            if (cache[triples[j]] === undefined) {
              cache[triples[j]] = {};
            } else if (j === triples.length - 1) {
              add = false;
            }
            cache = cache[triples[j]];
          }
          if (add) {
            q = query.eq(i);
            if (blanks) {
              for (j = 0; j < this.rhs.length; j += 1) {
                pattern = this.rhs[j];
                s = pattern.subject;
                p = pattern.property;
                o = pattern.object;
                if (s.type === 'bnode') {
                  s = $.rdf.blank('' + s + blankNodeNum);
                }
                if (p.type === 'bnode') {
                  p = $.rdf.blank('' + p + blankNodeNum);
                }
                if (o.type === 'bnode') {
                  o = $.rdf.blank('' + o + blankNodeNum);
                }
                pattern = $.rdf.pattern(s, p, o);
                q.add(pattern);
              }
              blankNodeNum += 1;
            } else if ($.isFunction(this.rhs)) {
              q.map(this.rhs);
            } else {
              for (j = 0; j < this.rhs.length; j += 1) {
                q.add(this.rhs[j]);
              }
            }
          }
        }
        limit -= 1;
      } while (query.length > ntriples && limit > 0);
      return this;
    }
  };

  $.rdf.rule.fn.init.prototype = $.rdf.rule.fn;

  $.rdf.rule.defaults = {
    base: $.uri.base(),
    namespaces: {}
  };

  $.extend($.rdf.databank.fn, {
    /**
     * @methodOf jQuery.rdf.databank#
     * @name jQuery.rdf.databank#reason
     * @description Reasons over this databank using the {@link jQuery.rdf.rule} or {@link jQuery.rdf.ruleset} given as the first argument.
     * @param {jQuery.rdf.rule|jQuery.rdf.ruleset} rules The rules to run over the databank.
     * @param {Object} [options]
     * @param {Integer} [options.limit=50] The rules in this ruleset are generally run over the {@link jQuery.rdf.databank} until it stops growing. In some situations, notably when creating blank nodes, this can lead to an infinite loop. The limit option indicates the maximum number of times the ruleset will be run before halting.
     * @returns {jQuery.rdf.databank} The original {@link jQuery.rdf.databank}, although it may now contain more triples.
     * @see jQuery.rdf.ruleset#run
     * @see jQuery.rdf.rule#run
     */
    reason: function (rule, options) {
      rule.run(this, options);
      return this;
    }
  });
  
  $.extend($.rdf.fn, {
    /**
     * @methodOf jQuery.rdf#
     * @name jQuery.rdf#reason
     * @description Reasons over the {@link jQuery.rdf#databank} associated with this {@link jQuery.rdf} object using the {@link jQuery.rdf.rule} or {@link jQuery.rdf.ruleset} given as the first argument.
     * @param {jQuery.rdf.rule|jQuery.rdf.ruleset} rules The rules to run over the databank.
     * @param {Object} [options]
     * @param {Integer} [options.limit=50] The rules in this ruleset are generally run over the {@link jQuery.rdf.databank} until it stops growing. In some situations, notably when creating blank nodes, this can lead to an infinite loop. The limit option indicates the maximum number of times the ruleset will be run before halting.
     * @returns {jQuery.rdf} The original {@link jQuery.rdf} object, although it may now contain more matches because of the new triples added to its underlying databank.
     * @see jQuery.rdf.ruleset#run
     * @see jQuery.rdf.rule#run
     */
    reason: function (rule, options) {
      rule.run(this.databank, options);
      return this;
    }
  });

})(jQuery);
