const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    mobileNo: String,
    email: {
      type: String,
      required: true,
    },
    password: String,
    nickName: String,
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", UserSchema);
