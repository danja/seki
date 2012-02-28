var http = require('http'),
    httpProxy = require('http-proxy');

var options = {
  router: {
//	  'dannyayers.com': '127.0.0.1:8000',
//	  'hyperdata.org': '127.0.0.1:8000',	  
 //   'pragmatron.org': '127.0.0.1:8000',
    'dannyayers.com': '127.0.0.1:8080'
  }
};

var proxyServer = httpProxy.createServer(options);


proxyServer.listen("67.207.128.128", 8088);
