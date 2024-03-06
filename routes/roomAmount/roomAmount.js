const express = require("express");
const router = express.Router();
const amountController = require("../../controllers/roomAmount/roomAmount");
const auth = require("../../middleware/auth");

router.post("/create", auth, amountController.createRoomAmount);

router.put("/update-amount", auth, amountController.updateRoomAmount);

router.get("/get-amount", amountController.getRoomAmount);

router.delete("/delete-amount", auth, amountController.deleteRoomAmount);

module.exports = router;
