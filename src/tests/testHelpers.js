

function normalizeXmlSpaces(string) {
	string = string.replace(/\s+</g,"<"); // clear out leading spaces
	string = string.replace(/>\s+</g,"><"); // clear out spaces between tags
	string = string.replace(/>\s+/g,">"); // clear out trailing spaces
	return string;
}

exports.normalizeXmlSpaces = normalizeXmlSpaces;


