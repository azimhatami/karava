const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const ReviewSchema = new mongoose.Schema(
  {
    project: {
      type: ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    proposal: {
      type: ObjectId,
      ref: "Proposal",
      default: null,
    },
    reviewer: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    reviewee: {
      type: ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

ReviewSchema.index({ project: 1, reviewer: 1 }, { unique: true });
ReviewSchema.index({ reviewee: 1, createdAt: -1 });

module.exports = {
  ReviewModel: mongoose.model("Review", ReviewSchema),
};
