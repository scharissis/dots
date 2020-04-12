// Dependencies
var express = require("express");
var http = require("http");
var path = require("path");
var socketIO = require("socket.io");
var state = require("./state.js");

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set("port", 5000);
app.use(express.static("static"));

// Routing
app.get("/", function (request, response) {
  response.sendFile(path.join(__dirname, "index.html"));
});

// Starts the server.
server.listen(5000, function () {
  console.log("Starting server on port 5000");
});

// Attach websocket handlers.
var gameState = state.getState();
io.on("connection", function (socket) {
  var playerID = socket.id;

  socket.on("new player", function () {
    state.createNewPlayer(playerID);
    console.log("Player", playerID, "joined!");
  });

  socket.on("movement", function (direction) {
    state.movePlayer(playerID, direction);
  });

  socket.on("disconnect", function () {
    state.removePlayer(playerID);
    console.log("Player", playerID, "disconnected!");
  });
});

// Broadcast the game state.
setInterval(function () {
  io.sockets.emit("state", gameState);
}, 1000 / 60);
