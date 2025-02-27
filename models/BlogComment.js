const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const BlogCommentSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    onBlog: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const BlogComment = model("BlogComment", BlogCommentSchema);

module.exports = BlogComment;
