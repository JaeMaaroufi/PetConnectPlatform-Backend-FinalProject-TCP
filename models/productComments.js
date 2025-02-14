const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ProductCommentSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    onProduct: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ProductComment = model("ProductComment", ProductCommentSchema);

module.exports = ProductComment;
