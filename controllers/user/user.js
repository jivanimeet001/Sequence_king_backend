const userSchema = require("../../models/user/user");
const enums = require("../../json/enums.json");
const utils = require("../../utils/utils");
const messages = require("../../json/messages.json");

module.exports = {
  createUser: async (req, res) => {
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(enums.HTTP_CODES.VALIDATION_ERROR).json({
        success: true,
        message: messages.NO_DEVICEID_FOUND,
      });
    }
    const existData = await userSchema.findOne({
      deviceId: deviceId,
    });

    if (existData) {
      if (existData.status.name != "active") {
        return res.status(enums.HTTP_CODES.DUPLICATE_VALUE).json({
          success: false,
          message: messages.ACCOUNT_BLOCKED,
        });
      }
      return res.status(enums.HTTP_CODES.OK).json({
        success: true,
        data: existData,
      });
    }

    try {
      const userData = await userSchema.create({
        name: "You",
        deviceId: deviceId,
        profileId: 0,
        coins: 500,
        noAds: 0,
        status: {
          name: enums.USER_STATUS.ACTIVE,
        },
      });

      return res.status(enums.HTTP_CODES.OK).json({
        success: true,
        data: userData,
      });
    } catch (error) {
      return res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  },

  getUser: async (req, res) => {
    const data = req.user;

    if (data) {
      return res.status(enums.HTTP_CODES.OK).json({
        success: true,
        data: data,
      });
    } else {
      return res.status(enums.HTTP_CODES.UNAUTHORIZED).json({
        success: false,
        message: messages.USER_NOT_FOUND,
      });
    }
  },

  getAllUsers: async (req, res) => {
    const deivceIdAdmin = req.user;
    const validateAdmin = await utils.validateAdmin(deivceIdAdmin);
    if (validateAdmin.success === false) {
      return res.status(enums.HTTP_CODES.UNAUTHORIZED).json({
        success: false,
        message: validateAdmin.message,
      });
    }

    try {
      const users = await userSchema.find();
      return res.status(enums.HTTP_CODES.OK).json({
        success: true,
        data: users,
      });
    } catch (error) {
      return res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  },

  updateUser: async (req, res) => {
    const data = req.user;
    const { name, profileId, coins, noAds } = req.body;

    const object4update = {
      $set: {
        name: name ? name : data.name,
        profileId: profileId ? profileId : data.profileId,
        coins: coins ? coins : data.coins,
        noAds: noAds ? noAds : data.noAds,
      },
    };

    try {
      const updateUser = await userSchema.findOneAndUpdate(
        {
          deviceId: data.deviceId,
        },
        object4update,
        { new: true }
      );

      return res.status(enums.HTTP_CODES.OK).json({
        success: true,
        data: updateUser,
      });
    } catch (error) {
      return res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  },

  activeDeactiveUser: async (req, res) => {
    const deivceIdAdmin = req.user;
    const validateAdmin = await utils.validateAdmin(deivceIdAdmin);
    if (validateAdmin.success === false) {
      return res.status(enums.HTTP_CODES.UNAUTHORIZED).json({
        success: false,
        message: validateAdmin.message,
      });
    }

    const { deviceId } = req.body;
    if (!deviceId) {
      return res.status(enums.HTTP_CODES.VALIDATION_ERROR).json({
        success: true,
        message: messages.NO_DEVICEID_FOUND,
      });
    }

    const existData = await userSchema.findOne({
      deviceId: deviceId,
    });

    console.log("existData", existData);
    if (!existData) {
      return res.status(enums.HTTP_CODES.NOT_FOUND).json({
        success: false,
        message: messages.USER_NOT_FOUND,
      });
    }

    let object4update = {};

    if (existData.status.name === enums.USER_STATUS.ACTIVE) {
      object4update = {
        $set: {
          status: {
            name: enums.USER_STATUS.INACTIVE,
          },
        },
      };
    } else {
      object4update = {
        $set: {
          status: {
            name: enums.USER_STATUS.ACTIVE,
          },
        },
      };
    }

    const updateUser = await userSchema.findOneAndUpdate(
      {
        deviceId: deviceId,
      },
      object4update,
      { new: true }
    );

    if (updateUser) {
      return res
        .status(enums.HTTP_CODES.OK)
        .json({ success: true, data: updateUser });
    }
  },

  deleteUser: async (req, res) => {
    const deivceIdAdmin = req.user;
    const validateAdmin = await utils.validateAdmin(deivceIdAdmin);
    if (validateAdmin.success == false) {
      return res.status(enums.HTTP_CODES.UNAUTHORIZED).json({
        success: false,
        message: validateAdmin.message,
      });
    }

    const { deviceId } = req.body;
    if (!deviceId) {
      return res.status(enums.HTTP_CODES.VALIDATION_ERROR).json({
        success: true,
        message: messages.NO_DEVICEID_FOUND,
      });
    }

    const existData = await userSchema.findOne({
      deviceId: deviceId,
    });

    if (!existData) {
      return res.status(enums.HTTP_CODES.NOT_FOUND).json({
        success: false,
        message: messages.USER_NOT_FOUND,
      });
    }

    try {
      const deleteUser = await userSchema.findOneAndDelete({
        deviceId: deviceId,
      });

      return res.status(enums.HTTP_CODES.OK).json({
        success: true,
        data: deleteUser,
      });
    } catch (error) {
      return res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  },
};
