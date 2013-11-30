function Utils() {}

// static method
Utils.makePath = function(title, isoDate) {
    var slug = title;
    if (!slug) {
        slug = '' + Math.floor((Math.random() * 1000) + 1);
        slug = '/id' + ("000" + slug).slice(-4);
        // log.debug("SLUG = "+slug);
    } else {
        slug = slug.toLowerCase().replace(/\s/g, "-");
    }
    return isoDate.substring(0, 10).replace(/-/g, "/") + "/" + slug;
}

Utils.cleanMessage = function(content) {
    content = content.replace(/%0D/g, ""); // remove carriage returns 
    content = content.replace(/%0A/g, ""); // remove newlines - Fuseki complains otherwise
    return content;
}

Utils.localToGlobalURI = function(localURI) {}

module.exports = Utils;
