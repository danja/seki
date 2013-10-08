
  
  var APIeasy = require('../lib/api-easy/lib/api-easy');
  var assert = require('assert');
  var fs = require('fs');
  var config = require('../config/ConfigDefault').config;
  var Log = require('log'), log = new Log(config.logLevel);
  var querystring = require("querystring");

  
  var suite = APIeasy.describe('Seki API');
  
  var data = fs.readFileSync('data/insertEntry.rq', 'utf8');
  // console.log("DATA ="+data);
  var encoded = querystring.stringify(data);
  
  var host = config.server['host'];
  var port = config.server['port'];
  // 8081;
  // config.server['port'];
  var path = '/store'+config.client['updateEndpoint'];
  
  var auth = new Buffer("danja:sasha").toString('base64');
 
  // data = "{'data' : 'DATA'}";
  
  // NEEDS A CHECK/DELETE FIRST
  
  // insert an entry into remote store
  suite.discuss('When using your awesome API')
  .discuss('POSTing to '+host+":"+port+path)
  .use(host, port)
  .setHeader('Content-Type', 'application/x-www-form-urlencoded') // 'application/x-www-form-urlencoded'
  .setHeader('Authorization: ', 'Basic '+auth)
  .post(path, "update="+data) // 'update='+encoded}
  .expect(200)
  //.expect('should respond with x-test-header', function (err, res, body) {
  //    log.debug(res.headers);
  //    assert.include(res.headers, 'x-test-header');
  //})
      .export(module);