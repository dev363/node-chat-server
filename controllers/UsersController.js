const shortId = require("shortid");
const DbController = require("./DbController");

class UserController extends DbController {
  constructor() {
    super();
  }

  /**
   * This function does something with a socket and user ID.
   *
   * @param {Object} socket - An object containing the following properties:
   * @param {string} socket.socketId - The ID of the socket.
   * @param {string} socket.userId - The ID of the user.
   *
   * @returns {Object} with socketId, userId, and createdAt, status properties.
   */

  add(msg) {
    let socket = JSON.parse(msg);
    const index = this.findUserByUserId(socket.userId);
    if (index !== -1) {
      this.USERS = [
        ...this.USERS.slice(0, index),
        {
          ...this.USERS[index],
          socketId: socket.socketId,
        },
        ...this.USERS.slice(index + 1),
      ];
      this.saveUser();
      return {
        ...this.USERS[index],
        socketId: socket.socketId,
        status: "updated",
      };
    } else {
      const userId = socket.userId;
      const userObj = {
        socketId: socket.socketId,
        userId,
        createdAt: new Date(),
      };
      this.USERS.push({ ...userObj });
      this.saveUser();
      return { ...userObj, status: "new" };
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

module.exports = new UserController();
