const User = require("../models/User");
const Store = require("../models/Store");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authenticateUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(404).json({ error: "Incorrect email or password" });
    }

    const comparedPasswords = await bcrypt.compare(
      password,
      foundUser.password
    );
    if (!comparedPasswords) {
      return res.status(400).json({ error: "Incorrect email or password" });
    }

    let roleSpecificDetails = {};

    if (foundUser.role === "store") {
      const foundStore = await Store.findOne({ user: foundUser._id });
      if (!foundStore) {
        return res.status(404).json({ error: "Store not found" });
      }
      roleSpecificDetails = { store: foundStore };
    }

    req.user = foundUser;
    req.roleSpecificDetails = roleSpecificDetails;

    next();
  } catch (error) {
    next(error);
  }
};

const verifyAccessToken = (token) => {
  try {
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    return { success: true, data: decodedData };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Please log in to proceed" });
    }

    const result = verifyAccessToken(token);

    if (!result.success) {
      return res.status(403).json({ error: result.error });
    }

    if (Date.now() >= result.data.exp * 1000) {
      return res.status(401).json({ message: "Token has expired" });
    }

    req.user = result.data;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticateUser,
  authenticateToken,
};
