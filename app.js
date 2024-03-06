// Third party Modules
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const routes = require("./routes");
const cors = require("cors");
const utils = require("./utils/utils");
var http = require("http");

var app = express();

var socketController = require("./controllers/room/socket");
const adminController = require("./controllers/admin/admin");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

// Routes
app.use("/api/v1/", routes);

// Connect to MongoDb
const connection = async () => {
  await mongoose.connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("mongoDB connected.....");
  await adminController.createAdmin();
  const server = http.createServer(app);
  await socketController(server);
  server.listen(process.env.APP_PORT, async () => {
    console.log(`server started on port: ${process.env.APP_PORT}\n`);
  });
  server.timeout = 120000;
};
connection();
