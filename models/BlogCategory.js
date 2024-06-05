const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const BlogCategorySchema = new Schema({
  type: String,
});

const BlogCategory = model("BlogCategory", BlogCategorySchema);

module.exports = BlogCategory;
