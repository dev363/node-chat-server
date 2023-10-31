const shortId = require("shortid");
const DbController = require("./DbController");
const DataBase = require("../database/db.js");
const __TABLES__ = require("./Constents.js")["__TABLES__"];

class MessageController extends DbController {
  constructor() {
    super();
  }

  /**
   * This function does something with a socket and user ID.
   *
   * @param {Object} msg - An object containing message data.
   * @param {string} socketId - The ID of the socket to associate with the message.
   *
   * @returns {Object} with socketId, userId, and createdAt, status properties.
   */

  add(msg, socketId) {
    let message = JSON.parse(msg);
    this.getLatestDataBase();
    console.log(this.USERS, "Add message");
    const toSocketId = this.findUserSocketId(message.to); // Get receiver socket id
    const fromSocketId = socketId || this.findUserSocketId(message.from); // Get sender user id

    message["from"] = message.from;
    message["createdAt"] = new Date();

    if (!toSocketId) {
      return {
        status: false,
        message: "Reciver user not found | to is invalid",
      };
    }
    if (message.to && message.message) {
      this.MESSAGES.push(message);
      return {
        ...message,
        toSocketId,
        fromSocketId,
      };
    }
  }

  /**
   * This function Get Latest databse data and Store to Class State
   *
   * @param  - No
   *
   * @returns - No
   */
  getLatestDataBase() {
    this.USERS = DataBase.readData(__TABLES__.user) || [];
    this.MESSAGES = DataBase.readData(__TABLES__.messages) || [];
    this.ROOMS = DataBase.readData(__TABLES__.rooms) || {};
  }

  /**
   * This function does something with a socket and user ID.
   *
   * @param {string} userId - The ID of the user.
   *
   * @returns {string} with index
   */
  findUserSocketId(userId) {
    const user = this.USERS.find((u) => u.userId === userId);
    console.log(userId, user, "i m findUserSocketId");
    return user?.socketId || false;
  }

  /**
   * This function does something with a socket and user ID.
   *
   * @param {string} socketId - The ID of the user.
   *
   * @returns {string} with index
   */
  findUserId(socketId) {
    const user = this.USERS.find((u) => u.socketId === socketId);
    return user?.userId || false;
  }
}

module.exports = new MessageController();
