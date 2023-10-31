const DataBase = require("../database/db.js");

const __TABLES__ = {
  user: "users.json",
  messages: "messages.json",
};

function Controller() {
  this.USERS = {};
  this.MESSAGES = [];

  this.saveUser = function () {
    DataBase.saveData(__TABLES__.user, this.USERS);
  };
  this.saveMessage = function () {
    DataBase.saveData(__TABLES__.messages, this.MESSAGES);
  };
}

Controller.prototype.add = function (socket) {
  if (!this.USERS[socket.id]) {
    this.USERS[socket.id] = {
      id: socket.id,
    };
    this.saveUser();
  }
};

Controller.prototype.remove = function (id) {
  if (this.USERS[id]) {
    delete this.USERS[id];
    this.saveUser();
  }
};

Controller.prototype.addMessage = function (message) {
  this.MESSAGES.push(message);
  this.saveMessage();
};

Controller.prototype.getAllMessages = function (id, user) {
  console.log(this.MESSAGES, 8888);
  return this.MESSAGES.filter(
    (msg) =>
      (msg.from === id || msg.to === id) &&
      (msg.from === user || msg.to === user)
  );
};

module.exports = new Controller();
