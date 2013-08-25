Connect CORS
====

v0.5.0

A CORS module for Node.JS's Connect


"pre-flighted" OPTIONS requests are supported


Installation
===

Current Version:

    npm install connect-xcors

Antono's original (different API):

    npm install connect-cors

Usage
===


    var Connect = require('connect')
      , CORS = require('connect-xcors')
    //, CORS = require('connect-cors') // Antono's original
      , options = {}
      , server
      ;
     
    server = Connect.createServer(
        // uses reasonable defaults when no options are given
        CORS(options)
      , function(req, res) {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Hello World');
        }
    );

    // the `options` object will be popullated with empty arrays
    // and is live-editable (great for testing and dynamic APIs)
    console.log(options);

    server.listen(9000);

**Known Issues**

  * "pre-flighted" OPTIONS requests and "actual" requests are treated the same. This doesn't seem to have any adverse affects, it just wastes bytes.


Options
===

These are the default options when no options are specified.

The options are hot-editable. You can dynamically add origins, resources, etc.

    var options = {
            origins: []                       // implicit same as ['*'], and null
          , methods: ['HEAD', 'GET', 'POST']  // OPTIONS is always allowed
          , headers: [                        // both `Exposed` and `Allowed` headers
                'X-Requested-With'
              , 'X-HTTP-Method-Override'
              , 'Content-Type'
              , 'Accept'
            ]
          , credentials: false                // don't allow Credentials
          , resources: [
              {
                  pattern: '/'                // a string prefix or RegExp
              //, origins
              //, methods
              //, headers
              //, credentials
              }
            ]
        };


Explanation
---

By default the defaults will be used.

If the top-level options are present, they will be used for any resource which does not specify its own

Resource-level directives override top-level directives

origins
---

an array of origins. `undefined`, `null`, `[]`, and `['*']` will all default to '*'

  * Example: `['http://example.com', 'http://domain.tld']`
  * Browsers will see their origin exactly `Access-Control-Allow-Origin: http://example.com` (even if ['*'] is used)
  * MSIE will see `Access-Control-Allow-Origin: *`, for the allowed origins. (`withCredentials` is broken in MSIE)

methods
---

any HTTP verb will do

headers
---

used for both `Access-Control-Exposed-Headers` and `Access-Contral-Allowed-Headers`

  * TODO make those separate


credentials
---

allows XHR2 clients to sepecify `withCredentials = true`, which will send `Cookies` and `HTTP Basic Auth`

  * broken for XDR in MSIE

resources
---

an array of "directive" objects

pattern
---

  * pattern (string prefix) - '/path/to' will match '/path/too...', '/path/to/res...', but NOT '/some/path/to...'
  * pattern (RegExp) - use your own regex matching (to your own peril)
    * Please see [http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex/6969486#6969486](Escape string for use in Javascript regex) to avoid ugly bugs when creating dynamic regex for paths

Tests
===

See the /test folder. There are some example servers and some basic tests.

License 
===

(The MIT License)

Copyright (c) 2010 Antono Vasiljev

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
