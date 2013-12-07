var fs = require('fs');

// ./dump_2012-03-26.txt   ./input-1.txt
fs.readFile('../workflowy_2013-12-07.txt', 'utf8', function(err, data) { // _2013-12-07
    if (err)
        throw err;
    var result = workflowy2turtle(data, "http://hyperdata.org/trellis/workflowy/");
    fs.writeFile('../workflowy.ttl', result, 'utf8');
    console.log("\n\n\n");
    console.log(result);
    // console.log(data);

});


function workflowy2turtle(source, baseURI) {

    var turtle = "@prefix dc: <http://purl.org/dc/terms/> . \n";
    turtle += "@prefix ts: <http://hyperdata.org/trellis/> . \n\n";

    var inText = false;
    var indent = 0;
    var previousIndent = 0;
    var previous = "";
    var previousIndex = "";

    var stack = new Array();
    var text = "";
    var rootID = baseURI + "root-" + generateID();
    turtle += "<" + rootID + "> a ts:RootNode . \n";
    var index = -1;
    var nid = ""

    stack.push({
        "nid": rootID,
        "index": 0
    });
    stack.push({
        "nid": rootID,
        "index": 0
    }); // dummies - bug somewhere!
    stack.push({
        "nid": rootID,
        "index": 0
    });
    for (var i = 0; i < source.length; i++) {
        var char = source.charAt(i);

        if (!inText && char != "-" && char == " ") {
            indent += .5;
            continue;
        }

        if (!inText && char == "-") {
            // indent++;
            inText = true;
            continue;
        }

        if (inText && char != "\n" && char != "\r") {
            text += escape(char);
        }
        if (inText && (char == "\n" || char == "\r")) { // read line

            inText = false;

            var diff = indent - previousIndent;

            // console.log("diff = " + diff);

            if (diff == 0) {
                index++;
            }
            if (diff > 0) {
                stack.push({
                    "nid": previous,
                    "index": previousIndex
                });
                index = 0;
            }

            if (diff < 0) {
                // index = 0;
                for (var j = diff; j < 0; j++) {
                    var p = stack.pop();
                    console.log(p);
                    index = p.index;
                }
                index++;
            }
            nid = baseURI + generateID();

            console.log("node " + text + "   parent " + stack[stack.length - 1]);

            turtle += "<" + nid + "> a ts:Node; \n";
            turtle += "   dc:title \"" + trim(text) + "\" ; \n";
            turtle += "   dc:created \"" + generateDate() + "\" ; \n";
            turtle += "   ts:index \"" + index + "\" ; \n";
            turtle += "   ts:parent <" + stack[stack.length - 1].nid + "> .";
            turtle += "\n";

            previous = nid;
            previousIndex = index;
            previousIndent = indent;
            indent = 0;
            text = "";
            continue;
        }

    }
    return turtle;
}

function escape(char) {
    //   if(char == "<") return "&lt;";
    //   if(char == ">") return "&gt;";
    //   if(char == "&") return "&amp;"; 
    if (char == "\"") return "'";
    //    if(char == "'") return "&apos;";
    return char;
}

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
