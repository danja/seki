"use strict";

var p = require("../");

exports.fulfilled = p.resolve;
exports.rejected = p.reject;
exports.pending = function () {
    var deferred = new p.defer();

    return {
        promise: deferred.promise(),
        fulfill: deferred.callback,
        reject: deferred.errback
    };
};

