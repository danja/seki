/*
 * 
<http://hyperdata.org/trellis/nid-2011-11-11-17-46-54-255-0000> a ts:RootNode . 
<http://hyperdata.org/trellis/nid-2011-11-11-17-46-54-255-0369> a ts:Node; 
dc:title "Add priority number to each line 1-5" ; 
dc:created "2013-12-04T08:46:01Z" ; 
ts:index "0" ; 
ts:parent <http://hyperdata.org/trellis/nid-2011-11-11-17-46-54-255-0000> .
*/

var fs = require("fs");
var util = require("util");
var path = require("path");
var sax = require("sax");
var parser = sax.createStream(false);
var config = require('../config/ConfigDefault').config;
var Nog = require('../lib/nog/nog'),
    log = new Nog(config.logLevel);

if (!process.argv[2]) {
    throw new Error("Please provide an xml file to prettify\n" +
        "TODO: read from stdin or take a file");
}
var xmlfile = require("path").join(process.cwd(), process.argv[2]);

var fstr = fs.createReadStream(xmlfile, {
    encoding: "utf8"
});

var converter = new Opml2Turtle();
// log.debug( util.inspect(converter));
converter.convert(fstr);

function Opml2Turtle() {

    this.convert = function(fstr) {
        fstr.pipe(parser);
    }

    print("@prefix dc: <http://purl.org/dc/terms/> . \n");
    print("@prefix ts: <http://hyperdata.org/trellis/> . \n\n");


    function entity(str) {
        return str.replace('"', '&quot;');
    }

    parser.level = 0;
    parser.nodeStack = new Array();
    parser.index = 0;
    parser.previousIndex = 0;

    parser.on("opentag", function(tag) {
        if (tag.name == "BODY") {
            var root = "<" + config.uriBase + "/trellis/" + generateID() + ">";
            this.nodeStack.push({"node":root, "index":0});
            print(root + " a ts:RootNode . \n");
        }
        if (tag.name == "OUTLINE") {
            if(this.previousLevel == this.level) {
            //    this.nodeStack.pop();
                this.index++;
            }
            this.level++;
            this.previousLevel = this.level;
            var node = "<" + config.uriBase + "/trellis/" + generateID() + ">";
           
            
            var text = tag.attributes["text"] ? tag.attributes["text"] : "";
          //  print('current = ' +this.currentText+"\n");
            
            print("\n"+node + " a ts:Node; \n");
            print("   dc:title \"" + trim(text) + "\" ; \n");
            //        print("   dc:created \"" + generateDate() + "\" ; \n");
            print("   ts:index \"" + this.index + "\" ; \n");
                var parent =  this.nodeStack[this.nodeStack.length - 1];
            print("   ts:parent \"" + parent.node  + "\" . \n");
            this.nodeStack.push({"node":node, "index":this.index});
        }
        // print('' + this.level);   
    })

    parser.on("text", ontext)
    parser.on("doctype", ontext)

    function ontext(text) {
    }

    parser.on("closetag", function(tag) {
        if (tag == "OUTLINE") {
          //  print(this.previousLevel + "  "+ this.level + "\n");
            
            if(this.previousLevel >= this.level) {
             //   print("pop\n");
                this.nodeStack.pop();
                this.index = 0;
            }
            this.level--;
         

        }
    })

    parser.on("cdata", function(data) {

        print("<![CDATA[" + data + "]]>")
    })

    parser.on("comment", function(comment) {

        print("<!--" + comment + "-->")
    })

    parser.on("error", function(error) {
        console.error(error)
        throw error
    })



    function print(c) {
        if (!process.stdout.write(c)) {
            fstr.pause()
        }
    }

    process.stdout.on("drain", function() {
        fstr.resume()
    })


}
module.exports = Opml2Turtle;


// TODO MOVE this lot ////////////////////////////////////////////////////////////////////////////////////////////////////
function trim(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

var generateID = function() {
    // isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"

    var r = '' + Math.floor((Math.random() * 10000));
    var pad = "0000";
    var rnd = (pad + r).slice(-pad.length);
    var now = new Date();
    return "nid-" + dateFormat(now, "UTC:yyyy-mm-dd-HH-MM-ss-l") + "-" + rnd;
};

var generateDate = function() {
    // isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    var now = new Date();
    return now.format("isoUtcDateTime");
};

var dateFormat = function() {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function(val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function(date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d: d,
                dd: pad(d),
                ddd: dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m: m + 1,
                mm: pad(m + 1),
                mmm: dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy: String(y).slice(2),
                yyyy: y,
                h: H % 12 || 12,
                hh: pad(H % 12 || 12),
                H: H,
                HH: pad(H),
                M: M,
                MM: pad(M),
                s: s,
                ss: pad(s),
                l: pad(L, 3),
                L: pad(L > 99 ? Math.round(L / 10) : L),
                t: H < 12 ? "a" : "p",
                tt: H < 12 ? "am" : "pm",
                T: H < 12 ? "A" : "P",
                TT: H < 12 ? "AM" : "PM",
                Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function(mask, utc) {
    return dateFormat(this, mask, utc);
};
