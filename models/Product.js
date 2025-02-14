const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ProductSchema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    ProductCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "ProductCategory",
      },
    ],
  },
  { timestamps: true }
);

const Product = model("Product", ProductSchema);

module.exports = Product;
