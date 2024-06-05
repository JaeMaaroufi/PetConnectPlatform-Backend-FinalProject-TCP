const Store = require("../models/Store");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (newStore) => {
  const payload = {
    id: newStore._id,
    storeName: newStore.storeName,
    ownerManagerName: newStore.ownerManagerName,
    email: newStore.email,
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: Date.now() + process.env.EXP,
  });
  return token;
};

const getAllStores = async (req, res, next) => {
  try {
    const allStores = await Store.find();
    res.status(200).json({ allStores });
  } catch (error) {
    next(error);
  }
};

const signUp = async (req, res, next) => {
  try {
    if (req.body.password.length >= 8) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;

      const newStore = await Store.create(req.body);

      const generatedToken = generateToken(newStore);
      res
        .status(201)
        .json({ message: "Signed In successfully", generatedToken });
    } else {
      res.status(401).json({
        message:
          "Password must be 8 characters, includes numbers and special characters",
      });
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const payload = req.store;
    const generatedToken = generateToken(payload);
    res.status(201).json({ message: "Logged In successfully", generatedToken });
  } catch (error) {
    next(error);
  }
};

const getStoreDataByStoreName = async (req, res, next) => {
  try {
    const { storeName } = req.params;

    if (!storeName) {
      return res.status(400).json({ error: "Name parameter is required" });
    }

    const store = await Store.findOne({ storeName: storeName });

    res.status(200).json({ store: store });
  } catch (error) {
    next(error);
  }
};

//!this one needs work

const updateStoreData = async (req, res, next) => {
  try {
    if (req.body.password.length >= 8) {
      const { id } = req.params;
      console.log(`This is from the update ${id}`);

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;

      const updatedStore = await Store.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updatedStore) {
        return res.status(404).json({ error: "Store not found" });
      }

      res
        .status(200)
        .json({ message: "store data updated successfully", updatedStore });
    } else {
      res.status(401).json({
        message:
          "Password must be 8 characters, includes numbers and special characters",
      });
    }
  } catch (error) {
    next(error);
  }
};

const deleteStoreData = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`This is from the delete${id}`);
    const deletedStore = await Store.findById(id);

    if (!deletedStore) {
      return res.status(404).json({ error: "Store not found" });
    }

    await Store.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Store deleted successfully", deletedStore });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStores,
  signUp,
  login,
  getStoreDataByStoreName,
  updateStoreData,
  deleteStoreData,
};
