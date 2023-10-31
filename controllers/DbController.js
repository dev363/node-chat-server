const shortId = require("shortid");
const DataBase = require("../database/db.js");

const __TABLES__ = require("./Constents.js")["__TABLES__"];

class Controller {
  constructor() {
    this.USERS = DataBase.readData(__TABLES__.user) || [];
    this.MESSAGES = DataBase.readData(__TABLES__.messages) || [];
    this.ROOMS = DataBase.readData(__TABLES__.rooms) || {};
  }
  saveUser = function () {
    DataBase.saveData(__TABLES__.user, this.USERS);
  };
  saveMessage = function () {
    DataBase.saveData(__TABLES__.messages, this.MESSAGES);
  };

  saveRooms = function () {
    DataBase.saveData(__TABLES__.rooms, this.ROOMS);
  };
}

Controller.prototype.addMessage = function (message) {
  const messageId = shortId.generate();
  this.MESSAGES.push({ ...message, messageId });
  this.saveMessage();
};

Controller.prototype.getAllMessages = function (id, user) {
  return this.MESSAGES.filter(
    (msg) =>
      (msg.from === id || msg.to === id) &&
      (msg.from === user || msg.to === user)
  );
};

Controller.prototype.createGroup = function (data) {
  const groupId = shortId.generate();
  this.ROOMS[groupId] = {
    ...data,
    groupId,
    createdAt: new Date(),
  };
  this.saveRooms();
  return this.ROOMS[groupId];
};

// module.exports = { Controller };
module.exports = Controller;
