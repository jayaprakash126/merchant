const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    contactNo: { type: Number },
    dialCode: { type: Number },
    isOrganizationUser: { type: Boolean, default: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    referralNo: { type: String, required: true },
    refreshToken: { type: String },
    lastActive: { type: Date, required: true, default: Date.now },
    lastLogin: { type: Date, required: true, default: Date.now }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
