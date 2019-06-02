var http = require('http');
var serve = require('serve-static')('./');

var server = http.createServer(function(req, res){
  serve(req, res, function(){res.end();});

}).listen(3000);

console.log('localhost:3000');