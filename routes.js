const express = require("express");
const app = express();

const admin = require("./routes/admin/admin");
const user = require("./routes/user/user");
const roomAmount = require("./routes/roomAmount/roomAmount");

app.use("/admin", admin);
app.use("/user", user);
app.use("/room-amount", roomAmount);

module.exports = app;
