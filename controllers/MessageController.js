const shortId = require("shortid");
const DbController = require("./DbController");

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
    message["from"] = socketId;
    message["createdAt"] = new Date();
    if (message.to && message.message) {
      this.MESSAGES.push(message);
      return {
        ...message,
      };
    }
  }

  /**
   * This function does something with a socket and user ID.
   *
   * @param {string} userId - The ID of the user.
   *
   * @returns {Object} with status, message properties.
   */

  remove(userId) {
    if (!userId) {
      return {
        status: false,
        message: "userId required for delete.",
      };
    }
    const index = this.findUserByUserId(userId);
    if (index !== -1) {
      this.USERS.splice(index, 1);
      this.saveUser();
      return {
        status: true,
        message: "User removed success",
      };
    } else {
      return {
        status: false,
        message: "Invalid userId",
      };
    }
  }

  /**
   * This function does something with a socket and user ID.
   *
   * @returns {Array} An array of objects, each with socketId, userId, and createdAt properties.
   *
   */
  getAll() {
    return this.USERS;
  }

  /**
   * This function does something with a socket and user ID.
   *
   * @param {string} socket.userId - The ID of the user.
   *
   * @returns {number} with index
   */
  findUserByUserId(userId) {
    const userIndex = this.USERS.findIndex((u) => u.userId === userId);
    return userIndex;
  }
}

module.exports = new MessageController();
