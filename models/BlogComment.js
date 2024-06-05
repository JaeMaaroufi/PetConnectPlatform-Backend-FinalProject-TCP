const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const BlogCommentSchema = new Schema({
  onBlog: {
    type: Schema.Types.ObjectId,
    ref: "Blog",
  },
  content: {
    type: String,
    required: true,
  },
  commentTime: { type: Date },
});

const BlogComment = model("BlogComment", BlogCommentSchema);

module.exports = BlogComment;
