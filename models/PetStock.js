const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PetStockSchema = new Schema(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    pet: {
      type: Schema.Types.ObjectId,
      ref: "Pet",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    adoptionStatus: {
      type: String,
      enum: ["available", "adopted", "fostered"],
      default: "available",
    },
    vaccinationStatus: {
      type: String,
      enum: ["up-to-date", "pending", "not-applicable"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const PetStock = model("PetStock", PetStockSchema);

module.exports = PetStock;
