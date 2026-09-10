const mongoose = require("mongoose");
const { UploadedFileSchema } = require("./uploadedFile");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    avatar: { type: String },
    biography: { type: String, default: null },
    skills: { type: [String], default: [] },
    companyName: { type: String, trim: true, default: null },
    companyDescription: { type: String, trim: true, default: null },
    portfolio: { type: [UploadedFileSchema], default: [] },
    email: { type: String, lowercase: true, trim: true },
    phoneNumber: { type: String, trim: true },
    password: { type: String },
    otp: {
      code: { type: Number, default: 0 },
      expiresIn: { type: Date, default: 0 },
    },
    resetLink: { type: String, default: null },
    isVerifiedPhoneNumber: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    status: { type: Number, required: true, default: 1, enum: [0, 1, 2] }, // 0, 1, 2
    role: { type: String, default: "OWNER" }, // default role is OWNER
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

UserSchema.virtual("avatarUrl").get(function () {
  if (this.avatar) return `${process.env.SERVER_URL}/${this.avatar}`;
  return null;
});

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.avatarUrl = this.avatarUrl;
  delete obj.password;
  delete obj.avatar;
  return obj;
};

UserSchema.index({
  name: "text",
  email: "text",
  phoneNumber: "text",
});

module.exports = {
  UserModel: mongoose.model("User", UserSchema),
};
