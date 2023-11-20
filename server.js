require("dotenv").config();

const { createServer } = require("node:http");
const { join } = require("node:path");
const shortId = require("shortid");
const express = require("express");
const { Server } = require("socket.io");
// const __Controller__ = require("./controllers/Controller.js");
const __USER__ = require("./controllers/UsersController.js");
const __MESSAGE__ = require("./controllers/MessageController.js");
const {
  SOCKET_USER_CONNECTED,
  SOCKET_USER_DISCONNECTED,
  SOCKET_MESSAGE_SENT,
  SOCKET_MESSAGE_RECEIVE,
  SOCKET_MESSAGE_GET_ALL,
  SOCKET_GROUP_GET_ALL_ROOMS,
  SOCKET_GROUP_SENT_ALL_ROOMS,
  SOCKET_GROUP_SENT_ALL_USERS,
  SOCKET_GROUP_CREATE,
  SOCKET_GROUP_JOIN,
  SOCKET_GROUP_GET_ALL_USERS,
  SOCKET_GROUP_CREATE_DONE,
  SOCKET_CONNECTED,
  SOCKET_USER_CONNECTED_SUCCESS,
  SOCKET_USER_REMOVE,
  SOCKET_USER_REMOVE_SUCCESS,
  SOCKET_MESSAGE_RECEIVE_ERROR,
} = require("./controllers/Constents.js");

const app = express();
const server = createServer(app);

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public/index.html"));
});

app.get("/api-status", (req, res) => {
  res.json({ status: "Api Working" });
});

// Socket Integration Here

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["authToken"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.emit(SOCKET_CONNECTED, { id: socket.id });

  socket.on("disconnect", () => {
    socket.emit(SOCKET_USER_DISCONNECTED, { id: socket.id });
    const user = __USER__.removeBySocketId(socket.id); // New user connected
  });

  // ##########################################################
  // ################### USER ACTIONS #########################
  // ##########################################################

  // Call on User Connected
  socket.on(SOCKET_USER_CONNECTED, (data) => {
    const user = __USER__.add(data, socket); // New user connected
    console.log(user, "i m ");
    socket.emit(SOCKET_USER_CONNECTED_SUCCESS, user);
  });

  // Call on User Delete
  socket.on(SOCKET_USER_REMOVE, (userId) => {
    const user = __USER__.remove(userId); // New user connected
    socket.emit(SOCKET_USER_REMOVE_SUCCESS, user);
  });

  // ##########################################################
  // ################### MESSAGE ACTIONS #########################
  // ##########################################################

  //  User Message sent
  socket.on(SOCKET_MESSAGE_SENT, (msg) => {
    const message = __MESSAGE__.add(msg, socket.id);
    console.log(message, 88833);
    if (message.toSocketId) {
      console.log("009900");
      io.to(message.toSocketId).emit(SOCKET_MESSAGE_RECEIVE, message);
    } else {
      socket.emit(SOCKET_MESSAGE_RECEIVE_ERROR, message);
    }
  });
});

server.listen(process.env.PORT, () => {
  console.log(`App start on localhost:${process.env.PORT}`);
});
