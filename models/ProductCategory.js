const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ProductCategorySchema = new Schema({
  name: { type: String },
  Products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const ProductCategory = model("ProductCategory", ProductCategorySchema);

module.exports = ProductCategory;
