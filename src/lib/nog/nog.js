/*!
 * Minimal node.js logger for Northmen
 *
 * Danny Ayers 2013
 *
 * originally derived from Log.js Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT License
 */

/**
 * Module dependencies.
 */

var format = require('util').format;
var EventEmitter = require('events').EventEmitter;

// **************************************************8
// REMEMBER JSON.stringify
/// and easy log to file

var defaultOptions = {
    "marker" : " \u001b[31;1m"+"o"+"\u001b[0m ", // start of line 
    "color" : true,
    "date": false,
    "filename" : true,
    "line_column" : true,
    "level" : false
};

/**
 * Initialize a `Logger` with the given log `level` defaulting
 * to __DEBUG__ and `stream` defaulting to _stdout_.
 *
 * @param {Number} level
 * @param {Object} stream
 * @api public
 */
var Nog = exports = module.exports = function Nog(level, options, stream) {
    
    this.levels = ["DEBUG", "INFO", "WARN", "ERROR"];
    
    // see http://en.wikipedia.org/wiki/ANSI_escape_code#Colors
    this.colors = {
        "reset" : "\u001b[0m",
        "Black" : "\u001b[30m",
        "Maroon" : "\u001b[31m",
        "DarkGreen" : "\u001b[32m",
        "Olive" : "\u001b[33m",
        "DarkBlue" : "\u001b[34m",
        "Purple" : "\u001b[35m",
        "Teal" : "\u001b[36m",
        "Grey" : "\u001b[37m",
        
        "DarkGrey" : "\u001b[31;0m",
        "Red" : "\u001b[31;1m",
        "Green" : "\u001b[32;1m",
        "Yellow" : "\u001b[33;1m",
        "Blue" : "\u001b[34;1m",
        "Magenta" : "\u001b[35;1m",
        "Cyan" : "\u001b[36;1m",
        "White" : "\u001b[37;1m"
    }
    
    this.levelColors = {
        "DEBUG" : "\u001b[37;1m",
        "INFO" : "\u001b[37m",
        "WARN" : "\u001b[35;1m",
        "ERROR" : "\u001b[31;1m"
    }
  
    /*
    if(level) {
        this.level = level;
    for(var i=0;i<levels.length;i++){
        if(level == levels[i]){
            this.levelN = i;
        }
    }
    } else {
        this.level = "DEBUG";
        this.levelN = 0;
    }
    */
    if ('string' == typeof level) level = exports[level.toUpperCase()];
    this.level = isFinite(level) ? level : this.DEBUG;
    // this.stream = stream || process.stdout;
    
    if(stream) { 
        this.stream = stream;
        options.color = false;
    } else {
        this.stream = process.stdout;
    }
        
    if (this.stream.readable) this.read();
    this.options = options ? options : defaultOptions;
    
    if(this.options.marker == "eye"){
        this.options.marker = this.colors.Red+"("+this.colors.Green+"o"+this.colors.Red+")"+this.colors.reset+" ";
    }
};



/**
 * System is unusable.
 *
 * @type Number
 */

exports.EMERGENCY = 0;

/**
 * Action must be taken immediately.
 *
 * @type Number
 */

exports.ALERT = 1;

/**
 * Critical condition.
 *
 * @type Number
 */

exports.CRITICAL = 2;

/**
 * Error condition.
 *
 * @type Number
 */

exports.ERROR = 3;

/**
 * Warning condition.
 *
 * @type Number
 */

exports.WARN = 4;

/**
 * Normal but significant condition.
 *
 * @type Number
 */

exports.NOTICE = 5;

/**
 * Purely informational message.
 *
 * @type Number
 */

exports.INFO = 6;

/**
 * Application debug messages.
 *
 * @type Number
 */

exports.DEBUG = 7;

/* 
 * expose stack details 
 * 
 * see https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi#Customizing_stack_traces
 */
Object.defineProperty(global, '__stack', {
    get: function() {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function(_, stack) {
            return stack;
        };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});

/**
 * prototype.
 */
Nog.prototype = {

    /**
     * Start emitting "line" events.
     *
     * @api public
     */

    read: function() {
        var buf = '',
            self = this,
            stream = this.stream;

        stream.setEncoding('utf8');
        stream.on('data', function(chunk) {
            buf += chunk;
            if ('\n' != buf[buf.length - 1]) return;
            buf.split('\n').map(function(line) {
                if (!line.length) return;
                try {
                    var captures = line.match(/^\[([^\]]+)\] (\w+) (.*)/);
                    var obj = {
                        date: new Date(captures[1]),
                        level: exports[captures[2]],
                        levelString: captures[2],
                        msg: captures[3]
                    };
                    self.emit('line', obj);
                } catch (err) {
                    // Ignore
                }
            });
            buf = '';
        });

        stream.on('end', function() {
            self.emit('end');
        });
    },

    /**
     * Log output message.
     *
     * @param  {String} levelStr
     * @param  {Array} args
     * @api private
     */

    log: function(levelStr, args) {
        /*
        for(var i=0;i<__stack.length;i++) {
            console.log("STACK "+__stack[i]);
        }
        */
        if (exports[levelStr] <= this.level) {
            var msg = format.apply(null, args);

            this.stream.write(this.options.marker);

            if (this.options.date) {
                this.stream.write('[' + new Date + ']' + ' ');
            }
            if (this.options.filename) {
                var path = __stack[2].getFileName();
                if(path) {
                    var paths = path.split("/");
                    var filename = paths[paths.length-1];
                    this.stream.write(this.colors.Green + filename + this.colors.reset + ' ');
                }
            }
            if (this.options.line_column) {
                this.stream.write(this.colors.DarkBlue + "["+ __stack[2].getLineNumber()+ ':'+ __stack[2].getColumnNumber()+"] "+this.colors.reset);
            }
            if (this.options.level) {
                this.stream.write(levelStr + ' ');
            }
            this.stream.write(
                this.levelColors[levelStr] + msg + this.colors.reset+ '\n'
            );
        }
    },

    /**
     * Log emergency `msg`.
     *
     * @param  {String} msg
     * @api public
     */

    emergency: function(msg) {
        this.log('EMERGENCY', arguments);
    },

    /**
     * Log alert `msg`.
     *
     * @param  {String} msg
     * @api public
     */

    alert: function(msg) {
        this.log('ALERT', arguments);
    },

    /**
     * Log critical `msg`.
     *
     * @param  {String} msg
     * @api public
     */

    critical: function(msg) {
        this.log('CRITICAL', arguments);
    },

    /**
     * Log error `msg`.
     *
     * @param  {String} msg
     * @api public
     */

    error: function(msg) {
        this.log('ERROR', arguments);
    },

    /**
     * Log warning `msg`.
     *
     * @param  {String} msg
     * @api public
     */

    warning: function(msg) {
        this.log('WARN', arguments);
    },

    /**
     * Log notice `msg`.
     *
     * @param  {String} msg
     * @api public
     */

    notice: function(msg) {
        this.log('NOTICE', arguments);
    },

    /**
     * Log info `msg`.
     *
     * @param  {String} msg
     * @api public
     */

    info: function(msg) {
        this.log('INFO', arguments);
    },

    /**
     * Log debug `msg`.
     *
     * @param  {String} msg
     * @api public
     */

    debug: function(msg) {
        this.log('DEBUG', arguments);
    }
};

/**
 * Inherit from `EventEmitter`.
 */

Nog.prototype.__proto__ = EventEmitter.prototype;
