const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const StoreSchema = new Schema(
  {
    profile: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
    ownerManagerName: {
      type: String,
      required: true,
    },
    hoursOfOperation: {
      open: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      }, //for example the front end input should look something like that: "09:00"
      close: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      }, //for example the front end input should look something like that: "18:00"
    },
    ownedProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

const Store = model("Store", StoreSchema);

module.exports = Store;
