const enums = require("../../json/enums.json");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: "You" },
    deviceId: { type: String },
    profileId: { type: Number, default: 0 },
    coins: { type: Number, default: 500 },
    noAds: { type: Number, default: 0 },
    status: {
      name: {
        type: String,
        enum: [
          enums.USER_STATUS.ACTIVE,
          enums.USER_STATUS.BLOCKED,
          enums.USER_STATUS.INACTIVE,
          enums.USER_STATUS.INVITED,
        ],
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    autoCreate: true,
  }
);
const newUser = new mongoose.model("user", userSchema, "user");
module.exports = newUser;
