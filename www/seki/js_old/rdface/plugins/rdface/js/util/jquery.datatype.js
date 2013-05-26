/*
 * jQuery CURIE @VERSION
 *
 * Copyright (c) 2008,2009 Jeni Tennison
 * Licensed under the MIT (MIT-LICENSE.txt)
 *
 * Depends:
 *  jquery.uri.js
 */
/**
 * @fileOverview XML Schema datatype handling
 * @author <a href="mailto:jeni@jenitennison.com">Jeni Tennison</a>
 * @copyright (c) 2008,2009 Jeni Tennison
 * @license MIT license (MIT-LICENSE.txt)
 * @version 1.0
 * @requires jquery.uri.js
 */

(function ($) {

  var strip = function (value) {
    return value.replace(/[ \t\n\r]+/, ' ').replace(/^ +/, '').replace(/ +$/, '');
  };

  /**
   * Creates a new jQuery.typedValue object. This should be invoked as a method
   * rather than constructed using new.
   * @class Represents a value with an XML Schema datatype
   * @param {String} value The string representation of the value
   * @param {String} datatype The XML Schema datatype URI
   * @returns {jQuery.typedValue}
   * @example intValue = jQuery.typedValue('42', 'http://www.w3.org/2001/XMLSchema#integer');
   */
  $.typedValue = function (value, datatype) {
    return $.typedValue.fn.init(value, datatype);
  };

  $.typedValue.fn = $.typedValue.prototype = {
    /**
     * The string representation of the value
     * @memberOf jQuery.typedValue#
     */
    representation: undefined,
    /**
     * The value as an object. The type of the object will
     * depend on the XML Schema datatype URI specified
     * in the constructor. The following table lists the mappings
     * currently supported:
     * <table>
     *   <tr>
     *   <th>XML Schema Datatype</th>
     *   <th>Value type</th>
     *   </tr>
     *   <tr>
     *     <td>http://www.w3.org/2001/XMLSchema#string</td>
     *     <td>string</td>
     *   </tr>
     *   <tr>
     *     <td>http://www.w3.org/2001/XMLSchema#token</td>
     *     <td>string</td>
     *   </tr>
     *   <tr>
     *     <td>http://www.w3.org/2001/XMLSchema#NCName</td>
     *     <td>string</td>
     *   </tr>
     *   <tr>
     *     <td>http://www.w3.org/2001/XMLSchema#boolean</td>
     *     <td>bool</td>
     *   </tr>
     *   <tr>
     *     <td>http://www.w3.org/2001/XMLSchema#decimal</td>
     *     <td>string</td>
     *   </tr>
     *   <tr>
     *     <td>http://www.w3.org/2001/XMLSchema#integer</td>
     *     <td>int</td>
     *   </tr>
     *   <tr>
     *     <td>http://www.w3.org/2001/XMLSchema#int</td>
     *     <td>int</td>
     *   </tr>
     *   <tr>
     *     <td>http://www.w3.org/2001/XMLSchema#float</td>
     *     <td>float</td>
     *   </tr>
     *   <tr>
     *     <td>http://www.w3.org/2001/XMLSchema#double</td>
     *     <td>float</td>
     *   </tr>
     *   <tr>
     *     <td>http://www.w3.org/2001/XMLSchema#dateTime</td>
     *     <td>string</td>
     *   </tr>
     *   <tr>
     *     <td>http://www.w3.org/2001/XMLSchema#date</td>
     *     <td>string</td>
     *   </tr>
     *   <tr>
     *     <td>http://www.w3.org/2001/XMLSchema#gYear</td>
     *     <td>int</td>
     *   </tr>
     *   <tr>
     *     <td>http://www.w3.org/2001/XMLSchema#gMonthDay</td>
     *     <td>string</td>
     *   </tr>
     *   <tr>
     *     <td>http://www.w3.org/2001/XMLSchema#anyURI</td>
     *     <td>{@link jQuery.uri}</td>
     *   </tr>
     * </table>
     * @memberOf jQuery.typedValue#
     */
    value: undefined,
    /**
     * The XML Schema datatype URI for the value's datatype
     * @memberOf jQuery.typedValue#
     */
    datatype: undefined,

    init: function (value, datatype) {
      var d = $.typedValue.types[datatype];
      if ($.typedValue.valid(value, datatype)) {
        this.representation = value;
        this.datatype = datatype;
        this.value = d === undefined ? strip(value) : d.value(d.strip ? strip(value) : value);
        return this;
      } else {
        throw {
          name: 'InvalidValue',
          message: value + ' is not a valid ' + datatype + ' value'
        };
      }
    }
  };

  $.typedValue.fn.init.prototype = $.typedValue.fn;

  /**
   * An object that holds the datatypes supported by the script. The properties of this object are the URIs of the datatypes, and each datatype has four properties:
   * <dl>
   *   <dt>strip</dt>
   *   <dd>A boolean value that indicates whether whitespace should be stripped from the value prior to testing against the regular expression or passing to the value function.</dd>
   *   <dt>regex</dt>
   *   <dd>A regular expression that valid values of the type must match.</dd>
   *   <dt>validate</dt>
   *   <dd>Optional. A function that performs further testing on the value.</dd>
   *   <dt>value</dt>
   *   <dd>A function that returns a Javascript object equivalent for the value.</dd>
   * </dl>
   * You can add to this object as necessary for your own datatypes, and {@link jQuery.typedValue} and {@link jQuery.typedValue.valid} will work with them.
   * @see jQuery.typedValue
   * @see jQuery.typedValue.valid
   */
  $.typedValue.types = {};

  $.typedValue.types['http://www.w3.org/2001/XMLSchema#string'] = {
    regex: /^.*$/,
    strip: false,
    /** @ignore */
    value: function (v) {
      return v;
    }
  };

  $.typedValue.types['http://www.w3.org/2001/XMLSchema#token'] = {
    regex: /^.*$/,
    strip: true,
    /** @ignore */
    value: function (v) {
      return strip(v);
    }
  };

  $.typedValue.types['http://www.w3.org/2001/XMLSchema#NCName'] = {
    regex: /^[a-z_][-\.a-z0-9]+$/i,
    strip: true,
    /** @ignore */
    value: function (v) {
      return strip(v);
    }
  };

  $.typedValue.types['http://www.w3.org/2001/XMLSchema#boolean'] = {
    regex: /^(?:true|false|1|0)$/,
    strip: true,
    /** @ignore */
    value: function (v) {
      return v === 'true' || v === '1';
    }
  };

  $.typedValue.types['http://www.w3.org/2001/XMLSchema#decimal'] = {
    regex: /^[\-\+]?(?:[0-9]+\.[0-9]*|\.[0-9]+|[0-9]+)$/,
    strip: true,
    /** @ignore */
    value: function (v) {
      v = v.replace(/^0+/, '')
        .replace(/0+$/, '');
      if (v === '') {
        v = '0.0';
      }
      if (v.substring(0, 1) === '.') {
        v = '0' + v;
      }
      if (/\.$/.test(v)) {
        v = v + '0';
      } else if (!/\./.test(v)) {
        v = v + '.0';
      }
      return v;
    }
  };

  $.typedValue.types['http://www.w3.org/2001/XMLSchema#integer'] = {
    regex: /^[\-\+]?[0-9]+$/,
    strip: true,
    /** @ignore */
    value: function (v) {
      return parseInt(v, 10);
    }
  };

  $.typedValue.types['http://www.w3.org/2001/XMLSchema#int'] = {
    regex: /^[\-\+]?[0-9]+$/,
    strip: true,
    /** @ignore */
    value: function (v) {
      return parseInt(v, 10);
    }
  };

  $.typedValue.types['http://www.w3.org/2001/XMLSchema#float'] = {
    regex: /^(?:[\-\+]?(?:[0-9]+\.[0-9]*|\.[0-9]+|[0-9]+)(?:[eE][\-\+]?[0-9]+)?|[\-\+]?INF|NaN)$/,
    strip: true,
    /** @ignore */
    value: function (v) {
      if (v === '-INF') {
        return -1 / 0;
      } else if (v === 'INF' || v === '+INF') {
        return 1 / 0;
      } else {
        return parseFloat(v);
      }
    }
  };

  $.typedValue.types['http://www.w3.org/2001/XMLSchema#double'] = {
    regex: $.typedValue.types['http://www.w3.org/2001/XMLSchema#float'].regex,
    strip: true,
    value: $.typedValue.types['http://www.w3.org/2001/XMLSchema#float'].value
  };

  $.typedValue.types['http://www.w3.org/2001/XMLSchema#duration'] = {
    regex: /^([\-\+])?P(?:([0-9]+)Y)?(?:([0-9]+)M)?(?:([0-9]+)D)?(?:T(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+(?:\.[0-9]+)?)?S)?)$/,
    /** @ignore */
    validate: function (v) {
      var m = this.regex.exec(v);
      return m[2] || m[3] || m[4] || m[5] || m[6] || m[7];
    },
    strip: true,
    /** @ignore */
    value: function (v) {
      return v;
    }
  };

  $.typedValue.types['http://www.w3.org/2001/XMLSchema#yearMonthDuration'] = {
    regex: /^([\-\+])?P(?:([0-9]+)Y)?(?:([0-9]+)M)?$/,
    /** @ignore */
    validate: function (v) {
      var m = this.regex.exec(v);
      return m[2] || m[3];
    },
    strip: true,
    /** @ignore */
    value: function (v) {
      var m = this.regex.exec(v),
        years = m[2] || 0,
        months = m[3] || 0;
      months += years * 12;
      return m[1] === '-' ? -1 * months : months;
    }
  };

  $.typedValue.types['http://www.w3.org/2001/XMLSchema#dateTime'] = {
    regex: /^(-?[0-9]{4,})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):(([0-9]{2})(\.([0-9]+))?)((?:[\-\+]([0-9]{2}):([0-9]{2}))|Z)?$/,
    /** @ignore */
    validate: function (v) {
      var
        m = this.regex.exec(v),
        year = parseInt(m[1], 10),
        tz = m[10] === undefined || m[10] === 'Z' ? '+0000' : m[10].replace(/:/, ''),
        date;
      if (year === 0 ||
          parseInt(tz, 10) < -1400 || parseInt(tz, 10) > 1400) {
        return false;
      }
      try {
        year = year < 100 ? Math.abs(year) + 1000 : year;
        month = parseInt(m[2], 10);
        day = parseInt(m[3], 10);
        if (day > 31) {
          return false;
        } else if (day > 30 && !(month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12)) {
          return false;
        } else if (month === 2) {
          if (day > 29) {
            return false;
          } else if (day === 29 && (year % 4 !== 0 || (year % 100 === 0 && year % 400 !== 0))) {
            return false;
          }
        }
        date = '' + year + '/' + m[2] + '/' + m[3] + ' ' + m[4] + ':' + m[5] + ':' + m[7] + ' ' + tz;
        date = new Date(date);
        return true;
      } catch (e) {
        return false;
      }
    },
    strip: true,
    /** @ignore */
    value: function (v) {
      return v;
    }
  };

  $.typedValue.types['http://www.w3.org/2001/XMLSchema#date'] = {
    regex: /^(-?[0-9]{4,})-([0-9]{2})-([0-9]{2})((?:[\-\+]([0-9]{2}):([0-9]{2}))|Z)?$/,
    /** @ignore */
    validate: function (v) {
      var
        m = this.regex.exec(v),
        year = parseInt(m[1], 10),
        month = parseInt(m[2], 10),
        day = parseInt(m[3], 10),
        tz = m[10] === undefined || m[10] === 'Z' ? '+0000' : m[10].replace(/:/, '');
      if (year === 0 ||
          month > 12 ||
          day > 31 ||
          parseInt(tz, 10) < -1400 || parseInt(tz, 10) > 1400) {
        return false;
      } else {
        return true;
      }
    },
    strip: true,
    /** @ignore */
    value: function (v) {
      return v;
    }
  };

  $.typedValue.types['http://www.w3.org/2001/XMLSchema#gYear'] = {
    regex: /^-?([0-9]{4,})$/,
    /** @ignore */
    validate: function (v) {
      var i = parseInt(v, 10);
      return i !== 0;
    },
    strip: true,
    /** @ignore */
    value: function (v) {
      return parseInt(v, 10);
    }
  };

  $.typedValue.types['http://www.w3.org/2001/XMLSchema#gMonthDay'] = {
    regex: /^--([0-9]{2})-([0-9]{2})((?:[\-\+]([0-9]{2}):([0-9]{2}))|Z)?$/,
    /** @ignore */
    validate: function (v) {
      var
        m = this.regex.exec(v),
        month = parseInt(m[1], 10),
        day = parseInt(m[2], 10),
        tz = m[3] === undefined || m[3] === 'Z' ? '+0000' : m[3].replace(/:/, '');
      if (month > 12 ||
          day > 31 ||
          parseInt(tz, 10) < -1400 || parseInt(tz, 10) > 1400) {
        return false;
      } else if (month === 2 && day > 29) {
        return false;
      } else if ((month === 4 || month === 6 || month === 9 || month === 11) && day > 30) {
        return false;
      } else {
        return true;
      }
    },
    strip: true,
    /** @ignore */
    value: function (v) {
      return v;
    }
  };

  $.typedValue.types['http://www.w3.org/2001/XMLSchema#anyURI'] = {
    regex: /^.*$/,
    strip: true,
    /** @ignore */
    value: function (v, options) {
      var opts = $.extend({}, $.typedValue.defaults, options);
      return $.uri.resolve(v, opts.base);
    }
  };

  $.typedValue.defaults = {
    base: $.uri.base(),
    namespaces: {}
  };

  /**
   * Checks whether a value is valid according to a given datatype. The datatype must be held in the {@link jQuery.typedValue.types} object.
   * @param {String} value The value to validate.
   * @param {String} datatype The URI for the datatype against which the value will be validated.
   * @returns {boolean} True if the value is valid or the datatype is not recognised.
   * @example validDate = $.typedValue.valid(date, 'http://www.w3.org/2001/XMLSchema#date');
   */
  $.typedValue.valid = function (value, datatype) {
    var d = $.typedValue.types[datatype];
    if (d === undefined) {
      return true;
    } else {
      value = d.strip ? strip(value) : value;
      if (d.regex.test(value)) {
        return d.validate === undefined ? true : d.validate(value);
      } else {
        return false;
      }
    }
  };

})(jQuery);
