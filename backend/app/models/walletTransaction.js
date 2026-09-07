const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const WALLET_TX_TYPES = ["deposit", "hold", "release", "refund"];

const WalletTransactionSchema = new mongoose.Schema(
  {
    wallet: {
      type: ObjectId,
      ref: "Wallet",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: WALLET_TX_TYPES,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    relatedProject: {
      type: ObjectId,
      ref: "Project",
      default: null,
    },
    relatedProposal: {
      type: ObjectId,
      ref: "Proposal",
      default: null,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

WalletTransactionSchema.index({ wallet: 1, createdAt: -1 });

module.exports = {
  WALLET_TX_TYPES,
  WalletTransactionModel: mongoose.model(
    "WalletTransaction",
    WalletTransactionSchema
  ),
};
