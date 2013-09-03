(function () {
  "use strict";

  var connect = require('connect')
    , cors = require('../lib/connect-cors')
    , server
    ;


  server = connect.createServer(
      function (req, res, next) {
        next();
      }
    , cors({
          origins: ['*']
        , methods: ['HEAD', 'GET'] // No POST
        , headers: ['X-Requested-With', 'Accept'] // No X-HTTP-Method-Override
        , credentials: true // has Credentials
        , resources: [
            {
                pattern: '/'
            //, methods
            //, headers
            //, credentials
            }
          ]
      })
  );

  server.listen('9000');
}());
