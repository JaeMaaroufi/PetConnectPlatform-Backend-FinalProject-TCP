const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const BlogSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    intro: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "BlogCategory",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Blog = model("Blog", BlogSchema);

module.exports = Blog;
