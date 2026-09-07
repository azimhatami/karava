const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const MessageSchema = new mongoose.Schema(
  {
    conversation: {
      type: ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    sender: { type: ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

MessageSchema.index({ conversation: 1, createdAt: -1 });

module.exports = {
  MessageModel: mongoose.model("Message", MessageSchema),
};
