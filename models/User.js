const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    profile: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
    username: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const User = model("User", UserSchema);

module.exports = User;
