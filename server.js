require("dotenv").config();

const { createServer } = require("node:http");
const { join } = require("node:path");
const express = require("express");
const { Server } = require("socket.io");
const USERS = require("./helper/Controller.js");
const {
  SOCKET_USER_CONNECTED,
  SOCKET_USER_DISCONNECTED,
  SOCKET_MESSAGE_SENT,
  SOCKET_MESSAGE_RECEIVE,
  SOCKET_MESSAGE_GET_ALL,
} = require("./helper/Constents.js");

const app = express();
const server = createServer(app);

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public/index.html"));
});

app.get("/api-status", (req, res) => {
  res.json({ status: "Api Working" });
});

// Socket Integration Here

const io = new Server(server);
const users = {};

io.on("connection", (socket) => {
  users[socket.id] = { id: socket.id };
  USERS.add(socket); // New user connected
  socket.emit(SOCKET_USER_CONNECTED, { id: socket.id });

  socket.on("disconnect", () => {
    USERS.remove(socket.id); // Remove User
    socket.emit(SOCKET_USER_DISCONNECTED, { id: socket.id });
  });

  socket.on(SOCKET_MESSAGE_SENT, (msg) => {
    // console.log("Received msg object:", msg);

    let data = JSON.parse(msg);
    const { to, message } = data;

    USERS.addMessage({
      ...data,
      from: to,
      createdAt: new Date(),
      to: socket.id,
    });
    io.to(to).emit(SOCKET_MESSAGE_RECEIVE, {
      from: socket.id,
      to,
      createAt: new Date(),
      message,
    });
  });

  socket.on(SOCKET_MESSAGE_GET_ALL, (msg) => {
    // console.log(msg, SOCKET_MESSAGE_GET_ALL);
    let data = JSON.parse(msg);
    const { user } = data;
    io.to(socket.id).emit(
      SOCKET_MESSAGE_GET_ALL,
      USERS.getAllMessages(socket.id, user)
    );
  });
});

server.listen(process.env.PORT, () => {
  console.log(`App start on localhost:${process.env.PORT}`);
});
