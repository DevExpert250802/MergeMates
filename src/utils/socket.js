const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

// Function to generate a unique room ID based on user IDs
const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ username, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(username + " joined Room : " + roomId);
      socket.join(roomId);
    });

    // Handle sending a message
    socket.on(
      "sendMessage",
      async ({ username, lastName, userId, targetUserId, text, profilepic }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(username + " " + text);

          // TODO: Check if userId & targetUserId are friends
          const connection = await ConnectionRequest.findOne({
            $or: [
              { fromUserId: userId, toUserId: targetUserId },
              { fromUserId: targetUserId, toUserId: userId },
            ],
            status: "accepted",
          });
    
          if (!connection) {
            console.error("Users are not friends. Message will not be sent.");
            return;
          }


          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();

          io.to(roomId).emit("messageReceived", { 
            username, 
            lastName, 
            text, 
            profilepic
          });
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    );

    // Handle disconnection
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
