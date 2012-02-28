var options = {
  router: {
 //   'pragmatron.org': '127.0.0.1:8888',
    'semtext.org': '127.0.0.1:8080'
  }
};

var proxyServer = httpProxy.createServer(options);
proxyServer.listen(80);
