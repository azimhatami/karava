const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const { UploadedFileSchema } = require("./uploadedFile");

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      required: true,
      default: "OPEN",
      enum: ["OPEN", "CLOSED", "COMPLETED"],
    },
    escrowAmount: { type: Number, default: 0, min: 0 },
    escrowProposal: { type: ObjectId, ref: "Proposal", default: null },
    escrowStatus: {
      type: String,
      required: true,
      default: "none",
      enum: ["none", "held", "released", "refunded"],
    },
    category: { type: ObjectId, ref: "Category", required: true },
    budget: { type: Number, required: true },
    tags: [{ type: String }],
    attachments: { type: [UploadedFileSchema], default: [] },
    deliverables: { type: [UploadedFileSchema], default: [] },
    proposals: { type: [ObjectId], ref: "PROPOSAL", default: [] },
    deadline: { type: Date, required: true },
    owner: { type: ObjectId, required: true, ref: "User" },
    freelancer: { type: ObjectId, default: null, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  ProjectModel: mongoose.model("Project", ProjectSchema),
};
