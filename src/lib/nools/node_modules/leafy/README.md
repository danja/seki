[![Build Status](https://travis-ci.org/doug-martin/leafy.png?branch=master)](https://travis-ci.org/doug-martin/leafy)

[![browser support](http://ci.testling.com/doug-martin/leafy.png)](http://ci.testling.com/doug-martin/leafy)

# Leafy

`leafy` is a library of different tree implementations. `leafy` can be used in both the browser and node.

Why would I need a tree in javascript? I have arrays and objects.

Good question!

The driving reason behind the creation of `leafy` was the library [`nools`](https://github.com/C2FO/nools) which needed a datastructure that was

 * fast
 * maintained order
 * could have items inserted into it without having to re-sort the entire structure.

This was needed in order to maintain a real time list of rule activations without having to search or sort the actions on insertion.

Often a tree is overkill but when you need one its good to know its out there.

## Installation

```
npm install leafy
```

Or [download the source](https://raw.github.com/doug-martin/leafy/master/index.js) ([minified](https://raw.github.com/doug-martin/leafy/master/leafy.min.js))

**Note** `leafy` depends on [`declare.js`](https://github.com/doug-martin/declare.js), [`extended`](https://github.com/doug-martin/extended), [`is-extended`](https://github.com/doug-martin/is-extended), [`string-extended`](https://github.com/doug-martin/extended), and [`array-extended`](https://github.com/doug-martin/array-extended)


## Usage

`leafy` contains the following tree implementations.

 * [`AVLTree`](http://en.wikipedia.org/wiki/AVL_tree)
 * [`RedBlackTree`](http://en.wikipedia.org/wiki/Red%E2%80%93black_tree)
 * [`BinaryTree`](http://en.wikipedia.org/wiki/Binary_tree)
 * [`AnderssonTree`](http://en.wikipedia.org/wiki/AA_tree)

**`options`**

When creating a tree you can specify a compare function used to sort items as they are inserted or removed.

```javscript
var tree = new leafy.AVLTree({
   compare : function(a, b){
       var ret = 0;
       if (a.type > b.type) {
           ret = 1;
       } else if (a.type < b.type) {
           ret = -1;
       }
       return ret;
   }
});
```

By default the tree uses a natural ordering function.

```javascript
function compare(a, b) {
   var ret = 0;
   if (a > b) {
       return 1;
   } else if (a < b) {
       return -1;
   } else if (!b) {
       return 1;
   }
   return ret;
}
```

Each tree contains the following functions.

**`insert`**

Insert an item into an the tree.

```javascript
tree.insert("a");
tree.insert("b");
tree.insert("c");
tree.insert("aa");
```

**`remove`**

Remove an item from a tree.

```
tree.remove("a");
tree.remove("c");
```

**`clear`**

Remove all items from a tree.

```javascript

tree.insert("a");
tree.insert("b");
tree.insert("c");
tree.insert("aa");

tree.clear();

```

**`isEmpty`**

Returns a boolean indicating if the tree is currently empty.

```
tree.insert("a");
tree.insert("b");
tree.insert("c");
tree.insert("aa");

tree.isEmpty(); //false

tree.clear();

tree.isEmpty(); //true
```

**`contains`**

Test if a tree contains a particular value.

```javascript
tree.insert("a");
tree.insert("b");
tree.insert("c");

tree.contains("a"); //true
tree.contains("d"); //false
```

**`toArray([order=leafy.IN_ORDER]);

Coverts a tree to an array with the values in the order specified, or in order if not specified

```javascript
tree.insert("a");
tree.insert("b");
tree.insert("c");

tree.toArray(); //["a", "b", "c", "d"]
tree.toArray(leafy.REVERSE_ORDER); //["d", "c", "b", "a"]
```

**`forEach(iterator(iterator[, scope[, order=leafy.IN_ORDER]])`**

Loop through the items in tree.

By default the tree will loop through items in order.

```javascript
tree.insert("a");
tree.insert("b");
tree.insert("c");
tree.insert("aa");

tree.forEach(function(item, tree){
    console.log(item); //"a", "b", "c", "d" respectively
});
```

You can loop through a tree in any order you wish by specifying any of the following orders.

* `leafy.REVERSE_ORDER`
* `leafy.IN_ORDER`
* `leafy.POST_ORDER`
* `leafy.PRE_ORDER`

```javascript

tree.forEach(function(item, tree){
    console.log(item); //"d", "c", "b", "a" respectively
}, null, leafy.REVERSE_ORDER);

```


**`map(iterator[, scope[, order=leafy.IN_ORDER]])`**

Map is very similar to the array counter part except that it returns new tree with the mapped values.

```javascript
//creates a new tree with the returned values "aa", "bb", "cc", "dd"
var mapped = tree.map(function(item, tree){
    return item + item;
});

```

**`filter(iterator[, scope[, order=leafy.IN_ORDER]])`**

Filter is very similar to the array counter part except that it returns new tree with the mapped values.

```javascript
//creates a new tree with the returned values "a", "b"
var mapped = tree.map(function(item, tree){
    return item === "a" || item === "b";
});

```

### Other iterator methods.

Trees also contains the following array methods that act just like their array counter part.

**Note** all of these methods accept an order parameter.

* `reduce`
* `reduceRight`
* `every`
* `some`

**`findLessThan(value[, exclusive=true])`**

Find all values in a tree less than a particular value. If exclusive is set to false then the original value will be included in the resulting array.

```javascript
tree.insert("a");
tree.insert("b");
tree.insert("c");
tree.insert("d");

tree.findLessThan("d"); //["a", "b", "c"];
tree.findLessThan("d", false); //["a", "b", "c", "d"];

```

**`findGreaterThan(value[, exclusive=true])`**

Find all values in a tree greater than a particular value. If exclusive is set to false then the original value will be included in the resulting array.

```javascript
tree.insert("a");
tree.insert("b");
tree.insert("c");
tree.insert("d");

tree.findGreaterThan("a"); //["d", "c", "b"];
tree.findGreaterThan("a", false); //["d", "c", "b", "a"];

```

**`print()`**

Prints the current structure of a tree to the console.






