var http = require('http'),
    httpProxy = require('http-proxy');

var options = {
  router: {
//	  'dannyayers.com': '127.0.0.1:8001',
 // 'hyperdata.org': '67.207.128.128:80',	  
 //   'pragmatron.org': '127.0.0.1:8000',
    'semtext.org': '127.0.0.1:8005'
  }
};

var proxyServer = httpProxy.createServer(options);


proxyServer.listen('67.207.128.128',8888);

http.createServer(function (req, res) {
	  res.writeHead(200, { 'Content-Type': 'text/plain' });
	  res.write('request successfully proxied: ' + req.url +'\n' + JSON.stringify(req.headers, true, 2));
	  res.end();
	}).listen('67.207.128.128', 9000); 