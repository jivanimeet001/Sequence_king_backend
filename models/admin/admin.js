const mongoose = require("mongoose");

// Create a schema for Database
const adminSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: {
      type: String,
    },
    deviceId: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false, autoCreate: true }
);

// Export

module.exports = admin = mongoose.model("admin", adminSchema, "admin");
