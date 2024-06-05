const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const ProductSchema = new Schema({
  title: { type: String },
  description: { type: String },
  dateAdded: { type: Date },
  onStore: [{ type: Schema.Types.ObjectId, ref: "Store" }],
});

const Product = model("Product", ProductSchema);

module.exports = Product;
