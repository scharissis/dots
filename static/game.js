// Boids
var boids = require("boids");
var raf = require("raf");
var socket = io();

// Debounce
function debounce(fn, delay) {
  var timer = null;
  return function () {
    var context = this,
      args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}

socket.on("message", function (data) {
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

var canvas = document.createElement("canvas"),
  ctx = canvas.getContext("2d");

var defaultAttractor = [canvas.height / 2, canvas.width / 2, 750, 0.5];

var flock = boids({
  boids: 100, // The amount of boids to use
  speedLimit: 4, // Max steps to take per tick
  accelerationLimit: 0.5, // Max acceleration per tick
  // separationDistance: 60, // Radius at which boids avoid others
  // alignmentDistance: 180, // Radius at which boids align with others
  // choesionDistance: 180, // Radius at which boids approach others
  //separationForce: 5, // Speed to avoid at
  // alignmentForce: 0.25, // Speed to align with other boids
  cohesionForce: 0.3, // Speed to move towards other boids
  attractors: [defaultAttractor],
});
console.log(flock.attractors);

// document.body.onmousemove = function (e) {
//   var halfHeight = canvas.height / 2,
//     halfWidth = canvas.width / 2;

//   defaultAttractors[0][0] = e.x - halfWidth;
//   defaultAttractors[0][1] = e.y - halfHeight;
// };

window.onresize = debounce(function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}, 100);
window.onresize();
document.body.style.margin = "0";
document.body.style.padding = "0";
document.body.appendChild(canvas);

function drawX(ctx, x, y) {
  ctx.beginPath();

  ctx.moveTo(x - 20, y - 20);
  ctx.lineTo(x + 20, y + 20);

  ctx.moveTo(x + 20, y - 20);
  ctx.lineTo(x - 20, y + 20);
  ctx.stroke();
}

socket.on("state", function (gameState) {
  var players = gameState.players;

  // Update player state in boid sim
  flock.attractors = [];
  flock.attractors = [defaultAttractor];
  for (const pid in players) {
    var p = players[pid];
    var radius = 250;
    var force = 1.1;
    flock.attractors = [defaultAttractor, [p.x, p.y, radius, force]];
  }

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawX(ctx, 0, 0);
  drawX(ctx, canvas.height / 2, canvas.width / 2);

  // Draw boids
  ctx.fillStyle = "#543D5E";
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  flock.tick();

  // dirty hack to keep boids within view
  var boidData = flock.boids;
  var halfHeight = 0; //canvas.height / 2,
  halfWidth = 0; // canvas.width / 2;
  for (var i = 0, l = boidData.length, x, y; i < l; i += 1) {
    x = boidData[i][0];
    y = boidData[i][1];
    // wrap around the screen
    // boidData[i][0] =
    //   x > halfWidth ? -halfWidth : -x > halfWidth ? halfWidth : x;
    // boidData[i][1] =
    //   y > halfHeight ? -halfHeight : -y > halfHeight ? halfHeight : y;
    ctx.fillRect(x + halfWidth, y + halfHeight, 5, 5);
  }

  // Draw players
  ctx.fillStyle = "green";
  for (var id in players) {
    var player = players[id];
    ctx.beginPath();
    ctx.arc(player.x, player.y, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillText(player.id, player.x + 10, player.y + 10);
  }
  ctx.restore();
});

socket.emit("new player");

setInterval(function () {
  socket.emit("movement", movement);
}, 1000 / 60);
