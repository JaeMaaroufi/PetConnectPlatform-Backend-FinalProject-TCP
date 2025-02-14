const express = require("express");
const router = express.Router();
const {
  getStoreByFullName,
  getAllStores,
} = require("../controllers/store.controller");

//to get all stores data.
router.get("/", getAllStores);

//to get store based on storename | query: key = storeName
router.get("/search", getStoreByFullName);

module.exports = router;
