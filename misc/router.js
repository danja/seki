var http = require('http'),
    httpProxy = require('http-proxy');

var options = {
  router: {
    'dannyayers.com': '67.207.128.128:8005',
    'danny.ayers.name': '67.207.128.128:8005',
    'hyperdata.org': '67.207.128.128:8005',
    'ideagraph.org': '67.207.128.128:8005',
    'semtext.org': '67.207.128.128:8005',
    'spikeandwave.com': '67.207.128.128:8005',
    'pragmatron.org': '67.207.128.128:8888'
  }
};

var proxyServer = httpProxy.createServer(80, '67.207.128.128', options);
proxyServer.listen();

// http.createServer(function (req, res) {
//	  res.writeHead(200, { 'Content-Type': 'text/plain' });
//	  res.write('request successfully proxied: ' + req.url +'\n' + JSON.stringify(req.headers, true, 2));
//	  res.end();
//	}).listen(9000); 