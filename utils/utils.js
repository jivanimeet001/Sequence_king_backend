require("dotenv").config();
const messages = require("../json/messages.json");
const adminSchema = require("../models/admin/admin");

module.exports = {
  validateAdmin: async (data) => {
    const deviceId = data.deviceId;
    const adminData = await adminSchema.findOne({ deviceId: deviceId });

    if (!adminData) {
      const object = {
        success: false,
        message: messages.ADMIN_NOT_FOUND,
      };
      return object;
    } else {
      const object = {
        success: true,
        data: adminData.deviceId,
      };
      return object;
    }
  },
};
