var http = require('http'),
    router = require('./router'),
    url = require('url');

var server = http.createServer(function (req, res) {
  if (req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'});
    res.end();
    return;
  }
  var path = url.parse(req.url).pathname;
  console.log(path);
  var currentRoute = router.match(path);
  if (currentRoute) {
    currentRoute.fn(req, res, currentRoute);
    console.log("Route found!");
  }
  else {
    console.log("No route found. :-(");
    res.writeHead(404, {'Status': '404 Not Found'});
    res.end('404: Page not found');
  }
})

server.listen(8087, function (err) {
  if (err) console.log('Doah', err)
  console.log('Woot. A server is running on port 8087')
})
