const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const WalletSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    heldBalance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  WalletModel: mongoose.model("Wallet", WalletSchema),
};
