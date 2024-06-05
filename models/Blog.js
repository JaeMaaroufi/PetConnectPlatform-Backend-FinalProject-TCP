const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const BlogSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  intro: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  dateCreated: { type: Date },
  dateModified: { type: Date },
  image: { type: String },
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: "BlogCategory",
    },
  ],
});

const Blog = model("Blog", BlogSchema);

module.exports = Blog;
