var async = require("async");
  
  var APIeasy = require('../lib/api-easy/lib/api-easy');
  var assert = require('assert');
  var fs = require('fs');
  var config = require('../config/ConfigDefault').config;
  var Log = require('log'), log = new Log(config.logLevel);
  var querystring = require("querystring");
  
  var suite = APIeasy.describe('Seki API');
  
  var host = config.server['host'];
  var port = config.server['port'];
  // 8081;
  // config.server['port'];
  
  var auth = new Buffer("danja:sasha").toString('base64');
                       
          
  // var callback = sparqlAsk(fs.readFileSync('data/askEntry.rq', 'utf8'), 'false');
  
//  sparqlUpdate(fs.readFileSync('data/deleteEntry.rq', 'utf8'));
// sparqlAsk(fs.readFileSync('data/askEntry.rq', 'utf8'), 'false');
 
  updateAndAsk(fs.readFileSync('data/deleteEntry.rq', 'utf8'), fs.readFileSync('data/askEntry.rq', 'utf8'), 'false');
 
  /*
  async.series([
  function(callback){
      log.debug('\n\n111111111111111111\n\n');
   sparqlUpdate(fs.readFileSync('data/deleteEntry.rq', 'utf8'));
   callback();
  },
  function(callback){
      log.debug('\n\n22222222222222222\n\n');
   sparqlAsk(fs.readFileSync('data/askEntry.rq', 'utf8'), 'false');
  callback();
               },
               function(callback){
                   log.debug('\n\n33333333333333333333333\n\n');
   sparqlUpdate(fs.readFileSync('data/insertEntry.rq', 'utf8'));
  callback();
               },
               function(callback){
                   log.debug('\n\n444444444444444444\n\n');
  // sparqlAsk(fs.readFileSync('data/askEntry.rq', 'utf8'), 'true');
  callback();
               }
  ]);
  */

  function updateAndAsk(data, query,result){
      var updatePath = '/store'+config.client['updateEndpoint'];
      var queryPath = '/store'+config.client['queryEndpoint'];
      var encoded = query.replace("#","%23"); 
      suite
      .discuss('POSTing to '+host+":"+port+updatePath)
      .use(host, port)
      .setHeader('Content-Type', 'application/x-www-form-urlencoded') // 'application/x-www-form-urlencoded'
      .setHeader('Authorization: ', 'Basic '+auth)
      .before( 'setData',  function(outgoing){outgoing.body = "update="+data;}    )
      .post(updatePath, "update="+data) // was  .post(path, "update="+data)
      .expect(200)
      .discuss('GETing at '+host+":"+port+queryPath)
      .use(host, port)
      //    .setHeader('Content-Type', 'application/x-www-form-urlencoded') // 'application/x-www-form-urlencoded'
      .setHeader('Authorization: ', 'Basic '+auth)
      .path(queryPath+"?query="+encoded)
      .get() // 'update='+encoded}
      .expect(200)
      .expect('should respond with '+result+' in body', function (err, res, body) {
          assert.include(body, result);
      })
  

      .export(module);
  }
      
  function sparqlUpdate(data) {
    //  var suite = APIeasy.describe('Seki API');
      var path = '/store'+config.client['updateEndpoint'];
      suite
      .discuss('POSTing to '+host+":"+port+path)
      .use(host, port)
      .setHeader('Content-Type', 'application/x-www-form-urlencoded') // 'application/x-www-form-urlencoded'
      .setHeader('Authorization: ', 'Basic '+auth)
   //   .before( 'setData',  function(outgoing){outgoing.body = "update="+data;}    )
      .post(path, "update="+data) // was  .post(path, "update="+data)
      .expect(200)
      .export(module);
  }
  
  function sparqlAsk(query, result) {
   
      // query = query.replace(/%0D/g,""); // remove carriage returns 
     //  query = query.replace(/%0A/g,""); // remove newlines - Fuseki complains otherwise
      // seki/sparql?query=
      // querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' })

      var encoded = query.replace("#","%23"); // note HACK in ProxyHandler replace('%2523', '%23')
      
     // encoded = querystring.escape(encoded);
      
      log.debug("QUERY = "+query);
      
      var path = '/store'+config.client['queryEndpoint'];
      suite
      .discuss('GETing at '+host+":"+port+path)
      .use(host, port)
  //    .setHeader('Content-Type', 'application/x-www-form-urlencoded') // 'application/x-www-form-urlencoded'
      .setHeader('Authorization: ', 'Basic '+auth)
      .path(path+"?query="+encoded)
      .get() // 'update='+encoded}
      .expect(200)
      .expect('should respond with '+result+' in body', function (err, res, body) {
          assert.include(body, result);
      })
      .export(module);
 
  }

  //.expect('should respond with x-test-header', function (err, res, body) {
  //    log.debug(res.headers);
  //    assert.include(res.headers, 'x-test-header');
  //})
  