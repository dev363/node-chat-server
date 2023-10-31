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
}

module.exports = new MessageController();
