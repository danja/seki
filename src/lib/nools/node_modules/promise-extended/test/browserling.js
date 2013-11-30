var it = require("it");

it.reporter("tap");

require("./promise-extended.test");

it.run();