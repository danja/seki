[![Build Status](https://travis-ci.org/doug-martin/promise-extended.png?branch=master)](undefined)

[![browser support](https://ci.testling.com/doug-martin/promise-extended.png)](https://ci.testling.com/doug-martin/promise-extended)

# promise-extended

`promise-extended` is a Javascript library that can be used standalone or incorporated into [`extended`](https://github.com/doug-martin/extended)

```javascript
var promise = require("promise-extended");
```

Or

```javascript
var myextended = require("extended")
	.register(require("promise-extended"));
```

## Installation

```
npm install promise-extended
```

Or [download the source](https://raw.github.com/doug-martin/promise-extended/master/index.js) ([minified](https://raw.github.com/doug-martin/promise-extended/master/promise-extended.min.js))

## Usage

**`Promise`**

The promise constructor used by `promise` and `defer`

**`Promise#callback`**

Resolve a promise with the given value.

**`Promise#errback`**

Reject a promise with the given value.

**`Promise#callback`**

Resolve a promise with the given value.

**`Promise#then(callback[, errback)`**

Allows the chaining of promises.

```
function myAsyncAction(num){
    var p = new promise.Promise();
    setTimeout(funciton(){
        p.callback(num);
    }, 50);
    return p.promise();
}

myAsyncAction(1)
    .then(function(num){
        return myAsyncAction(num+1);
    })
    .then(function(num){
        return myAsyncAction(num+1);
    })
    .then(function(num){
        console.log(num); //3
    });

```

Errors are propagated the the nearest error handler, this allows the bubbling of errors up a chain of promises.

```
function myAsyncAction(num){
    var p = new promise.Promise();
    setTimeout(funciton(){
        p.callback(num);
    }, 50);
    return p.promise();
}

myAsyncAction(1)
    .then(function(num){
        throw new Error("oops an error occured");
    })
    .then(function(num){
        return myAsyncAction(num+1);
    })
    .then(
        function(num){
            console.log(num); //3
        },
        function(err){
            console.log(err); //oops an error occured.
        }
    );

```

Of you return a promise from an error handler that resolved successfully then the next promise is the chain will be resolved successfully.

```
function myAsyncAction(num){
    var p = new promise.Promise();
    setTimeout(funciton(){
        p.callback(num);
    }, 50);
    return p.promise();
}

myAsyncAction(1)
    .then(function(num){
        throw new Error("oops an error occured");
    })
    .then(function(num){
        return myAsyncAction(num+1);
    })
    .then(
        function(num){
            console.log(num); //3
        },
        function(err){
            console.log(err); //oops an error occured.
            return asyncAction(10);
        }
    )
    .then(function(num){
        console.log(num); //10
    });

```

**`Promise#both`**

Allows the execution of a function regardless of whether or not a promises is successful.

```

new promise.Promise().errback("error").both(function(){
    //do some more work
}).then(function(){

});

```

**`Promise#resolve`**

The resolve method provides a mechanism to work with node style callbacks and promises.

```javascript

var fs = require("fs");

var myPromise = new promise.Promise();
fs.readFile(__dirname + "/myFile.txt", "utf8", myPromise.resolve);

myPromise.then(function(txt){
    console.log(txt);
});

```

**`Promise#classic`**

Accepts a callback in the typical node style.

```

new promise.Promise()
    .callback("hello")
    .classic(function(err, res){
        console.log(res); //"hello"
    });

```

**`isPromiseLike`**

Determines if an object is like a promise (contains a `.then` function).

```javascript

promise.isPromiseLike({then : function(){}}); //true
promise({then : function(){}}).isPromiseLike(); //true

```


**`promise`**

Creates a new promise.

```javascript
function myAsyncAction(){
    var p = promise.promise();
    setTimeout(funciton(){
        p.callback("hello");
    }, 50);
    return p.promise();
}

myAsyncAction().then(function(hello){
    console.log(hello);
});

```

**`promiseList`**

Creates a new promise.

```javascript
function myAsyncAction(){
    var p = promise.promise();
    setTimeout(funciton(){
        p.callback("hello");
    }, 50);
    return p.promise();
}

promise.promiseList([myAsyncAction(), myAsyncAction()]).then(function(hello){
    console.log(hello); //["hello", "hello"]
});

```

**`defer`**

Creates a new promise.

```javascript
function myAsyncAction(){
    var p = promise.defer();
    setTimeout(funciton(){
        p.callback("hello");
    }, 50);
    return p.promise();
}

myAsyncAction.then(function(hello){
    console.log(hello);
});

```

**`deferredList`**

Creates a new promise.

```javascript
function myAsyncAction(){
    var p = promise.defer();
    setTimeout(funciton(){
        p.callback("hello");
    }, 50);
    return p.promise();
}

promise.deferredList([myAsyncAction(), myAsyncAction()]).then(function(hello){
    console.log(hello); //["hello", "hello"]
});

```

**`resolve`**

Creates a promise that is resolved with the provided value.

```javascript

promise.resolve("hello")
    .then(function(hello){
        console.log(hello); //hello
    });

```

**`reject`**

Creates a promise that is errored with the provided value.

```javascript

promise.reject(new Error("an error occured"))
    .then(function(){
        //not called
    }, function(err){
       console.log(err.stack);
    });

```


**`wrap`**

Wraps traditional node style functions with a promise.

```javascript

var fs = require("fs");
var readFile = promise.wrap(fs.readFile, fs);
readFile(__dirname + "/test.json").then(
    function(buffer){
        console.log(contents);
    },
    function(err){
       console.error(err);
    }
);
```

**`serial`**

Executes a list of items in a serial manner.

If the list contains promises then each promise will be executed in a serial manner.

If the list contains non async items then the next item in the list is called.

**Note** This will not propogate values from one action to another, instead results are passed as an array to the eventual promise.

```javascript

function asyncAction(item, timeout){
    return function(){
        var p = promise.promise();
        setTimeout(function(){
            return p.callback(item);
        }, timeout);
        return p.promise();
    }
};

promise.serial([
    asyncAction(1, 1000),
    asyncAction(2, 900),
    asyncAction(3, 800),
    asyncAction(4, 700),
    asyncAction(5, 600),
    asyncAction(6, 500),
    asyncAction(7, 400),
    asyncAction(8, 300),
    asyncAction(9, 200),
]).then(function(results){
    console.log(results); // [1,2,3,4,5,6,7,8, 9];
});

```


**`chain`**

Allows you to propogate results from one function to another.

This is different than `.serial` in that it propogates results from one promise to the next, where `.serial` does not.

```javascript

function asyncAction(add, timeout) {

     return function (num) {
         num = num || 0;
         var p = promise.promise();
         setTimeout(function () {
              p.callback(num + add);
         }, timeout);
         return p.promise();;
     }
}

promise.chain([
     asyncAction(1, 100),
     asyncAction(2, 100),
     asyncAction(3, 100),
     asyncAction(4, 100),
     asyncAction(5, 100),
]).then(function(results){
     console.log(results); //15
});

```

**`wait`**

Ensures that a promise is resolved before a the function can be run.

For example suppose you have to ensure that you are connected to a database before you execute a function.

```
var findUser = promise.wait(connect(), function findUser(id){
     //this wont execute until we are connected
     return User.findById(id);
});

promise.when(findUser(1), findUser(2)).then(function(users){
    var user1 = users[0], user2 = users[1];
 });

```
