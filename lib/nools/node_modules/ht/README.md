[![Build Status](https://travis-ci.org/doug-martin/ht.png?branch=master)](https://travis-ci.org/doug-martin/ht)

[![browser support](http://ci.testling.com/doug-martin/ht.png)](http://ci.testling.com/doug-martin/ht)

# ht

`ht` is a HashTable implementation in javascript that can be used in both node and the browser.

## Installation

```
npm install ht
```

Or [download the source](https://raw.github.com/doug-martin/ht/master/index.js) ([minified](https://raw.github.com/doug-martin/ht/master/ht.min.js))

**Note** `ht` depends on [`declare.js`](https://github.com/doug-martin/declare.js), [`extended`](https://github.com/doug-martin/extended), [`is-extended`](https://github.com/doug-martin/is-extended), and [`array-extended`](https://github.com/doug-martin/array-extended)

## Usage

To create a new HashTable

```javascript
var Ht = require("ht");
var ht = new Ht();
```

**`put(key, value)`**

Adds a new key value pair to the hash table, ht supports any value as a key.

```javascript
var key = {}, key2 = {};
ht.put(key, "value1");
ht.put(key2, "value2");

ht.get(key); //"value1";
ht.get(key2); //"value2";
```

If your key contains a `hashCode`, function then that will be used to put the key value pair into the hash table.

```javascript
function Person(first, last){
    this.firstName = first;
    this.lastName = last;
}

Person.prototype.hashCode = function(){
    return this.firstName + this.lastName;
}

ht.put(new Person("bob", "yukon"), "this is bob");
ht.put(new Person("sally", "yukon"), "this is sally");

ht.get(new Person("bob", "yukon")); //"this is bob"

```


**`get(key)`**

Get a a value based on the key.

```javascript
ht.put(new Date(2013, 1, 22), "value1");
ht.put(new Date(2013, 1, 23), "value2");

ht.get(new Date(2013, 1, 22)); //"value1";
ht.get(new Date(2013, 1, 23); //"value2";
```

**`set(key)`**

Set a a value based on the key.

```javascript
ht.put(new Date(2013, 1, 22), "value1");
ht.put(new Date(2013, 1, 23), "value2");

ht.get(new Date(2013, 1, 22)); //"value1";
ht.get(new Date(2013, 1, 23); //"value2";

ht.set(new Date(2013, 1, 22), "new value1");
ht.set(new Date(2013, 1, 23), "new value2");

ht.get(new Date(2013, 1, 22)); //"new value1";
ht.get(new Date(2013, 1, 23); //"new value2";

```

**`remove(key)`**

Removes a key value pair.

```javascript
ht.put(new Date(2013, 1, 22), "value1");
ht.put(new Date(2013, 1, 23), "value2");

ht.get(new Date(2013, 1, 22)); //"value1";
ht.get(new Date(2013, 1, 23); //"value2";

ht.remove(new Date(2013, 1, 22)); //"value1";
ht.remove(new Date(2013, 1, 23); //"value2";

ht.get(new Date(2013, 1, 22)); //null;
ht.get(new Date(2013, 1, 23); //null";
```

**`contains(key)`**

Returns true or false if the table does or does not contain a given key value pair.

```javascript

ht.put(new Date(2013, 1, 22), "value1");
ht.put(new Date(2013, 1, 23), "value2");

ht.contains(new Date(2013, 1, 22)); //true;
ht.contains(new Date(2013, 1, 23); //true;

```

**`concat(hashTable`**

Concats two hash tables together into a new one.

```javascript

var ht1 = new Ht(), ht2 = new Ht();

ht1.put(new Date(2013, 1, 22), "value1");
ht1.put(new Date(2013, 1, 23), "value2");

var key = {}, key2 = {};
ht2.put(key, "value1");
ht2.put(key2, "value2");

var ht3 = ht1.concat(ht2);

ht3.contains(key); //true
ht3.contains(key2); //true
ht1.contains(new Date(2013, 1, 22)); //true
ht1.contains(new Date(2013, 1, 23)); //true
```

**`clear`**

Clear all items from the hash table

```javascript
ht.put("key1", "value1");
ht.put("key2", "value2");

ht.clear();

ht.contains("key1"); //false
ht.contains("key2"); //false

```

**`keys`**

Returns an array of all keys in the table.

```javascript
ht.put("key1", "value1");
ht.put("key2", "value2");

ht.keys(); //["key1", "key2"]

```

**`values`**

Gets all values in the hash table.

```javascript
ht.put("key1", "value1");
ht.put("key2", "value2");

ht.values(); //["value1", "value2"]

```

**`entrySet`**

Returns an array of all key value pairs in the table.

```javascript
ht.put("key1", "value1");
ht.put("key2", "value2");

ht.entrySet(); //[{key: "key1", value: "value1"}, {key: "key2", value: "value2"}]

```

**`isEmpty`**

Returns true if the table contains any values, false otherwise.

```javascript

var ht = new Ht();

ht.isEmpty(); //true

ht.put("key1", "value1");
ht.put("key2", "value2");

ht.isEmpty(); //false
```

### Array methods.

Each hash table contains the following array like methods.

**Note** each method will pass a key and value to the iterator instead of a value and index.

```javascript

ht.put("key1", "value1");
ht.put("key2", "value2");

ht.forEach(function(key, value){
    console.log(key + " : " + value);
});


```

* `forEach`
* `filter`
* `map`
* `every`
* `some`
* `reduce`
* `reduceRight`
