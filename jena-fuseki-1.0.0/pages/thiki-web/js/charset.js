	function native2ascii(str) {
		var out = "";
		for (var i = 0; i < str.length; i++) {
			if (str.charCodeAt(i) < 0x80) {
				out += str.charAt(i);
			} else {
				var u = "" + str.charCodeAt(i).toString(16);
				out += "\\u" + (u.length === 2 ? "00" + u : u.length === 3 ? "0" + u : u);
			}
		}
		return out;
	}
	
	// see http://ecmanaut.blogspot.it/2006/07/encoding-decoding-utf8-in-javascript.html
	function encode_utf8(s) {
		  return unescape(encodeURIComponent(s));
		}
	
	function decode_utf8(s) {
		s = removeSurrogates(s);
		var e = escape(s);
		  return decodeURIComponent(e);
		}
	
	function removeSurrogates(s) {
		s = s.replace(/[^\uD800-\uDBFF]/g, ''); // high surrogates
		s = s.replace(/[^\uDC00-\uDFFF]/g, ''); // low surrogates 
		return s;
	}