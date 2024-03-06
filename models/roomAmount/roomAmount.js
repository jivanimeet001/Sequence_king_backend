const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    amount: { type: Number },
  },
  {
    timestamps: true,
    versionKey: false,
    autoCreate: true,
  }
);

const newRoomAmount = new mongoose.model(
  "roomAmount",
  roomSchema,
  "roomAmount"
);
module.exports = newRoomAmount;
