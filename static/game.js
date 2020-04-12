var socket = io();

socket.on("message", function (data) {
  s;
  console.log(data);
});

var movement = {
  up: false,
  down: false,
  left: false,
  right: false,
};

document.addEventListener("keydown", function (event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = true;
      break;
    case 87: // W
      movement.up = true;
      break;
    case 68: // D
      movement.right = true;
      break;
    case 83: // S
      movement.down = true;
      break;
  }
});

document.addEventListener("keyup", function (event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = false;
      break;
    case 87: // W
      movement.up = false;
      break;
    case 68: // D
      movement.right = false;
      break;
    case 83: // S
      movement.down = false;
      break;
  }
});

socket.emit("new player");

setInterval(function () {
  socket.emit("movement", movement);
}, 1000 / 60);

var canvas = document.getElementById("canvas");
canvas.width = 800;
canvas.height = 600;
var ctx = canvas.getContext("2d");

socket.on("state", function (gameState) {
  var players = gameState.players;

  ctx.clearRect(0, 0, 800, 600);
  ctx.fillStyle = "green";
  for (var id in players) {
    var player = players[id];
    ctx.beginPath();
    ctx.arc(player.x, player.y, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillText(player.id, player.x + 10, player.y + 10);
  }
});
