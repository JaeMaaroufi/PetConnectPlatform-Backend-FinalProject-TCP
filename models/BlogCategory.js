const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const BlogCategorySchema = new Schema({
  name: { type: String },
  blogs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

const BlogCategory = model("BlogCategory", BlogCategorySchema);

module.exports = BlogCategory;
