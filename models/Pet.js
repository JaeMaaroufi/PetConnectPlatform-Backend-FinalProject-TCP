const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PetSchema = new Schema(
  {
    name: { type: String },
    breed: { type: String },
    age: { type: Number },
    petCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Pet",
      },
    ],
  },
  { timestamps: true }
);

const Pet = model("Pet", PetSchema);

module.exports = Pet;
