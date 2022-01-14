var http = require('http');
var upper = require('upper-case');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(upper.upperCase('Hello World!'));
  res.end();
}).listen(2020);
