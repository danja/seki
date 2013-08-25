(function () {
  "use strict";

  var connect = require('connect')
    , cors = require('../lib/connect-cors')
    , server
    ;


  server = connect.createServer(
    cors()
  );

  server.listen('9000');
}());
