const messages = require("../../json/messages.json");
const enums = require("../../json/enums.json");
const roomAmountSchema = require("../../models/roomAmount/roomAmount");
const utils = require("../../utils/utils");

module.exports = {
  createRoomAmount: async (req, res) => {
    const deivceId = req.user;
    const validateAdmin = await utils.validateAdmin(deivceId);
    if (validateAdmin.success == false) {
      return res.status(enums.HTTP_CODES.UNAUTHORIZED).json({
        success: false,
        message: validateAdmin.message,
      });
    }

    const { amount } = req.body;
    if (!amount) {
      return res.status(enums.HTTP_CODES.VALIDATION_ERROR).json({
        success: true,
        message: messages.NO_AMOUNT_FOUND,
      });
    }

    const existData = await roomAmountSchema.findOne({
      amount: amount,
    });

    if (existData) {
      return res.status(enums.HTTP_CODES.DUPLICATE_VALUE).json({
        success: false,
        message: messages.AMOUNT_ALREADY_EXIST,
      });
    }

    try {
      const roomAmount = await roomAmountSchema.create({
        amount: amount,
      });

      return res.status(enums.HTTP_CODES.OK).json({
        success: true,
        data: roomAmount,
      });
    } catch (error) {
      return res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  },

  getRoomAmount: async (req, res) => {
    try {
      const roomAmount = await roomAmountSchema.find();
      return res.status(enums.HTTP_CODES.OK).json({
        success: true,
        data: roomAmount,
      });
    } catch (error) {
      return res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  },

  updateRoomAmount: async (req, res) => {
    const deivceId = req.user;
    const validateAdmin = await utils.validateAdmin(deivceId);
    if (validateAdmin.success == false) {
      return res.status(enums.HTTP_CODES.UNAUTHORIZED).json({
        success: false,
        message: validateAdmin.message,
      });
    }

    const { amount, id } = req.body;

    if (!amount || !id) {
      return res.status(enums.HTTP_CODES.VALIDATION_ERROR).json({
        success: true,
        message: messages.NO_AMOUNT_FOUND_FOR_UPDATE,
      });
    }

    const existData = await roomAmountSchema.findOne({
      _id: id,
    });
    if (!existData) {
      return res.status(enums.HTTP_CODES.NOT_FOUND).json({
        success: false,
        message: messages.AMOUNT_NOT_FOUND,
      });
    }

    const existAmount = await roomAmountSchema.findOne({
      $and: [
        { _id: { $ne: id } },
        {
          amount: amount,
        },
      ],
    });

    if (existAmount) {
      return res.status(enums.HTTP_CODES.DUPLICATE_VALUE).json({
        success: false,
        message: messages.AMOUNT_ALREADY_EXIST,
      });
    }

    try {
      const roomAmount = await roomAmountSchema.findOneAndUpdate(
        { _id: id },
        {
          amount: amount,
        },
        { new: true }
      );

      return res.status(enums.HTTP_CODES.OK).json({
        success: true,
        data: roomAmount,
      });
    } catch (error) {
      return res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  },

  deleteRoomAmount: async (req, res) => {
    const deivceId = req.user;
    const validateAdmin = await utils.validateAdmin(deivceId);
    if (validateAdmin.success == false) {
      return res.status(enums.HTTP_CODES.UNAUTHORIZED).json({
        success: false,
        message: validateAdmin.message,
      });
    }

    const { id } = req.query;
    if (!id) {
      return res.status(enums.HTTP_CODES.VALIDATION_ERROR).json({
        success: false,
        message: messages.NO_AMOUNT_FOUND_FOR_DELETE,
      });
    }

    const existData = await roomAmountSchema.findOne({
      _id: id,
    });
    if (!existData) {
      return res.status(enums.HTTP_CODES.NOT_FOUND).json({
        success: false,
        message: messages.AMOUNT_NOT_FOUND,
      });
    }

    try {
      const roomAmount = await roomAmountSchema.findOneAndDelete({ _id: id });
      if (roomAmount) {
        return res.status(enums.HTTP_CODES.OK).json({
          success: true,
          message: messages.ROOM_AMOUNT_DELETE_SUCCESS,
        });
      }
    } catch (error) {
      return res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  },
};
