const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    amount: { type: Number },
    player1: { type: String, default: null },
    player2: { type: String, default: null },
    socketId: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
    autoCreate: true,
  }
);

const newRoomSchema = new mongoose.model("room", roomSchema, "room");
module.exports = newRoomSchema;
