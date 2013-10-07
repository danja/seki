var it = require("it");

it.reporter("tap");

require("./AnderssonTree.test");
require("./AVLTree.test");
require("./BinaryTree.test");
require("./RedBlackTree.test");
require("./Tree.test");


it.run();