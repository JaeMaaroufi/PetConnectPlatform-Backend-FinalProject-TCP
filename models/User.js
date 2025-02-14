const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
      lowercase: true,
    },
    phoneNumber: { type: Number, required: true, unique: true },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return (
            value.length >= 8 && /[A-Z]/.test(value) && /[!@#$%^&*]/.test(value)
          );
        },
        message:
          "Password must be at least 8 characters long and contain uppercase letters and symbols",
      },
    },
    bio: { type: String },
    role: { type: String, enum: ["user", "store"], required: true },
    image: { type: String },
    username: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = model("User", UserSchema);

module.exports = User;
