const enums = require("../json/enums.json");
const messages = require("../json/messages.json");
const userSchema = require("../models/user/user");
const adminSchema = require("../models/admin/admin");

module.exports = async (req, res, next) => {
  const deviceId = req.header("token");
  try {
    const userData = await userSchema.findOne({ deviceId: deviceId });
    if (!userData) {
      const adminData = await adminSchema.findOne({ deviceId: deviceId });
      if (adminData) {
        req.user = adminData;
        next();
      } else {
        return res.status(enums.HTTP_CODES.NOT_FOUND).json({
          success: false,
          message: messages.USER_NOT_FOUND,
        });
      }
    } else {
      req.user = userData;
      next();
    }
  } catch (e) {
    return res
      .status(enums.HTTP_CODES.BAD_REQUEST)
      .json({ success: false, message: e.message });
  }
};
