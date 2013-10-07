"use strict";
var it = require('it'),
    assert = require('assert'),
    array = require("array-extended"),
    leafy = require(".."),
    Tree = leafy.Tree;


it.describe("leafy.Tree",function (it) {
    var methods = ["insert", "remove"];

    var tree = new Tree();
    array(methods).forEach(function (m) {
        it.describe("#" + m, function (it) {
            it.should("be abstract", function () {
                assert.throws(function () {
                    tree[m]();
                });
            });
        });
    });

}).as(module);

