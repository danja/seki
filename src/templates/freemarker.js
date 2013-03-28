// Copyright 2009 amplafi.com, Andreas Andreou
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var freemarker = {
	// Currently supports:
	// - basic interpolations
	// - directives:
	// 		if, else, list 
	// - size builtin for arrays

	// Usage:
	// var engine = freemarker.create("Hello ${name}");
	// alert( freemarker.render(engine, {name:'Bob'}) );
	// // or if don't plan to reuse the engine
	// alert( freemarker.render("Hello ${name}", {name:'Bob'}); );

	// TODO:
	// - support default values, i.e. ${user!"Anonymous"}
	// - null resistance in above expressions if in parenthesis
	// - support methods, i.e. ${avg(3, 5)}
	// - alternative syntax if starts with [#ftl]
	// - ftl comments ( <#-- ftl --> )
	// - directives elseif, switch, case, default, break, stop, compress, noparse, assign
	// see http://freemarker.sourceforge.net/docs/ref_directives.html
	// - string builtin for booleans, i.e. boolean?string("yes", "no")
	// - t, lt, rt, nt directives (or atleast ignore them)
	symbols: {	
		'replace': {start:'${', end:'}', process:function(parts, cmd) {
			parts.push(freemarker._p(cmd));
		}},
		'if': {start:'<#if', end:'>', process:function(parts, cmd) {
			if (cmd.indexOf('??')>=0) {
				var expr = cmd.substring(0, cmd.length-2);
				expr = freemarker._v(expr);
				parts.push("if (" + expr + ") {");
			} else if (cmd.indexOf('?size')>=0) {
				var pos = cmd.indexOf('?size');
				var expr = freemarker._v(cmd.substring(0, pos)) + '.length' + cmd.substring(pos+5);
				parts.push("if (" + expr + ") {");
			} else {
				parts.push("if (" + cmd + ") {");
			}
		}},
		'endif': {start:'</#if', end:'>', process:function(parts, cmd) {
			parts.push("}");
		}},
		'else': {start:'<#else', end:'>', process:function(parts, cmd) {
			parts.push("} else {");
		}},
		'list': {start:'<#list', end:'>', process:function(parts, cmd) {
			// <#list envelopes as envelope >
			var match = cmd.match(/\s*(\S*)\s*as\s*(\S*)\s*/);
			if (match) {
				parts.push("for (var " + match[2] + "_index in " + freemarker._v(match[1]) + ")");
			}
			parts.push("{");
            if (match) {
                parts.push(freemarker._v(match[2]) + "=" + freemarker._v(match[1]) + "[" + match[2] + "_index];");
            }
		}},
		'endlist': {start:'</#list', end:'>', process:function(parts, cmd) {			
			parts.push("}");
		}}
	},
	_o : function(cmd) {
		return "p.push(\"" + escape(cmd) + "\");";
	},
	_p : function(cmd) {
		return "p.push(" + freemarker._v(cmd, true) + ");";
	},
	_d : function(cmd) {
		return "console.debug(this, \"" + escape(cmd) + "\");";
	},
	_v : function(name, out) {
		return out ? 'this._fm_out(this.'+name+')' : 'this.'+name;
	},
	_setlocalvarscode: function(obj) {
		var buf = [];
		buf.push("this._vars={};");
		for (var p in obj) {
			buf.push("this._vars.", p, " = this['", p, "'];\n");
		}
		return buf.join('');
	},
	nextToken: function(template, pos) {
		var newPos;
		var endPos;
		var found={};
		for (var i in this.symbols) {
			var symbol = this.symbols[i];
			var n = template.indexOf(symbol.start, pos);
			if (n>=0 && (!found.symbol || n<found.newPos)) {
				var e = template.indexOf(symbol.end, n);
				if (e>=0) {
					found.newPos = n;
					found.endPos = e;
					found.start = n + symbol.start.length;
					found.symbol = symbol;
				}
			}
		}
		return found;
	},
	create: function(template) {
		var parts = [];
		parts.push("var p=[];");
		var pos=0;
		while (pos>=0) {
			var token = this.nextToken(template, pos);
			if (!token.symbol) {
				parts.push(this._o(template.substring(pos)));
				break;
			}
			parts.push(this._o(template.substring(pos, token.newPos)));
			if (token.symbol.process) {
				token.symbol.process(parts, template.substring(token.start, token.endPos));
			}
			
			pos = token.endPos+1;
		}
		parts.push("this._out = unescape(p.join(''));");

		var engine={
			compiled:parts.join(''),
			template:template
		};
		//console.debug(parts.join('\n'));
		return engine;
	},

	render: function(engine, context) {
		if (typeof engine == "string" || engine instanceof String) {
			engine = this.create(engine);
		}
		context = context || {};
		context._fm_out = function(val){
			if (typeof val == 'object'){
				if (typeof val._render == 'function')
					return val._render();
				else if (val[0])
					return val[0];				
			} 

			return val;
		};
		var vars = this._setlocalvarscode(context);
		//(function(){eval(vars+engine.compiled);}).call(context);
		(function(){eval(engine.compiled);}).call(context);
		return context._out;
	}
}; 
