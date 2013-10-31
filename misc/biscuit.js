/*
 * biscuit.js
 * Digest-style authentication
 * wrapped in cookies to avoid default browser behaviour
 * (no stateful sessions, credentials sent with every request)
 *
 * http://en.wikipedia.org/wiki/Digest_access_authentication#Example_with_explanation
 *
 * http://en.wikipedia.org/wiki/HTTP_cookie
 */

/**
 * The biscuit function checks the HTTP request's cookies against supplied credentials
 * returning true or false.
 */
function biscuit(request, response, username, password) {
    var authenticated = false;

    return authenticated;
}

function md5(str) {
    var hash = crypto.createHash("MD5");
    hash.update(str);
    return hash.digest("hex");
}

//make it available to other scripts
module.exports = biscuit;
