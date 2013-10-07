"use strict";
var it = require('it'),
    assert = require('assert'),
    fn = require("..");


it.describe("function-extender",function (it) {


    it.describe(".bind", function (it) {
        it.should("execute in the right scope", function () {
            var a = fn.bind({test: true}, function () {
                assert.isTrue(this.test);
            });
            a();
            var b = fn(function () {
                assert.isTrue(this.test);
            }).bind({test: true}).f();
            b();

            var c = fn({test: true}).bind(function () {
                assert.isTrue(this.test);
            }).f();
            c();
        });

        it.should("curry arguments", function () {
            var func = function (testStr, testStr2) {
                assert.isTrue(this.test);
                assert.equal(testStr, "HELLO");
                assert.equal(testStr2, "test");
            };
            var obj = {test: true};
            fn.bind(obj, func, "HELLO")("test");
            fn(func).bind(obj, "HELLO").f()("test");
            fn(obj).bind(func, "HELLO").f()("test");
        });

        it.should("throw an error with an invalid function", function () {
            assert.throws(function () {
                fn.bind(fn, "someFunction");
            });

            assert.throws(function () {
                fn.bind(fn, new Date());
            });
        });

        it.should("work with non function properties also", function () {
            var val = [],
                accessor1 = fn.bind(val, "length"),
                accessor2 = fn(val).bind("length").f(),
                accessor3 = fn("length").bind(val).f();
            val.push(1);
            assert.equal(accessor1(), 1);

            val.push(3);
            assert.equal(accessor2(), 2);

            val.push(4);
            assert.equal(accessor3(), 3);

        });


    });

    it.describe("#bindIngore", function (it) {
        it.should("execute in the right scope ignoring extra arguments", function () {
            var func = function () {
                    assert.lengthOf(arguments, 1);
                    assert.equal(arguments[0], "hello");
                },
                obj = {test: true};

            fn.bindIgnore(obj, func, "hello")("world");
            fn(func).bindIgnore(obj, "hello").f()("world");
            fn(obj).bindIgnore(func, "hello").f()("world");
        });

        it.should("throw an error with an invalid function", function () {
            assert.throws(function () {
                fn.bindIgnore(fn, "someFunction");
            });

            assert.throws(function () {
                fn.bindIgnore(fn, new Date());
            });
        });

        it.should("work with non function properties also", function () {
            var val = [],
                prop = "length",
                accessor1 = fn.bindIgnore(val, "length"),
                accessor2 = fn(val).bindIgnore("length").f(),
                accessor3 = fn(prop).bindIgnore(val).f();
            val.push(1);
            assert.equal(accessor1(), 1);
            val.push(3);
            assert.equal(accessor2(), 2);
            val.push(4);
            assert.equal(accessor3(), 3);

        });
    });

    it.describe("#bindAll", function (it) {

        var obj;
        it.beforeEach(function () {
            obj = {
                a: "a",
                b: "b",
                c: "c",
                aFunc: function () {
                    return this.a;
                },
                bFunc: function () {
                    return this.b;
                },
                cFunc: function () {
                    return this.c;
                }
            };
        });

        it.should("hitch all functions in the object", function () {
            var newScope = {};
            fn.bindAll(obj);
            assert.equal(obj.aFunc.call(newScope), "a");
            assert.equal(obj.bFunc.call(newScope), "b");
            assert.equal(obj.cFunc.call(newScope), "c");

        });

        it.should("hitch only functions specified in an array", function () {
            var newScope = {};
            fn.bindAll(obj, ["aFunc"]);
            assert.equal(obj.aFunc.call(newScope), "a");
            assert.isUndefined(obj.bFunc.call(newScope));
            assert.isUndefined(obj.cFunc.call(newScope));
        });

        it.should("hitch only functions specified as the rest of the arguments", function () {
            var newScope = {};
            fn.bindAll(obj, "aFunc", "bFunc");
            assert.equal(obj.aFunc.call(newScope), "a");
            assert.equal(obj.bFunc.call(newScope), "b");
            assert.isUndefined(obj.cFunc.call(newScope));
        });

    });


    it.describe("#partial", function (it) {
        it.should("not change the execution scope", function () {
            var func = function (test) {
                assert[test ? "isTrue" : "isUndefined"](this.test);
            };
            var a = fn.partial(func);
            var b = fn(func).partial().f();
            a.call({test: true}, true);
            b.call({test: true}, true);
        });

        it.should("should work with strings", function () {
            var str = fn("test2");
            var c = fn.partial("test"),
                c2 = fn.partial("test2"),
                c3 = str.partial().f();
            assert.equal(c.call({test: true}), true);
            assert.equal(c2.call({
                test2: function () {
                    return true;
                }
            }), true);
            assert.equal(c3.call({
                test2: function () {
                    return true;
                }
            }), true);

        });

        it.should("curry extra parameters", function () {
            var c = fn.partial(function (hello, world) {
                assert.equal(hello, "hello");
                assert.equal(world, "world");
            }, "hello");
            c("world");

            fn("test2").partial("test").f().call({test: function (val1, val2) {
                assert.equal(val1, "test");
                assert.equal(val2, "test2");
            }}, "test2");

        });

        it.should("throw an error with an invalid function", function () {
            assert.throws(function () {
                fn.partial({});
            });

            assert.throws(function () {
                fn.partial(1);
            });
        });
    });

    it.describe("#applyFirst", function (it) {
        it.should("execute in the right scope", function () {
            var func = function () {
                assert.isTrue(this.test);
            };
            fn.applyFirst(func)({test: true});
            fn(func).applyFirst().f()({test: true});
        });

        it.should("curry arguments", function () {
            var func = function (testStr, testStr2) {
                assert.isTrue(this.test);
                assert.equal(testStr, "HELLO");
                assert.equal(testStr2, "test");
            };
            fn.applyFirst(func, "HELLO")({test: true}, "test");
            fn(func).applyFirst("HELLO").f()({test: true}, "test");
        });

        it.should("throw an error with an invalid function", function () {
            assert.throws(function () {
                fn.applyFirst(1);
            });

            assert.throws(function () {
                fn.applyFirst(new Date());
            });
        });

        it.should("work with non function properties also", function () {
            var val = [],
                push = fn.applyFirst("push"),
                push2 = fn("push").applyFirst().f(),
                length = fn.applyFirst("length"),
                length2 = fn("length").applyFirst().f();
            push(val, 1);
            assert.equal(length(val), 1);

            push(val, 3);
            assert.equal(length(val), 2);

            push(val, 4);
            assert.equal(length(val), 3);

            push2(val, 1);
            assert.equal(length2(val), 4);

            push2(val, 3);
            assert.equal(length2(val), 5);

            push2(val, 4);
            assert.equal(length2(val), 6);

        });
    });


    it.describe("#curry", function (it) {
        it.should("force invocation for the specified number of times", function () {

            var func = function (a, b, c, d) {
                assert.equal(a, "a");
                assert.equal(b, "b");
                assert.equal(c, "c");
                assert.equal(d, "d");
            };

            var curried = fn.curry(4, func);
            curried("a")("b")("c")("d");
            fn(func).curry(4).f()("a")("b")("c")("d");
        });

        it.should("accept an execution scope", function () {
            var func = function (a, b, c, d) {
                assert.isTrue(this.test);
                assert.equal(a, "a");
                assert.equal(b, "b");
                assert.equal(c, "c");
                assert.equal(d, "d");
            };
            var curried = fn.curry(4, func, {test: true}),
                curried2 = fn(func).curry(4, {test: true}).f();
            curried("a")("b")("c")("d");
            curried2("a")("b")("c")("d");
        });

        it.should("accept an a string and execution scope", function () {
            var scope = {
                test: true,
                curried: function (a, b, c, d) {
                    assert.isTrue(this.test);
                    assert.equal(a, "a");
                    assert.equal(b, "b");
                    assert.equal(c, "c");
                    assert.equal(d, "d");
                }
            };
            var curried = fn.curry(4, "curried", scope),
                curried2 = fn(scope).curry(4, "curried").f(),
                curried3 = fn("curried").curry(4, scope).f();

            curried("a")("b")("c")("d");
            curried2("a")("b")("c")("d");
            curried3("a")("b")("c")("d");
        });
    });

}).as(module);




