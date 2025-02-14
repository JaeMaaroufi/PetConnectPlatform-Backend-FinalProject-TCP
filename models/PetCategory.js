const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PetCategorySchema = new Schema({
  name: { type: String },
});

const PetCategory = model("PetCategory", PetCategorySchema);

module.exports = PetCategory;
