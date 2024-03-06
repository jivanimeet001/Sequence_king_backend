const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin/admin");

router.post("/login", adminController.adminLogin);

module.exports = router;
