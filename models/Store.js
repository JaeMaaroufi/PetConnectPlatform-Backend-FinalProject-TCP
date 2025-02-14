const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const StoreSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    ownerManagerName: {
      type: String,
      required: true,
    },
    hoursOfOperation: {
      open: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      }, // 24-hour format validation (i.e, 13:00)
      close: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      }, // 24-hour format validation (i.e, 22:00)
    },
    stocks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Stock",
      },
    ],
    image: { type: String },
  },
  { timestamps: true }
);

const Store = model("Store", StoreSchema);

module.exports = Store;
