const WebSocket = require("ws");
const HTTPSServer = require('https');
const HTTPServer = require("http");
const fs = require("fs");

var is_socket_io_server = true;
var is_http = true;

var server = null;

if(is_http){
  server = HTTPServer.createServer();
}
else{
  server = HTTPSServer.createServer({
        cert: fs.readFileSync("/Users/krishnasuravarapu/Browserstack/railsApp/certs/local_bsstag_com.crt"),
        key: fs.readFileSync("/Users/krishnasuravarapu/Browserstack/railsApp/certs/local_bsstag_com.key")
    })
}

const socketConfig = {
  // origins: allowedOrigins, -- Removed this line
  pingTimeout: 60000,
  transports: ["websocket"],
}
var wsServer = null;

if (is_socket_io_server){
  wsServer = require('socket.io')(server, socketConfig);
}
else{
  wsServer = new WebSocket.Server({
    server: server
  });
}

wsServer.on("connection", (socket) => {
  if(is_socket_io_server){
    console.log("client connected")
  }
  else{
    console.log("client connected")
  }

  socket.on("message", function(data) {
    if(is_socket_io_server){
      console.log(`received message via ${socket.conn.transport.name}`);
      socket.emit("text", `pong ${socket.conn.transport.name}`);
    }
    else{
      console.log(`received message`);
      socket.send("pong websocket");
    }
    
  });

  socket.on("disconnect", function(data) {
    console.log("disconnecting");
  });

  socket.on("close", function(data) {
    socket.send("close");
    console.log("close");
  });

  socket.onerror = function (data) {
    console.log(data)
  }
});
server.listen(8080);