const Store = require("../models/Store");
const Blog = require("../models/Blog");
const BlogComment = require("../models/BlogComment");

const getAllStores = async (req, res, next) => {
  try {
    const allStores = await Store.find().populate({
      path: "user",
      select: "-password",
    });

    res.status(200).json({ allStores });
  } catch (error) {
    next(error);
  }
};

const getStoreByFullName = async (req, res, next) => {
  try {
    const { storeName } = req.query;

    if (!storeName) {
      return res.status(400).json({ error: "Store name is required" });
    }

    const foundStore = await Store.findOne({}).populate({
      path: "user",
      match: { fullname: storeName },
    });

    if (!foundStore || !foundStore.user) {
      return res.status(404).json({ error: "Store not found" });
    }

    res.status(200).json({ store: foundStore });
  } catch (error) {
    next(error);
  }
};

const postBlog = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllStores, getStoreByFullName, postBlog };
