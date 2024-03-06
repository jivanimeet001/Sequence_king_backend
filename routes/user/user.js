const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user/user");
const auth = require("../../middleware/auth");

router.post("/create", userController.createUser);

router.put("/update-user", auth, userController.updateUser);

router.put("/update-status", auth, userController.activeDeactiveUser);

router.get("/get-user", auth, userController.getUser);

router.get("/get-all-user", auth, userController.getAllUsers);

router.delete("/delete-user", auth, userController.deleteUser);

module.exports = router;
