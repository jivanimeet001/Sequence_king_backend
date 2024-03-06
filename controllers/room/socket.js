const roomController = require("../../controllers/room/room");

module.exports = (server) => {
  console.log("Socket.io server started");
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });

  io.use((socket, next) => {
    console.log(`${JSON.stringify(socket.handshake.time)}`);
    next();
  });

  //connect to socket
  io.on("connection", async (socket) => {
    socket.on("enter-room", async (data) => {
      const token = socket.handshake.headers.token;
      const response = await roomController.createRoom(token, data, socket.id);

      socket.join(response?.data._id);
      socket.io.in(response?.data._id).emit("broadcast", response);

      //onchipput for broadcasting to room
      socket.on("onChipsPut", async (data) => {
        // await socket.broadcast.to(response?.data._id).emit("broadcast", data);
        await io.in(response?.data._id).emit("broadcast", data);
      });

      //leave room event
      socket.on("disconnect-room", async (data) => {
        socket.leave(response?.data._id);
        await roomController.discardRoom(response);
        await roomController.winUser(response, data);
        await io.in(response?.data._id).emit("broadcast", data);
      });

      //user win event
      socket.on("user-win", async (data) => {
        await roomController.winUser(response, data);
        await roomController.discardRoom(response);
        await io.in(response?.data._id).emit("broadcast", response);
      });

      //discard room event
      socket.on("discard-room", async (data) => {
        await roomController.discardRoom(response);
        await io.in(response?.data._id).emit("broadcast", data);
      });

      socket.on("re-match", async (data) => {
        await roomController.reMatch(response, data);
        await io.in(response?.data._id).emit("broadcast", response);
      });
    });
  });
};
