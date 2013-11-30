"use strict";
var it = require('it'),
    assert = require('assert'),
    promise = require(".."),
    fn = require("function-extended"),
    Promise = promise.Promise,
    PromiseList = promise.PromiseList,
    array = require("array-extended");


it.describe("promise-extended",function (it) {

    it.describe(".Promise", function (it) {

        it.describe("#addCallback, #callback", function (it) {
            it.should("callback", function (next) {
                var promise = new Promise();
                promise.addCallback(function (res) {
                    assert.equal(res, "hello");
                    next();
                });

                setTimeout(fn.bind(promise, "callback", "hello"), 0);
            });

            it.should("callback after callback has already been called", function (next) {
                var promise = new Promise();
                promise.callback("hello");
                promise.addCallback(function (res) {
                    assert.equal(res, "hello");
                    next();
                });

            });

        });

        it.describe("#addErrback, #errback", function (it) {

            it.should("errback when using addErback and errback is called", function (next) {
                var promise = new Promise();
                promise.addErrback(function (res) {
                    assert.equal(res, "error");
                    next();
                });
                setTimeout(fn.bind(promise, "errback", "error"), 0);
            });

            it.should("errback when after errback has already been called", function (next) {
                var promise = new Promise();
                promise.errback("error");
                promise.addErrback(function (res) {
                    assert.equal(res, "error");
                    next();
                });
            });

        });

        it.describe("#both", function (it) {

            it.should("callback when using both and callback is called", function (next) {
                var promise = new Promise();
                promise.both(function (res) {
                    assert.equal(res, "callback");
                    next();
                });
                setTimeout(fn.bind(promise, "callback", "callback"), 0);
            });

            it.should("callback when using both and errback is called", function (next) {
                var promise = new Promise();
                promise.both(function (res) {
                    assert.equal(res, "errback");
                    next();
                });
                setTimeout(fn.bind(promise, "errback", "errback"), 0);
            });

            it.should("callback when using both and callback is called", function (next) {
                var promise = new Promise();
                promise.callback("callback");
                promise.both(function (res) {
                    assert.equal(res, "callback");
                    next();
                });
            });

            it.should("callback when using both and errback is called", function (next) {
                var promise = new Promise();
                promise.errback("errback");
                promise.both(function (res) {
                    assert.equal(res, "errback");
                    next();
                });
            });

            it.should("callback after all are done ", function (next) {
                var promise = new Promise();
                promise.both(
                    function (res) {
                        var promise2 = new Promise();
                        setTimeout(fn.bind(promise2, "callback", res + " world"), 0);
                        return promise2;
                    }, next).both(
                    function (res) {
                        var promise3 = new Promise();
                        setTimeout(fn.bind(promise3, "callback", res + "!"), 0);
                        return promise3;
                    }, next).then(function (res) {
                        assert.equal(res, "hello world!");
                        next();
                    }, next);
                setTimeout(fn.bind(promise, "callback", "hello"), 0);

            });

            it.should("callback after all are done with sync actions", function (next) {
                var promise = new Promise();
                promise.both(
                    function (res) {
                        return res + " world";
                    }, next).both(
                    function (res) {
                        var promise3 = new Promise();
                        setTimeout(fn.bind(promise3, "callback", res + "!"), 0);
                        return promise3;
                    }, next).then(function (res) {
                        assert.equal(res, "hello world!");
                        next();
                    }, next);
                setTimeout(fn.bind(promise, "callback", "hello"), 0);

            });

            it.should("errback after all are done ", function (next) {
                var promise = new Promise();
                promise.both(
                    function (res) {
                        var promise2 = new Promise();
                        setTimeout(fn.bind(promise2, "errback", res + " error"), 0);
                        return promise2;
                    }).both(
                    function (res) {
                        var promise3 = new Promise();
                        setTimeout(fn.bind(promise3, "callback", res + " error"), 0);
                        return promise3;
                    }).then(function (res) {
                        assert.equal(res, "error error error");
                        next();
                    }, next);
                setTimeout(fn.bind(promise, "errback", "error"), 0);

            });

            it.should("catch errors in callback ", function (next) {
                var promise = new Promise();
                promise.both(
                    function (res) {
                        throw res + " error";
                    }).both(
                    function (res) {
                        var promise3 = new Promise();
                        setTimeout(fn.bind(promise3, "callback", res + " error"), 0);
                        return promise3;
                    }).then(function (res) {
                        assert.equal(res, "error error error");
                        next();
                    }, next);
                setTimeout(fn.bind(promise, "errback", "error"), 0);

            });

            it.should("catch errors ", function (next) {
                var promise = new Promise();
                promise.both(
                    function (res) {
                        throw res + " error";
                    }).both(
                    function (res) {
                        var promise3 = new Promise();
                        setTimeout(fn.bind(promise3, "callback", res + " error"), 0);
                        return promise3;
                    }).then(function (res) {
                        assert.equal(res, "error error error");
                        next();
                    }, next);
                setTimeout(fn.bind(promise, "callback", "error"), 0);

            });

        });


        it.describe("#then", function (it) {

            it.should("callback when using then and callback is called", function (next) {
                var promise = new Promise();
                promise.then(function (res) {
                    assert.equal(res, "callback");
                    next();
                }, next);
                setTimeout(fn.bind(promise, "callback", "callback"), 0);
            });

            it.should("errback when using then and errback is called", function (next) {
                var promise = new Promise();
                promise.then(next, function (res) {
                    assert.equal(res, "errback");
                    next();
                });
                setTimeout(fn.bind(promise, "errback", "errback"), 0);
            });


            it.should("callback when using then with a promise and callback is already called", function (next) {
                var promise = new Promise();
                promise.callback("callback");
                promise.then(function (res) {
                    assert.equal(res, "callback");
                    next();
                }, next);
            });

            it.should("errback when using then and errback is called", function (next) {
                var promise = new Promise();
                promise.errback("errback");
                promise.then(next, function (res) {
                    assert.equal(res, "errback");
                    next();
                });
            });

            it.should("callback after all are done ", function (next) {
                var promise = new Promise();
                promise.then(
                    function (res) {
                        var promise2 = new Promise();
                        setTimeout(fn.bind(promise2, "callback", res + " world"), 0);
                        return promise2;
                    }, next).then(
                    function (res) {
                        var promise3 = new Promise();
                        setTimeout(fn.bind(promise3, "callback", res + "!"), 0);
                        return promise3;
                    }, next).then(function (res) {
                        assert.equal(res, "hello world!");
                        next();
                    }, next);
                setTimeout(fn.bind(promise, "callback", "hello"), 0);
            });

            it.should("work with sync actions also", function (next) {
                var promise = new Promise();
                promise.then(
                    function (res) {
                        return res + " world";
                    }, next).then(
                    function (res) {
                        return res + "!";
                    }, next).then(function (res) {
                        assert.equal(res, "hello world!");
                        next();
                    }, next);
                setTimeout(fn.bind(promise, "callback", "hello"), 0);
            });

            it.should("work with values", function (next) {
                var promise = new Promise();
                promise
                    .then("hello")
                    .then(function (res) {
                        return res + "!";
                    }).then(function (res) {
                        assert.equal(res, "hello!");
                    }).classic(next);
                setTimeout(fn.bind(promise, "callback", "hello"), 0);
            });

            it.should("errback if there is an error ", function (next) {
                var promise = new Promise();
                promise.then(
                    function (res) {
                        var promise2 = new Promise();
                        setTimeout(fn.bind(promise2, "callback", res + " world"), 0);
                        return promise2;
                    }, next)
                    .then(function () {
                        var promise3 = new Promise();
                        setTimeout(fn.bind(promise3, "errback", "error"), 0);
                        return promise3;
                    })
                    .then(next, function (res) {
                        assert.equal(res, "error");
                        next();
                    });
                setTimeout(fn.bind(promise, "callback", "hello"), 0);

            });

            it.should("propagate errors if no errback ", function (next) {
                var promise = new Promise();
                promise.then(
                    function (res) {
                        var promise2 = new Promise();
                        setTimeout(fn.bind(promise2, "callback", res + " world"), 0);
                        return promise2;
                    }).then(
                    function () {
                        var promise3 = new Promise();
                        setTimeout(fn.bind(promise3, "errback", "error in 3"), 0);
                        return promise3;
                    }).then(
                    function (res) {
                        var promise4 = new Promise();
                        setTimeout(fn.bind(promise4, "callback", res + " not called"), 0);
                        return promise4;
                    })
                    .then(next, function (res) {
                        assert.equal(res, "error in 3");
                        next();
                    });
                setTimeout(fn.bind(promise, "callback", "hello"), 0);

            });

            it.should("allow the catching of errors if an errback is supplied ", function (next) {
                var promise = new Promise();
                promise.then(
                    function (res) {
                        var promise2 = new Promise();
                        setTimeout(fn.bind(promise2, "callback", res + " world"), 0);
                        return promise2;
                    }).then(
                    function () {
                        var promise3 = new Promise();
                        setTimeout(fn.bind(promise3, "errback", "error in 3"), 0);
                        return promise3;
                    }).then(
                    function (res) {
                        var promise4 = new Promise();
                        setTimeout(fn.bind(promise4, "callback", res + " not called"), 0);
                        return promise4;
                    }, function () {
                        return "error caught!";
                    })
                    .then(function (res) {
                        assert.equal(res, "error caught!");
                        next();
                    }, next);
                setTimeout(fn.bind(promise, "callback", "hello"), 0);

            });

            it.should("allow the catching of errors if an errback is and returns a promise ", function (next) {
                var promise = new Promise();
                promise.then(
                    function (res) {
                        var promise2 = new Promise();
                        setTimeout(fn.bind(promise2, "callback", res + " world"), 0);
                        return promise2;
                    }).then(
                    function () {
                        var promise3 = new Promise();
                        setTimeout(fn.bind(promise3, "errback", "error in 3"), 0);
                        return promise3;
                    }).then(
                    function (res) {
                        var promise4 = new Promise();
                        setTimeout(fn.bind(promise4, "callback", res + " not called"), 0);
                        return promise4;
                    }, function () {
                        var promise4 = new Promise();
                        setTimeout(fn.bind(promise4, "callback", "error caught!"), 0);
                        return promise4;
                    })
                    .then(function (res) {
                        assert.equal(res, "error caught!");
                        next();
                    }, next);
                setTimeout(fn.bind(promise, "callback", "hello"), 0);
            });

            it.should("allow the catching of errors if an errback is and returns a promise and re throwing ", function (next) {
                var promise = new Promise();
                promise.then(
                    function (res) {
                        var promise2 = new Promise();
                        setTimeout(fn.bind(promise2, "callback", res + " world"), 0);
                        return promise2;
                    }).then(
                    function () {
                        var promise3 = new Promise();
                        setTimeout(fn.bind(promise3, "errback", "error in 3"), 0);
                        return promise3;
                    }).then(
                    function (res) {
                        var promise4 = new Promise();
                        setTimeout(fn.bind(promise4, "callback", res + " not called"), 0);
                        return promise4;
                    }, function () {
                        throw new Error("error caught!");
                    })
                    .then(next, function (res) {
                        assert.equal(res.message, "error caught!");
                        next();
                    }, next);
                setTimeout(fn.bind(promise, "callback", "hello"), 0);
            });

            it.should("allow the catching of errors if an errback is and returns a promise and errback again ", function (next) {
                var promise = new Promise();
                promise.then(
                    function (res) {
                        var promise2 = new Promise();
                        setTimeout(fn.bind(promise2, "callback", res + " world"), 0);
                        return promise2;
                    }).then(
                    function () {
                        var promise3 = new Promise();
                        setTimeout(fn.bind(promise3, "errback", "error in 3"), 0);
                        return promise3;
                    }).then(
                    function (res) {
                        var promise4 = new Promise();
                        setTimeout(fn.bind(promise4, "callback", res + " not called"), 0);
                        return promise4;
                    }, function () {
                        var promise4 = new Promise();
                        setTimeout(fn.bind(promise4, "errback", "error caught!"), 0);
                        return promise4;
                    })
                    .then(next, function (res) {
                        assert.equal(res, "error caught!");
                        next();
                    }, next);
                setTimeout(fn.bind(promise, "callback", "hello"), 0);
            });
        });

        it.describe("#classic", function (it) {

            it.should("callback when using classic and callback is called", function (next) {
                var promise = new Promise();
                promise.classic(function (err, res) {
                    assert.isNull(err);
                    assert.equal(res, "callback");
                    next();
                });
                setTimeout(fn.bind(promise, "callback", "callback"), 0);
            });

            it.should("errback when using classic and errback is called", function (next) {
                var promise = new Promise();
                promise.classic(function (err) {
                    assert.equal(err, "errback");
                    next();
                });
                setTimeout(fn.bind(promise, "errback", "errback"), 0);
            });

        });


    });

    it.describe(".PromiseList", function (it) {


        it.should("should callback after all have fired ", function () {

            var promise = new Promise(), promise2 = new Promise(), promise3 = new Promise();
            setTimeout(fn.bind(promise, "callback", "hello"), 100);
            setTimeout(fn.bind(promise2, "callback", "world"), 150);
            setTimeout(fn.bind(promise3, "callback", "!"), 200);
            return new PromiseList([promise, promise2, promise3]).then(function (res) {
                var expected = ["hello", "world", "!"];
                array(res).forEach(function (r, i) {
                    assert.equal(r[1], expected[i]);
                });
            });
        });

        it.should("callback immediately if no promises are provided", function (next) {
            new PromiseList().then(function (res) {
                assert.deepEqual(res, []);
                next();
            }, next);
        });

        it.should("callback immediately if and empty array is provided", function (next) {
            new PromiseList([]).then(function (res) {
                assert.deepEqual(res, []);
                next();
            }, next);
        });

        it.should("callback if provided promises that have already fired", function (next) {
            var promise = new Promise(), promise2 = new Promise(), promise3 = new Promise();
            promise.callback("hello");
            promise2.callback("world");
            promise3.callback("!");
            new PromiseList([promise, promise2, promise3]).then(function (res) {
                var expected = ["hello", "world", "!"];
                array(res).forEach(function (r, i) {
                    assert.equal(r[1], expected[i]);
                });
                next();
            }, next);
        });

        it.should("errback if provided promises that have already fired and one errored back", function (next) {
            var promise = new Promise(), promise2 = new Promise(), promise3 = new Promise();
            promise.callback("hello");
            promise2.callback("world");
            promise3.errback("error");
            var pl = new PromiseList([promise, promise2, promise3]);
            setTimeout(function () {
                pl.then(next, function (res) {
                    array(res).forEach(function (res) {
                        if (res) {
                            assert.equal(res[1], "error");
                        }
                    });
                    next();
                });
            }, 0);
        });

        it.should("handle the ordering of results if resolved out of order", function (next) {
            var promise = new Promise(), promise2 = new Promise(), promise3 = new Promise();
            setTimeout(fn.bind(promise, "callback", "hello"), 200);
            setTimeout(fn.bind(promise2, "callback", "world"), 150);
            setTimeout(fn.bind(promise3, "callback", "!"), 100);
            new PromiseList([promise, promise2, promise3]).then(function (res) {
                var expected = ["hello", "world", "!"];
                array(res).forEach(function (res, i) {
                    assert.equal(res[1], expected[i]);
                });
                next();
            }, next);
        });

        it.should("normalize results", function (next) {
            var promise = new Promise(), promise2 = new Promise(), promise3 = new Promise();
            setTimeout(fn.bind(promise, "callback", "hello"), 200);
            setTimeout(fn.bind(promise2, "callback", "world"), 150);
            setTimeout(fn.bind(promise3, "callback", "!"), 100);
            new PromiseList([promise, promise2, promise3], true).then(function (res) {
                assert.deepEqual(res, ["hello", "world", "!"]);
                next();
            }, next);
        });

        it.should("accept a promise as a callback", function (next) {
            var promise = new Promise(), promise2 = new Promise(), promise3 = new Promise();
            setTimeout(fn.bind(promise, "callback", "hello"), 0);
            setTimeout(fn.bind(promise2, "callback", "world"), 0);
            setTimeout(fn.bind(promise3, "callback", "!"), 0);
            var p2 = new Promise();
            p2.then(function (res) {
                assert.deepEqual(res, ["hello", "world", "!"]);
                next();
            });
            new PromiseList([promise, promise2, promise3], true).addCallback(p2).addErrback(next);
        });

        it.should("accept a promise as a errback", function (next) {
            var promise = new Promise(), promise2 = new Promise(), promise3 = new Promise();
            setTimeout(fn.bind(promise, "callback", "hello"), 0);
            setTimeout(fn.bind(promise2, "callback", "world"), 0);
            setTimeout(fn.bind(promise3, "errback", "error"), 0);
            var p2 = new Promise();
            p2.then(next, function (res) {
                assert.equal(res[2], "error");
                next();
            });
            new PromiseList([promise, promise2, promise3], true).addCallback(next).addErrback(p2);
        });

    });

    it.describe(".when", function (it) {
        it.should("honor the promise api with no callback or errback", function (next) {
            var p = new Promise();
            promise.when(p).then(function (res) {
                assert.equal(res, "hello");
                next();
            }, next);
            setTimeout(fn.bind(p, "callback", "hello"), 0);
        });

        it.should("honor the promise api with no callback or errback and erroring", function (next) {
            var p = new Promise();
            promise.when(p).then(next, function (res) {
                assert.equal(res, "error");
                next();
            });
            setTimeout(fn.bind(p, "errback", "error"), 0);
        });


        it.should("honor the promise api with value", function (next) {
            promise.when("hello").then(function (res) {
                assert.equal(res, "hello");
                next();
            }, next);
        });


        it.should("honor the promise api with value and Promise but no callback and errback", function (next) {
            promise.when("hello", new Promise().callback("world")).then(function (res) {
                assert.deepEqual(res, ["hello", "world"]);
                next();
            }, next);
        });


        it.should("honor the promise api with value, errored Promise, and no callback or errback", function (next) {
            promise.when("hello", new Promise().errback("world")).then(next, function (res) {
                assert.isUndefined(res[0]);
                assert.equal(res[1], "world");
                next();
            });
        });

        it.should("honor the promise api with no arguments", function (next) {
            promise.when().then(fn.partial(next, null), next);
        });

        it.should("accept an array of promises", function (next) {
            promise.when([
                    new promise.Promise().callback("hello"),
                    new promise.Promise().callback("world"),
                    new promise.Promise().callback("!")
                ]).then(function (res) {
                    assert.deepEqual(res, ["hello", "world", "!"]);
                }).classic(next);
        });

    });


    it.describe(".wrap", function (it) {
        var nodeCBStyle = function (cb) {
            var args = Array.prototype.slice.call(arguments);
            cb = args.pop();
            cb.apply(this, [null].concat(args));
        };

        var nodeCBStyleError = function (cb) {
            var args = Array.prototype.slice.call(arguments);
            cb = args.pop();
            cb.apply(this, ["ERROR"]);
        };

        it.should("wrap traditional node cb methods with a promise", function (next) {
            promise.wrap(nodeCBStyle)("HELLO WORLD").then(function (res) {
                assert.equal(res, "HELLO WORLD");
                next();
            }, next);
        });

        it.should("wrap traditional node cb methods with a promise and errback if an error is the first argument", function (next) {
            promise.wrap(nodeCBStyleError)("HELLO WORLD").then(next, function (res) {
                assert.equal(res, "ERROR");
                next();
            });
        });
    });

    it.describe(".serial", function (it) {

        var asyncAction = function (item, timeout, error) {
            var ret = new promise.Promise();
            setTimeout(fn.bindIgnore(ret, error ? "errback" : "callback", item), timeout);
            return ret.promise();
        };

        var syncAction = function (item, error) {
            if (error) {
                throw "ERROR";
            } else {
                return item;
            }
        };

        it.should("execute the items serially", function (next) {
            promise.serial([
                    fn.partial(asyncAction, 1, 100),
                    fn.partial(syncAction, 1.5),
                    fn.partial(asyncAction, 2, 90),
                    fn.partial(syncAction, 2.5),
                    fn.partial(asyncAction, 3, 80),
                    fn.partial(syncAction, 3.5),
                    fn.partial(asyncAction, 4, 70),
                    fn.partial(syncAction, 4.5),
                    fn.partial(asyncAction, 5, 60),
                    fn.partial(syncAction, 5.5),
                    fn.partial(asyncAction, 6, 50)
                ]).then(function (res) {
                    assert.deepEqual(res, [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6]);
                    next();
                }, next);
        });

        it.should("catch errors", function (next) {
            promise.serial([
                    fn.partial(asyncAction, 1, 100),
                    fn.partial(syncAction, 1.5),
                    fn.partial(asyncAction, 2, 90),
                    fn.partial(syncAction, 2.5),
                    fn.partial(asyncAction, 3, 80),
                    fn.partial(syncAction, 3.5),
                    fn.partial(asyncAction, 4, 70),
                    fn.partial(syncAction, 4.5),
                    fn.partial(asyncAction, 5, 60),
                    fn.partial(syncAction, 5.5, true),
                    fn.partial(asyncAction, 6, 50)
                ]).then(next, function (res) {
                    assert.deepEqual(res, "ERROR");
                    next();
                });
        });

        it.should("catch async errors", function (next) {
            promise.serial([
                    fn.partial(asyncAction, 1, 100, true),
                    fn.partial(syncAction, 1.5),
                    fn.partial(asyncAction, 2, 90),
                    fn.partial(syncAction, 2.5),
                    fn.partial(asyncAction, 3, 80),
                    fn.partial(syncAction, 3.5),
                    fn.partial(asyncAction, 4, 70),
                    fn.partial(syncAction, 4.5),
                    fn.partial(asyncAction, 5, 60),
                    fn.partial(syncAction, 5.5, true),
                    fn.partial(asyncAction, 6, 50)
                ]).then(next, function (res) {
                    assert.deepEqual(res, 1);
                    next();
                });
        });

        it.should("throw an error if not called with an array", function () {
            assert.throws(function () {
                promise.serial(
                    fn.partial(asyncAction, 1, 100, true),
                    fn.partial(syncAction, 1.5),
                    fn.partial(asyncAction, 2, 90),
                    fn.partial(syncAction, 2.5),
                    fn.partial(asyncAction, 3, 80),
                    fn.partial(syncAction, 3.5),
                    fn.partial(asyncAction, 4, 70),
                    fn.partial(syncAction, 4.5),
                    fn.partial(asyncAction, 5, 60),
                    fn.partial(syncAction, 5.5, true),
                    fn.partial(asyncAction, 6, 50)
                );
            });
        });
    });

    it.describe(".chain", function (it) {
        function asyncAction(add, timeout, error) {
            return function (num) {
                num = num || 0;
                var ret = new promise.Promise();
                setTimeout(function () {
                    !error ? ret.callback(num + add) : ret.errback("ERROR");
                }, timeout);
                return ret;
            };
        }

        function asyncActionMulti(add, timeout, error) {
            return function (num, prev) {
                num = num || 0;
                prev = prev || 0;
                var ret = new promise.Promise();
                setTimeout(function () {
                    !error ? ret.callback(num + add, num + prev) : ret.errback("ERROR");
                }, timeout || 0);
                return ret;
            };
        }

        function syncAction(add, error) {
            return function (num) {
                if (error) {
                    throw "ERROR";
                } else {
                    return num + add;
                }
            };
        }

        it.should("execute the items serially", function (next) {
            promise.chain([
                    asyncAction(1, 100),
                    syncAction(1.5),
                    asyncAction(2, 90),
                    syncAction(2.5),
                    asyncAction(3, 80),
                    syncAction(3.5),
                    asyncAction(4, 70),
                    syncAction(4.5),
                    asyncAction(5, 60),
                    syncAction(5.5),
                    asyncAction(6, 50)
                ]).then(function (results, prev) {
                    assert.deepEqual(results, 38.5);
                    assert.isUndefined(prev);
                    next();
                }, next);
        });

        it.should("catch errors", function (next) {
            promise.chain([
                    asyncAction(1, 100),
                    syncAction(1.5),
                    asyncAction(2, 90),
                    syncAction(2.5),
                    asyncAction(3, 80),
                    syncAction(3.5),
                    asyncAction(4, 70),
                    syncAction(4.5),
                    asyncAction(5, 60),
                    syncAction(5.5, true),
                    asyncAction(6, 50)
                ]).then(next, function (res) {
                    assert.deepEqual(res, "ERROR");
                    next();
                });
        });

        it.should("catch async errors", function (next) {
            promise.chain([
                    asyncAction(1, 100, true),
                    syncAction(1.5),
                    asyncAction(2, 90),
                    syncAction(2.5),
                    asyncAction(3, 80),
                    syncAction(3.5),
                    asyncAction(4, 70),
                    syncAction(4.5),
                    asyncAction(5, 60),
                    syncAction(5.5, true),
                    asyncAction(6, 500)
                ]).then(next, function (res) {
                    assert.deepEqual(res, "ERROR");
                    next();
                });
        });

        it.should("throw an error if not called with an array", function () {
            assert.throws(function () {
                promise.chain(
                    asyncAction(1, 100, true),
                    syncAction(1.5),
                    asyncAction(2, 90),
                    syncAction(2.5),
                    asyncAction(3, 80),
                    syncAction(3.5),
                    asyncAction(4, 70),
                    syncAction(4.5),
                    asyncAction(5, 60),
                    syncAction(5.5, true),
                    asyncAction(6, 50)
                );
            });
        });

        it.should("return multiple arguments if function callback with multiple args", function (next) {
            promise.chain([
                    asyncActionMulti(1, 100),
                    asyncActionMulti(1.5),
                    asyncActionMulti(2, 90),
                    asyncActionMulti(2.5),
                    asyncActionMulti(3, 80),
                    asyncActionMulti(3.5),
                    asyncActionMulti(4, 70),
                    asyncActionMulti(4.5),
                    asyncActionMulti(5, 60),
                    asyncActionMulti(5.5),
                    asyncActionMulti(6, 50)
                ]).then(function (num, prev) {
                    assert.equal(num, 38.5);
                    assert.equal(prev, 137.5);
                    next();
                }, next);
        });
    });

    it.describe(".wait", function (it) {

        it.should("wait for the promise to resolve", function (next) {
            var p = new promise.Promise();
            var waiter = promise.wait(p, function wait(arg) {
                assert.isTrue(arg);
                next();
            });
            waiter(true);
            setTimeout(function () {
                p.resolve(null);
            }, 0);
        });

        it.should("allow multiple executions", function (next) {
            var p = new promise.Promise();
            var waiter = promise.wait(p, function wait(arg) {
                assert.isNumber(arg);
                if (arg === 2) {
                    next();
                } else {
                    waiter(2);
                }
            });
            waiter(1);
            setTimeout(function () {
                p.resolve(null);
            }, 0);
        });

    });
}).as(module).run();

