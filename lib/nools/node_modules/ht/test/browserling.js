var it = require("it");

it.reporter("tap");
require("./ht.test.js");
it.run();