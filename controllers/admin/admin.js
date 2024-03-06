const enums = require("../../json/enums.json");
const messages = require("../../json/messages.json");
const adminSchema = require("../../models/admin/admin");
const bcrypt = require("bcryptjs");

module.exports = {
  createAdmin: async (req, res) => {
    try {
      const existAdmin = await adminSchema.findOne({
        email: process.env.ADMIN_EMAIL,
      });
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
      const deviceId = await bcrypt.hash(process.env.ADMIN_DEVICE_ID, salt);
      if (!existAdmin) {
        const object = {
          firstName: process.env.ADMIN_FIRST_NAME,
          lastName: process.env.ADMIN_LAST_NAME,
          email: process.env.ADMIN_EMAIL,
          deviceId: deviceId,
          password: password,
        };

        const newAdmin = new adminSchema(object);
        await newAdmin.save();
      } else {
        console.log("Admin already exist...");
      }
    } catch (error) {
      return error;
    }
  },

  adminLogin: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(enums.HTTP_CODES.VALIDATION_ERROR).json({
        success: false,
        message: messages.NO_EMAIL_AND_PASSWORD_FOUND,
      });
    }

    try {
      const admin = await adminSchema.findOne({ email: email });
      if (!admin) {
        return res.status(enums.HTTP_CODES.UNAUTHORIZED).json({
          success: false,
          message: messages.ADMIN_NOT_FOUND,
        });
      }
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(enums.HTTP_CODES.UNAUTHORIZED).json({
          success: false,
          message: messages.WRONG_ADMIN_PASSWORD,
        });
      }
      return res.status(enums.HTTP_CODES.OK).json({
        success: true,
        data: admin,
      });
    } catch (error) {
      return res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  },
};
