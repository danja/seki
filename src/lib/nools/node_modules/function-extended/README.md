[![Build Status](https://travis-ci.org/doug-martin/function-extended.png?branch=master)](undefined)

[![browser support](https://ci.testling.com/doug-martin/function-extended.png)](https://ci.testling.com/doug-martin/function-extended)

# function-extended

`function-extended` is a Javascript library that can be used standalone or incorporated into [`extended`](https://github.com/doug-martin/extended)

```javascript
var fn = require("function-extended");
```

Or

```javascript
var myextended = require("extended")
	.register(require("function-extended"));
```

## Installation

```
npm install function-extended
```

Or [download the source](https://raw.github.com/doug-martin/function-extended/master/index.js) ([minified](https://raw.github.com/doug-martin/function-extended/master/function-extended.min.js))

## Usage

**`bind`**

Binds a function to the specified scope, while currying any extra arguments.

**`bindAll`**

Binds all functions or a list of named functions to the specified scope.

```javascript
var scope = {
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

fn.bindAll(scope);

scope.aFunc.call({}); //"a"
scope.bFunc.call({}); //"a"
scope.cFunc.call({}); //"c"

//or

fn.bindAll(scope, ["aFunc"]);

scope.aFunc.call({}); //"a"
scope.bFunc.call({}); //undefined
scope.cFunc.call({}); //undefined

```


**`bindIgnore`**

Binds a function to the specified scope while ignoring any extra arguments passed in.

```javascript
var func = function () {
    return [arguments.length, this.test];
};
var scope = {test: true};

var fn1 = fn.bindIgnore(obj, func, "hello"),
    fn2 = fn(func).bindIgnore(obj, "hello").f(),
    fn3 = fn(obj).bindIgnore(func, "hello");


fn1("world"); //[1, true]
fn2("world"); //[1,true]
fn3.f()("world"); //[1, true];
```

**`partial`**

Creates a function that does not change the eventual scope, but allows the you specify arguments that should be passed in.

```javascript
var func = function (str) {
    return str + " " + this.world;
};

var a = fn.partial(func, "hello");
var b =fn(func).partial("hello").f();

a.call({world: "world"}); //hello world
b.call({world: "world"}); //hello world

//With a string

var c = fn.partial("test"),
    c2 = fn("test2").partial().f(),

var scope = {
    test : function(){
        return "hello";
    },
    test2 : function(){
        return "world";
    }
};
c.call(scope); //hello
c2.call(scope); //world
```

**`applyFirst`**

Binds the function to the first arguments passed in.

```javascript

var func = function () {
    return this.test;
};

var newFn = fn.applyFirst(func);
newFn({test: true}); //true

newFn = fn(func).applyFirst().f();
newFn({test: true});

var push = fn.applyFirst("push"), pop = fn("pop").applyFirst().fn();

var arr = [];
push(arr, 1);
//arr === [1];

pop(arr);
//arr === [];

```

**`curry`**

Create a curried function.

```javascript
var curried = fn.curry(4, function(a,b,c,d){
    return [a,b,c,d].join(",");
});

curried("a");
curried("b");
curried("c");
curried("d"); //"a,b,c,d"

//OR

curried("a")("b")("c")("d"); //"a,b,c,d"
```


