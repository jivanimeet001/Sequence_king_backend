const roomSchema = require("../../models/room/room");
const messages = require("../../json/messages.json");
const enums = require("../../json/enums.json");
const userSchema = require("../../models/user/user");

module.exports = {
  createRoom: async (token, data, socketId) => {
    const { amount } = data;
    // const amount = 100;

    const existData = await roomSchema.findOne({
      $and: [
        { amount: amount },
        { player1: { $ne: token } },
        { player2: null },
        { isActive: true },
      ],
    });

    if (existData) {
      const updateData = await roomSchema.findOneAndUpdate(
        { _id: existData._id },
        { $set: { player2: token } },
        { new: true }
      );

      const object = {
        success: true,
        data: updateData,
      };

      return object;
    } else {
      const room = await roomSchema.create({
        amount: amount,
        player1: token,
        player2: null,
        socketId: socketId,
      });

      const object = {
        success: true,
        data: room,
      };

      return object;
    }
  },

  discardRoom: async (response) => {
    const { _id } = response.data;
    try {
      const updateData = await roomSchema.findOneAndUpdate(
        { _id: _id },
        { $set: { isActive: false } },
        { new: true }
      );
      console.log("user discard room");
      return updateData;
    } catch (e) {
      return e;
    }
  },

  winUser: async (responseData, data) => {
    let response = responseData.data;
    if (data.winner === "player1") {
      const player1Amount = await userSchema.findOne({
        deviceId: response.player1,
      });
      const player2Amount = await userSchema.findOne({
        deviceId: response.player2,
      });

      const player1AmountNew = player1Amount.coins + response.amount;
      const player2AmountNew = player2Amount.coins - response.amount;

      await userSchema.findOneAndUpdate(
        { deviceId: response.player1 },
        { $set: { coins: player1AmountNew } },
        { new: true }
      );
      await userSchema.findOneAndUpdate(
        { deviceId: response.player2 },
        { $set: { coins: player2AmountNew } },
        { new: true }
      );
      console.log("player 1 user win");
    } else if (data.winner === "player2") {
      const player1Amount = await userSchema.findOne({
        deviceId: response.player1,
      });
      const player2Amount = await userSchema.findOne({
        deviceId: response.player2,
      });

      const player1AmountNew = player1Amount.coins - response.amount;
      const player2AmountNew = player2Amount.coins + response.amount;

      await userSchema.findOneAndUpdate(
        { deviceId: response.player1 },
        { $set: { coins: player1AmountNew } },
        { new: true }
      );
      await userSchema.findOneAndUpdate(
        { deviceId: response.player2 },
        { $set: { coins: player2AmountNew } },
        { new: true }
      );
      console.log("player 2 user win");
    }
  },

  reMatch: async (responseData, data) => {
    const { _id } = responseData.data;
    try {
      const updateData = await roomSchema.findOneAndUpdate(
        { _id: _id },
        { $set: { isActive: true } },
        { new: true }
      );

      return updateData;
    } catch (e) {
      return e;
    }
  },
};
