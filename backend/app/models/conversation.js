const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const ConversationSchema = new mongoose.Schema(
  {
    project: { type: ObjectId, ref: "Project", required: true },
    proposal: {
      type: ObjectId,
      ref: "Proposal",
      required: true,
      unique: true,
    },
    owner: { type: ObjectId, ref: "User", required: true },
    freelancer: { type: ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

ConversationSchema.index({ owner: 1, updatedAt: -1 });
ConversationSchema.index({ freelancer: 1, updatedAt: -1 });

module.exports = {
  ConversationModel: mongoose.model("Conversation", ConversationSchema),
};
