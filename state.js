class Player {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
  }
}

var state = {
  params: {
    moveSpeed: 5,
  },
  players: {},
};

module.exports = {
  getState: function () {
    return state;
  },
  createNewPlayer: function (id) {
    state.players[id] = new Player(id, 300, 300);
  },
  removePlayer: function (id) {
    delete state.players[id];
  },
  movePlayer: function (id, direction) {
    var player = state.players[id] || {};
    var displacement = state.params.moveSpeed;
    if (direction.left) {
      player.x -= displacement;
    }
    if (direction.up) {
      player.y -= displacement;
    }
    if (direction.right) {
      player.x += displacement;
    }
    if (direction.down) {
      player.y += displacement;
    }
  },
};
