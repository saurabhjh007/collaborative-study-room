import express from "express";

import mongoose from "mongoose";

import cors from "cors";

import dotenv from "dotenv";

import http from "http";

import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";

import roomRoutes from "./routes/roomRoutes.js";

import Message from "./models/Message.js";

dotenv.config();

const app = express();

const server = http.createServer(app);

// SOCKET
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// ACTIVE USERS
let activeUsers = {};

// MIDDLEWARE
app.use(cors());

app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);

app.use("/api/rooms", roomRoutes);

// SOCKET CONNECTION
io.on("connection", (socket) => {

  console.log("User Connected");

  // JOIN ROOM
  socket.on("join_room", async (data) => {

    socket.join(data.roomId);

    activeUsers[socket.id] = {
      username: data.username,
      roomId: data.roomId,
    };

    // SEND OLD MESSAGES
    const messages = await Message.find({
      roomId: data.roomId,
    });

    socket.emit("load_messages", messages);

    // ACTIVE USERS
    const roomUsers = Object.values(
      activeUsers
    ).filter(
      (user) => user.roomId === data.roomId
    );

    io.to(data.roomId).emit(
      "active_users",
      roomUsers
    );

  });

  // SEND MESSAGE
  socket.on("send_message", async (data) => {

    // SAVE TO DATABASE
    await Message.create(data);

    // SEND TO ROOM
    io.to(data.roomId).emit(
      "receive_message",
      data
    );

  });

  // TYPING
  socket.on("typing", (data) => {

    socket.to(data.roomId).emit(
      "show_typing",
      data.username
    );

  });

  // STOP TYPING
  socket.on("stop_typing", (data) => {

    socket.to(data.roomId).emit(
      "hide_typing"
    );

  });

  // DISCONNECT
  socket.on("disconnect", () => {

    const user = activeUsers[socket.id];

    if (user) {

      delete activeUsers[socket.id];

      const roomUsers = Object.values(
        activeUsers
      ).filter(
        (u) => u.roomId === user.roomId
      );

      io.to(user.roomId).emit(
        "active_users",
        roomUsers
      );

    }

  });

});

// DATABASE
mongoose.connect(process.env.MONGO_URI)
.then(() => {

  console.log("MongoDB Connected");

})
.catch((error) => {

  console.log(error);

});

// SERVER
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});