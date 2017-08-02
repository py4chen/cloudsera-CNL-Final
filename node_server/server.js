var fs = require('fs');
console.log("server start...");
var PeerServer = require('peer').PeerServer;
var server = PeerServer({
        port: 9090, 
        path: '',
        ssl:{
          key: fs.readFileSync('./key/server.key'),
          cert: fs.readFileSync('./key/server.crt')
        }
});
